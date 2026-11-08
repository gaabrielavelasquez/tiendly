import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = await readFile(new URL("../.wrangler/preview/bundle/preview-entry.js", import.meta.url), "utf8");
const stubbed = source.replace('import app from "./index.js";', `
const app = { fetch: async () => new Response("contenido", {
  status: 201, headers: { "Content-Type": "text/plain", "Set-Cookie": "sesion=prueba; HttpOnly" },
}) };
`);
const { default: entry } = await import(`data:text/javascript;base64,${Buffer.from(stubbed).toString("base64")}`);

test("el preview conserva cuerpo, estado y cookies de la app", async () => {
  const response = await entry.fetch(new Request("https://preview.example/muna"), {}, {});
  assert.equal(response.status, 201);
  assert.equal(await response.text(), "contenido");
  assert.equal(response.headers.get("Set-Cookie"), "sesion=prueba; HttpOnly");
  assert.equal(response.headers.get("X-Robots-Tag"), "noindex, nofollow, noarchive");
});

test("las rutas excluidas responden 404 antes de entrar a la app", async () => {
  for (const path of ["/heather", "/heather/logo.png", "/mi-tienda/foto.jpg"]) {
    const response = await entry.fetch(new Request(`https://preview.example${path}`), {}, {});
    assert.equal(response.status, 404);
    assert.equal(await response.text(), "Not found");
  }
});

test("el manifiesto solo conecta D1/R2 de pruebas y no publica secretos ni ingreso simulado", async () => {
  const config = JSON.parse(await readFile(new URL("../.wrangler/preview/wrangler.json", import.meta.url), "utf8"));
  assert.equal(config.account_id, "59f2586c7dd8a0467d1f9e444129e03a");
  assert.equal(config.name, "tiendly-preview");
  assert.equal(config.d1_databases.length, 1);
  assert.equal(config.d1_databases[0].database_name, "tiendly-preview");
  assert.equal(config.d1_databases[0].database_id, "9fcfd54b-56a2-4cb9-af11-800e5191e93d");
  assert.deepEqual(config.r2_buckets, [{ binding: "UPLOADS", bucket_name: "tiendly-preview-images" }]);
  assert.deepEqual(Object.keys(config.vars).sort(), ["BETTER_AUTH_URL", "TIENDLY_ENTORNO", "TIENDLY_TIENDA_DEMO"]);
  assert.equal(config.vars.TIENDLY_ENTORNO, "preview");
  assert.equal(config.vars.BETTER_AUTH_URL, "https://tiendly-preview.tiendly.workers.dev");
  assert.equal(config.routes, undefined);
});
