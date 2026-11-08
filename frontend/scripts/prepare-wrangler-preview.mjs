import assert from "node:assert/strict";
import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

// La base vinext genera Build Output para cf. Wrangler necesita su propio
// manifiesto: se copia el artefacto, sin recompilar ni cambiar la configuración fuente.
const root = resolve(import.meta.dirname, "..");
const source = resolve(root, ".cloudflare/output/v0/workers/default");
const output = resolve(root, ".wrangler/preview");
const worker = JSON.parse(await readFile(resolve(source, "worker.config.json"), "utf8"));

// Este puente solo permite el primer preview con memoria, nunca producción,
// secretos ni bindings de datos. Ampliarlo requiere revisar esa integración.
assert.equal(worker.name, "tiendly-preview");
assert.equal(worker.manifest.mainModule, "index.js");
assert.deepEqual(Object.keys(worker.manifest.modules), []);
assert.deepEqual(worker.env, {
  ASSETS: { type: "assets" },
  TIENDLY_TIENDA_DEMO: { type: "text", value: "muna" },
  TIENDLY_ENTORNO: { type: "text", value: "preview" },
});
const entries = await readdir(resolve(source, "assets"));
for (const privateDirectory of ["heather", "mi-tienda"]) {
  assert(!entries.includes(privateDirectory), `No se puede publicar ${privateDirectory}.`);
}

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(resolve(source, "bundle"), resolve(output, "bundle"), { recursive: true });
await cp(resolve(source, "assets"), resolve(output, "assets"), { recursive: true });
await writeFile(resolve(output, "bundle/preview-entry.js"), `
import app from "./index.js";
export default {
  async fetch(request, env, context) {
    // El runtime puede haber iniciado streaming antes de ejecutar notFound().
    // Estas rutas privadas siempre se rechazan antes de entrar a la app.
    const path = new URL(request.url).pathname;
    if (/^\\/(heather|mi-tienda)(\\/|$)/.test(path)) {
      return new Response("Not found", { status: 404, headers: { "X-Robots-Tag": "noindex" } });
    }
    const result = await app.fetch(request, env, context);
    const response = new Response(result.body, result);
    response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
    return response;
  },
};
`);
await writeFile(resolve(output, "wrangler.json"), JSON.stringify({
  name: worker.name,
  account_id: "59f2586c7dd8a0467d1f9e444129e03a",
  main: "bundle/preview-entry.js",
  compatibility_date: worker.compatibilityDate,
  compatibility_flags: worker.compatibilityFlags,
  no_bundle: true,
  find_additional_modules: true,
  rules: [{ type: "ESModule", globs: ["**/*.js"] }],
  workers_dev: true,
  preview_urls: true,
  observability: { enabled: true },
  assets: {
    directory: "assets",
    binding: "ASSETS",
    html_handling: worker.assets.htmlHandling,
    not_found_handling: worker.assets.notFoundHandling,
    run_worker_first: worker.assets.runWorkerFirst,
  },
  vars: {
    TIENDLY_TIENDA_DEMO: worker.env.TIENDLY_TIENDA_DEMO.value,
    TIENDLY_ENTORNO: worker.env.TIENDLY_ENTORNO.value,
    // Compatibilidad temporal: el código actual todavía consulta VERCEL_ENV.
    VERCEL_ENV: "preview",
  },
}, null, 2) + "\n");
console.log("Preview preparado para Wrangler: cuenta Tiendly, MUÑA y memoria temporal.");
