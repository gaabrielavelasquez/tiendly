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
