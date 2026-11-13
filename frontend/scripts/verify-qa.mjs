import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { setTimeout } from "node:timers/promises";
const origin = "https://preview.tiendly.workers.dev";
const release = JSON.parse(await readFile(new URL("../.wrangler/preview/release.json", import.meta.url), "utf8"));
let healthy = false;
for (let attempt = 0; attempt < 12; attempt++) {
  try {
    const response = await fetch(`${origin}/_tiendly/health`, { headers: { "Cache-Control": "no-cache" }, signal: AbortSignal.timeout(10000) });
    const body = await response.json();
    if (response.status === 200 && body.status === "ok" && body.revision === release.revision && body.environment === "preview" && body.dirty === false) { healthy = true; break; }
  } catch { /* Propagación del Worker recién publicado. */ }
  await setTimeout(5000);
}
assert(healthy, `QA no confirmó salud y commit ${release.revision}. Revisa el despliegue; no se ejecuta rollback ni migración automáticamente.`);
for (const [path, expected] of [["/registro", 200], ["/muna", 200], ["/api/auth/get-session", 200], ["/api/business/stores", 401], ["/api/business/catalog", 401], ["/heather", 404], ["/mi-tienda/foto.jpg", 404]]) {
  const response = await fetch(origin + path, { redirect: "manual", signal: AbortSignal.timeout(15000) });
  assert.equal(response.status, expected, `${path}: HTTP inesperado.`);
  assert(response.headers.get("x-robots-tag")?.includes("noindex"), `${path}: falta noindex.`);
  if (path === "/api/auth/get-session") assert.equal(await response.json(), null);
  else await response.arrayBuffer();
  console.log(`${expected} ${path}`);
}
console.log(`QA verificado: ${origin}, commit ${release.revision}. Sin escrituras.`);
