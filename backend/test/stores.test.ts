import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Miniflare, convertV4MiniflareOptions } from "miniflare";
import type { D1Database } from "@cloudflare/workers-types";
import { betterAuth } from "better-auth";
import { testUtils } from "better-auth/plugins";
import { getMigrations } from "better-auth/db/migration";
import { environment, testLoginAllowed, BusinessError } from "../src/identity/domain/access.ts";
import { createAuth } from "../src/identity/adapters/better-auth.ts";
import { canUse, effectivePlan } from "../src/stores/domain/store.ts";
import { createStore, renameStore, ownedStore, type StoreDependencies } from "../src/stores/application/stores.ts";
import { D1Stores } from "../src/stores/adapters/d1-stores.ts";
import { createRuntime } from "../src/runtime/business.ts";
import { storesHandler } from "../src/runtime/stores-handler.ts";

const input = { slug: "home-objects", name: "  Objetos para casa  ", salesPhone: "900000000", categories: ["home", "handmade"], otherCategory: "" };
const config = { baseURL: "http://localhost:3215", secret: "test-only-secret-with-more-than-32-characters", googleClientId: "test-only-client", googleClientSecret: "test-only-secret" };
const newMF = (persist?: string) => new Miniflare({ ...convertV4MiniflareOptions({ modules: true, script: 'export default { fetch() { return new Response("ok") } }', compatibilityDate: "2026-11-08", d1Databases: ["DB"],  }), ...(persist ? { resourcePersistencePath: persist } : {}) });
async function fixture() {
  const mf = newMF();
  const db = await mf.getD1Database("DB") as unknown as D1Database;
  await migrate(db);
  const deps: StoreDependencies = { stores: new D1Stores(db), environment: "production", now: () => "2026-11-08T12:00:00.000Z", newId: () => crypto.randomUUID() };
  return { mf, db, deps };
}
async function migrate(db: D1Database) {
  for (const file of ["0001_auth.sql", "0002_stores.sql"]) {
    const sql = await readFile(new URL(`../db/migrations/${file}`, import.meta.url), "utf8");
    for (const statement of sql.replace(/^--.*$/gm, "").split(";").filter(x => x.trim())) await db.prepare(statement).run();
  }
}
async function user(db: D1Database, id: string) {
  await db.prepare('INSERT INTO user(id,name,email,emailVerified,createdAt,updatedAt) VALUES(?,?,?,1,?,?)').bind(id, "Test", `${id}@example.invalid`, Date.now(), Date.now()).run();
}
const errorCode = (code: string) => (e: unknown) => e instanceof BusinessError && e.code === code;

test("environment and test login fail closed; founder expiry is a Lima calendar boundary", () => {
  for (const value of [undefined, "", "prod", "LOCAL", "production"]) { assert.equal(environment(value), "production"); assert.equal(testLoginAllowed(value, "true"), false); }
  assert.equal(testLoginAllowed("local", "true"), true);
  assert.equal(testLoginAllowed("preview", "false"), false);
  assert.equal(testLoginAllowed("preview", true), false);
  assert.equal(effectivePlan("founder", "2027-02-28", "2027-02-28"), "founder");
  assert.equal(effectivePlan("founder", "2027-02-28", "2027-03-01"), "free");
  assert.equal(effectivePlan("unknown", null, "2026-11-08"), "free");
  assert.equal(effectivePlan("founder", "9999-99-99", "2026-11-08"), "free");
  assert.equal(canUse("pro", null, "unknown", "2026-11-08"), false);
});

test("store creation is atomic, scoped and initializes only empty business settings", async () => {
  const { mf, db, deps } = await fixture();
  try {
    await user(db, "owner"); await user(db, "foreign");
    await assert.rejects(createStore(deps, null, input), errorCode("unauthorized"));
    const store = await createStore(deps, { userId: "owner" }, input);
    assert.equal(store.name, "Objetos para casa"); assert.equal(store.plan, "free");
    assert.equal(await ownedStore(deps, { userId: "foreign" }), null);
    assert.equal((await db.prepare('SELECT COUNT(*) AS n FROM delivery_zones WHERE store_id=? AND enabled=0 AND cost_cents IS NULL').bind(store.id).first<{n:number}>())?.n, 3);
    assert.equal((await db.prepare('SELECT automatic_status FROM payment_settings WHERE store_id=?').bind(store.id).first<{automatic_status:string}>())?.automatic_status, "inactive");
    await assert.rejects(createStore(deps, { userId: "missing-user" }, { ...input, slug: "rollback-store" }));
    assert.equal(await deps.stores.findBySlug("rollback-store"), null);
    await assert.rejects(renameStore(deps, { userId: "foreign" }, store.id, 1, "Hacked"), errorCode("forbidden"));
  } finally { await mf.dispose(); }
});

