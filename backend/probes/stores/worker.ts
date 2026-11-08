import type { D1Database } from "@cloudflare/workers-types";
import { D1Stores } from "../../src/stores/adapters/d1-stores.ts";
import { createStore, renameStore } from "../../src/stores/application/stores.ts";

// Disposable database only. Generates synthetic users and stores; no authentication bypass in the app.
export default {
  async fetch(_request: Request, { DB: db }: { DB: D1Database }) {
    const id = crypto.randomUUID();
    await db.prepare('INSERT INTO user(id,name,email,emailVerified,createdAt,updatedAt) VALUES(?,?,?,1,?,?)').bind(id,"Probe",`${id}@example.invalid`,Date.now(),Date.now()).run();
    const deps = { stores: new D1Stores(db), environment: "production" as const, now: () => new Date().toISOString(), newId: () => crypto.randomUUID() };
    const input = { slug: `test-${id.slice(0,20)}`, name: "Remote test", salesPhone: "900000000", categories: ["home"], otherCategory: "" };
    const creates = await Promise.allSettled([createStore(deps,{userId:id},input),createStore(deps,{userId:id},{...input,slug:`other-${id.slice(0,20)}`})]);
    const store = (await deps.stores.findOwned(id))!;
    const edits = await Promise.allSettled([renameStore(deps,{userId:id},store.id,1,"First edit"),renameStore(deps,{userId:id},store.id,1,"Second edit")]);
    let foreignRejected = false;
    try { await renameStore(deps,{userId:"foreign"},store.id,2,"Foreign"); } catch { foreignRejected=true; }
    const memberships = await db.prepare('SELECT COUNT(*) AS n FROM memberships WHERE user_id=?').bind(id).first<{n:number}>();
    const zones = await db.prepare('SELECT COUNT(*) AS n FROM delivery_zones WHERE store_id=? AND enabled=0 AND cost_cents IS NULL').bind(store.id).first<{n:number}>();
    const result = {
      competingCreates: creates.filter(x=>x.status==="fulfilled").length===1 && memberships?.n===1,
      competingEdits: edits.filter(x=>x.status==="fulfilled").length===1 && (await deps.stores.findOwned(id))?.version===2,
      foreignRejected,
      initialSettings: zones?.n===3,
    };
    await db.prepare('DELETE FROM stores WHERE id=?').bind(store.id).run();
    await db.prepare('DELETE FROM user WHERE id=?').bind(id).run();
    return Response.json(result,{status:Object.values(result).every(Boolean)?200:500});
  },
};
