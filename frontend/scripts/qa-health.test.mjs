import assert from "node:assert/strict";
import test from "node:test";
import { qaHealth } from "./qa-health.mjs";
const release = { revision: "a".repeat(40), migrations: ["0001_auth.sql", "0002_stores.sql"] };
function bindings() {
  return {
    TIENDLY_ENTORNO: "preview", BETTER_AUTH_URL: "https://preview.tiendly.workers.dev",
    BETTER_AUTH_SECRET: "private-session", GOOGLE_CLIENT_ID: "private-id", GOOGLE_CLIENT_SECRET: "private-secret",
    DB: { prepare: () => ({ all: async () => ({ results: release.migrations.map(name => ({ name })) }) }) },
    UPLOADS: { head: async () => null },
  };
}
const request = new Request("https://preview.tiendly.workers.dev/_tiendly/health");
test("health acredita commit, esquema, auth y acceso R2 sin escribir", async () => {
  const response = await qaHealth(request, bindings(), release);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("cache-control"), "no-store");
  const body = await response.text();
  assert.equal(JSON.parse(body).revision, release.revision);
  assert(!body.includes("private-"));
});
test("health falla ante migraciones pendientes, bindings inaccesibles y auth incompleto", async () => {
  for (const change of [
    env => { env.DB.prepare = () => ({ all: async () => ({ results: [] }) }); },
    env => { env.DB = undefined; },
    env => { env.UPLOADS.head = async () => { throw new Error("internal-private-detail"); }; },
    env => { env.GOOGLE_CLIENT_SECRET = undefined; },
    env => { env.TIENDLY_ENTORNO = "production"; },
  ]) {
    const env = bindings(); change(env);
    const response = await qaHealth(request, env, release);
    assert.equal(response.status, 503);
    assert(!(await response.text()).includes("internal-private-detail"));
  }
});
test("health responde HEAD sin cuerpo y no acepta escrituras", async () => {
  const head = await qaHealth(new Request(request, { method: "HEAD" }), bindings(), release);
  assert.equal(head.status, 200); assert.equal(await head.text(), "");
  assert.equal((await qaHealth(new Request(request, { method: "POST" }), bindings(), release)).status, 405);
});
