import { headers } from "next/headers";

/**
 * URL pública de la vitrina, para copiar y compartir. Con `TIENDLY_URL_TIENDAS` (p. ej. https://tu-dominio.example,
 * cuando el dominio esté activo) usa ese dominio; si no, el de esta app, para que el link abra de verdad.
 */
export async function urlTienda(slug: string) {
  const base = process.env.TIENDLY_URL_TIENDAS?.replace(/\/$/, "");
  if (base) return `${base}/${slug}`;
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const protocolo = h.get("x-forwarded-proto") ?? (/^(localhost|127\.)/.test(host) ? "http" : "https");
  return `${protocolo}://${host}/${slug}`;
}

export { sinProtocolo } from "./formato-link";
