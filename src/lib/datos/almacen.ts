import { Redis } from "@upstash/redis";

// Dónde viven los datos simulados hasta tener backend. Con Upstash Redis (Vercel Marketplace) se comparten
// entre dispositivos y sobreviven a los reinicios: un pedido hecho desde el celular del cliente llega al
// panel de la tienda. Sin credenciales (desarrollo local), quedan en la memoria del proceso.

const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;

let cliente: Redis | null | undefined;
const redis = () => (cliente === undefined ? (cliente = url && token ? new Redis({ url, token }) : null) : cliente);

const g = globalThis as typeof globalThis & { __tiendlyDatos?: Map<string, string> };
const memoria = () => (g.__tiendlyDatos ??= new Map());

export async function leer<T>(clave: string): Promise<T | null> {
  const r = redis();
  if (r) return (await r.get<T>(clave)) ?? null;
  const v = memoria().get(clave);
  return v ? (JSON.parse(v) as T) : null;
}

export async function escribir<T>(clave: string, valor: T) {
  const r = redis();
  if (r) await r.set(clave, valor);
  else memoria().set(clave, JSON.stringify(valor));
}

export async function existe(clave: string) {
  const r = redis();
  return r ? (await r.exists(clave)) > 0 : memoria().has(clave);
}

/** Recorrido por prefijo para compatibilidad de datos anteriores; nunca cruza entornos. */
export async function* clavesConPrefijo(prefijo: string): AsyncGenerator<string> {
  const r = redis();
  if (!r) {
    for (const clave of memoria().keys()) if (clave.startsWith(prefijo)) yield clave;
    return;
  }
  let cursor = "0";
  do {
    const pagina = await r.scan(cursor, { match: `${prefijo}*`, count: 100 });
    cursor = pagina[0];
    for (const clave of pagina[1]) yield clave;
  } while (cursor !== "0");
}
