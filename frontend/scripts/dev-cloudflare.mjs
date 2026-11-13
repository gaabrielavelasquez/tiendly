import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { resolve } from "node:path";
import { setTimeout } from "node:timers/promises";
import { prepareLocalVars } from "./local-vars.mjs";

const root = resolve(import.meta.dirname, "..");
const origin = "http://localhost:3215";
let server;
function stop() { server?.kill("SIGTERM"); }
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
try {
  // Nunca permitir que Vite elija otro puerto o migrar un proceso ajeno.
  const port = createServer();
  await new Promise((done, fail) => { port.once("error", fail); port.listen(3215, "localhost", done); });
  await new Promise(done => port.close(done));
  const { google } = await prepareLocalVars(resolve(root, ".dev.vars"));
  server = spawn(process.execPath, [resolve(root, "../node_modules/vite/bin/vite.js"), "dev", "--host", "localhost", "--port", "3215", "--strictPort"], {
    cwd: root, stdio: "inherit", env: { ...process.env, CLOUDFLARE_INCLUDE_PROCESS_ENV: "false", CLOUDFLARE_LOAD_DEV_VARS_FROM_DOT_ENV: "false" },
  });
  const exited = new Promise(done => { server.once("exit", code => done(code ?? 1)); server.once("error", () => done(1)); });
  let ready = false;
  for (let attempt = 0; attempt < 120 && server.exitCode === null && !server.killed; attempt++) {
    try {
      const response = await fetch(`${origin}/cdn-cgi/local/explorer/api/d1/database`, { signal: AbortSignal.timeout(1500) });
      const data = await response.json();
      if (response.ok && data.success && data.result.some(db => db.name === "DB")) { ready = true; break; }
    } catch { /* Esperar el arranque del emulador. */ }
    await setTimeout(500);
  }
  if (!ready) throw new Error("El Worker local no arrancó; revisa el error de Vite.");
  const migration = spawn("python3", [resolve(root, "../backend/scripts/migrate-local.py"), "--origin", origin], { stdio: "inherit" });
  const code = await new Promise(done => { migration.once("exit", done); migration.once("error", () => done(1)); });
  if (code !== 0) throw new Error("No se pudieron aplicar las migraciones locales.");
  console.log(`\nDesarrollo local listo: ${origin}/registro`);
  console.log("D1 y R2 emulados en .wrangler/state; los recursos remotos no se usan.");
  console.log(google ? "Google configurado: verifica que el cliente de pruebas autorice el callback local." : "Google pendiente: configura el cliente de pruebas en .dev.vars para ingresar.");
  process.exitCode = await exited;
} catch (error) {
  stop();
  console.error(error.code === "EADDRINUSE" ? "El puerto 3215 ya está ocupado. No se modificó ni se migró ese proceso." : error.message);
  process.exitCode = 1;
}
