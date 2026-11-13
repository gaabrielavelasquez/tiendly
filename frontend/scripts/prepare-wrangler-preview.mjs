import assert from "node:assert/strict";
import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { execFileSync } from "node:child_process";

// La base vinext genera Build Output para cf. Wrangler necesita su propio
// manifiesto: se copia el artefacto, sin recompilar ni cambiar la configuración fuente.
const root = resolve(import.meta.dirname, "..");
const source = resolve(root, ".cloudflare/output/v0/workers/default");
const output = resolve(root, ".wrangler/preview");
const worker = JSON.parse(await readFile(resolve(source, "worker.config.json"), "utf8"));

// Solo recursos del preview, nunca producción. Los valores secretos se guardan
// con Wrangler, no se leen ni se escriben en este manifiesto.
assert.equal(worker.name, "preview");
assert.equal(worker.manifest.mainModule, "index.js");
assert.deepEqual(Object.keys(worker.manifest.modules), []);
assert.deepEqual(worker.env, {
  ASSETS: { type: "assets" },
  UPLOADS: { type: "r2", name: "tiendly-preview-images" },
  DB: { type: "d1", name: "tiendly-preview", id: "9fcfd54b-56a2-4cb9-af11-800e5191e93d" },
  BETTER_AUTH_URL: { type: "text", value: "https://preview.tiendly.workers.dev" },
  BETTER_AUTH_SECRET: { type: "secret" },
  GOOGLE_CLIENT_ID: { type: "secret" },
  GOOGLE_CLIENT_SECRET: { type: "secret" },
  TIENDLY_TIENDA_DEMO: { type: "text", value: "muna" },
  TIENDLY_ENTORNO: { type: "text", value: "preview" },
});
const entries = await readdir(resolve(source, "assets"));
for (const privateDirectory of ["heather", "mi-tienda"]) {
  assert(!entries.includes(privateDirectory), `No se puede publicar ${privateDirectory}.`);
}

const revision = execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).trim();
assert.match(revision, /^[0-9a-f]{40}$/);
if (process.env.GITHUB_SHA) assert.equal(revision, process.env.GITHUB_SHA, "El artefacto debe corresponder al commit de CI.");
const dirty = Boolean(execFileSync("git", ["status", "--porcelain"], { cwd: root, encoding: "utf8" }).trim());
const release = { revision, dirty, migrations: (await readdir(resolve(root, "../backend/db/migrations"))).filter(name => name.endsWith(".sql")).sort() };

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(resolve(source, "bundle"), resolve(output, "bundle"), { recursive: true });
await cp(resolve(source, "assets"), resolve(output, "assets"), { recursive: true });
await cp(resolve(root, "scripts/qa-health.mjs"), resolve(output, "bundle/preview-health.js"));
await writeFile(resolve(output, "release.json"), JSON.stringify(release, null, 2) + "\n");
await writeFile(resolve(output, "bundle/preview-entry.js"), `
import app from "./index.js";
import { qaHealth } from "./preview-health.js";
const release = ${JSON.stringify(release)};
export default {
  async fetch(request, env, context) {
    // El runtime puede haber iniciado streaming antes de ejecutar notFound().
    // Estas rutas privadas siempre se rechazan antes de entrar a la app.
    const path = new URL(request.url).pathname;
    if (/^\\/(heather|mi-tienda)(\\/|$)/.test(path)) {
      return new Response("Not found", { status: 404, headers: { "X-Robots-Tag": "noindex" } });
    }
    if (path === "/_tiendly/health") return qaHealth(request, env, release);
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
  d1_databases: [{
    binding: "DB",
    database_name: worker.env.DB.name,
    database_id: worker.env.DB.id,
    migrations_dir: resolve(root, "../backend/db/migrations"),
  }],
  r2_buckets: [{ binding: "UPLOADS", bucket_name: worker.env.UPLOADS.name }],
  assets: {
    directory: "assets",
    binding: "ASSETS",
    html_handling: worker.assets.htmlHandling,
    not_found_handling: worker.assets.notFoundHandling,
    run_worker_first: worker.assets.runWorkerFirst,
  },
  vars: {
    BETTER_AUTH_URL: worker.env.BETTER_AUTH_URL.value,
    TIENDLY_TIENDA_DEMO: worker.env.TIENDLY_TIENDA_DEMO.value,
    TIENDLY_ENTORNO: worker.env.TIENDLY_ENTORNO.value,
  },
}, null, 2) + "\n");
console.log("Preview preparado para Wrangler: cuenta Tiendly, D1 y R2 exclusivos de pruebas.");