test("database constraints settle concurrent owners, slugs and expected versions", async () => {
  const { mf, db, deps } = await fixture();
  try {
    await user(db, "one"); await user(db, "two"); await user(db, "three");
    const ownerRace = await Promise.allSettled([createStore(deps,{userId:"one"},input), createStore(deps,{userId:"one"},{...input,slug:"other-store"})]);
    assert.equal(ownerRace.filter(x=>x.status==="fulfilled").length,1);
    assert.equal((await db.prepare('SELECT COUNT(*) AS n FROM stores').first<{n:number}>())?.n,1);
    const slugRace = await Promise.allSettled([createStore(deps,{userId:"two"},{...input,slug:"shared"}),createStore(deps,{userId:"three"},{...input,slug:"shared"})]);
    assert.equal(slugRace.filter(x=>x.status==="fulfilled").length,1);
    const store=(await deps.stores.findOwned("one"))!;
    const edits=await Promise.allSettled([renameStore(deps,{userId:"one"},store.id,1,"First name"),renameStore(deps,{userId:"one"},store.id,1,"Second name")]);
    assert.equal(edits.filter(x=>x.status==="fulfilled").length,1);
    assert.equal((await deps.stores.findOwned("one"))?.version,2);
    assert.equal((await db.prepare('SELECT COUNT(*) AS n FROM write_guards').first<{n:number}>())?.n,0);
    await db.prepare('UPDATE stores SET is_demo=1 WHERE id=?').bind(store.id).run();
    await assert.rejects(renameStore(deps,{userId:"one"},store.id,2,"Demo write"),errorCode("forbidden"));
  } finally { await mf.dispose(); }
});

test("real Better Auth session boundary rejects forged slug cookies, foreign IDs, cross-origin and revoked sessions", async () => {
  const { mf, db } = await fixture();
  try {
    const auth=createAuth(db,config);
    const testAuth=betterAuth({...auth.options,plugins:[testUtils()]});
    const helpers=(await testAuth.$context).test;
    const owner=await helpers.saveUser(helpers.createUser({email:"owner@example.invalid"}));
    const outsider=await helpers.saveUser(helpers.createUser({email:"outsider@example.invalid"}));
    const login=await helpers.login({userId:owner.id});
    const otherLogin=await helpers.login({userId:outsider.id});
    const { runtime }=createRuntime({DB:db,TIENDLY_ENTORNO:"production",BETTER_AUTH_URL:config.baseURL,BETTER_AUTH_SECRET:config.secret,GOOGLE_CLIENT_ID:config.googleClientId,GOOGLE_CLIENT_SECRET:config.googleClientSecret});
    const request=(method:string,headers:HeadersInit={},data?:unknown)=>new Request(config.baseURL+"/api/business/stores",{method,headers:{origin:config.baseURL,"content-type":"application/json",...Object.fromEntries(new Headers(headers))},...(data===undefined?{}:{body:JSON.stringify(data)})});
    assert.equal((await storesHandler(request("POST",{cookie:"tiendly_tienda=muna"},input),runtime)).status,401);
    const created=await storesHandler(request("POST",login.headers,input),runtime);
    assert.equal(created.status,201);
    const store=(await created.json() as {store:{id:string}}).store;
    const foreign=await storesHandler(request("PATCH",otherLogin.headers,{id:store.id,version:1,name:"Foreign"}),runtime);
    assert.equal(foreign.status,403);
    assert.equal((await storesHandler(request("PATCH",{...Object.fromEntries(login.headers),origin:"https://foreign.invalid"},{id:store.id,version:1,name:"Foreign"}),runtime)).status,403);
    const read=await storesHandler(request("GET",login.headers),runtime);
    assert.equal(read.headers.get("cache-control"),"private, no-store");
    assert.equal((await read.json() as {store:{id:string}}).store.id,store.id);
    await auth.api.signOut({headers:login.headers});
    assert.equal((await storesHandler(request("GET",login.headers),runtime)).status,401);
    const pending=await getMigrations(auth.options);
    assert.deepEqual(pending.toBeCreated,[]); assert.deepEqual(pending.toBeAdded,[]);
  } finally { await mf.dispose(); }
});

test("owned stores and initial settings survive a runtime restart",async()=>{
 const directory=await mkdtemp(join(tmpdir(),"tiendly-stores-"));
 let mf=newMF(directory);
 try {
   let db=await mf.getD1Database("DB") as unknown as D1Database;
   await migrate(db);await user(db,"persistent");
   const store=await createStore({stores:new D1Stores(db),environment:"local",now:()=>new Date().toISOString(),newId:()=>crypto.randomUUID()},{userId:"persistent"},input);
   await mf.dispose();mf=newMF(directory);db=await mf.getD1Database("DB") as unknown as D1Database;
   assert.equal((await new D1Stores(db).findOwned("persistent"))?.id,store.id);
   assert.equal((await db.prepare('SELECT COUNT(*) AS n FROM payment_settings').first<{n:number}>())?.n,1);
 }finally{await mf.dispose();await rm(directory,{recursive:true,force:true});}
});
