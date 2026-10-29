/**
 * Herramientas de desarrollo (decisión 0027): la página /kit y los escenarios simulados (?escenario=).
 * Se ven en local y en los previews de Vercel; en producción, no.
 */
export const herramientasDev = process.env.VERCEL_ENV ? process.env.VERCEL_ENV !== "production" : process.env.NODE_ENV !== "production";
