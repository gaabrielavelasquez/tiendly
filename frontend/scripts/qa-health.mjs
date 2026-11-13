// Respuesta operativa sin sesiones, datos de tiendas ni valores secretos.
export async function qaHealth(request, env, release) {
  if (!["GET", "HEAD"].includes(request.method)) return new Response(null, { status: 405, headers: { Allow: "GET, HEAD" } });
  const checks = { environment: env.TIENDLY_ENTORNO === "preview", auth: Boolean(env.BETTER_AUTH_SECRET && env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) && env.BETTER_AUTH_URL === "https://preview.tiendly.workers.dev", database: false, images: false };
  try {
    const { results } = await env.DB.prepare("SELECT name FROM d1_migrations").all();
    checks.database = release.migrations.every(name => results.some(row => row.name === name));
  } catch { /* No revelar errores SQL ni configuración interna. */ }
  try { await env.UPLOADS.head("__tiendly_healthcheck__"); checks.images = true; } catch { /* Solo lectura. */ }
  const ok = Object.values(checks).every(Boolean);
  return new Response(request.method === "HEAD" ? null : JSON.stringify({ status: ok ? "ok" : "unavailable", environment: "preview", revision: release.revision, dirty: release.dirty, checks }), {
    status: ok ? 200 : 503,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow, noarchive" },
  });
}
