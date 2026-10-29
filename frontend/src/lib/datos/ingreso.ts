import { clavesConPrefijo, escribir, leer } from "./almacen";
import { esDemo } from "./semillas";
import { datosTienda, type DatosTienda } from "./tienda";

const entorno = () => process.env.VERCEL_ENV ?? "local";
const claveIngreso = (celular: string) => `${entorno()}:ingreso:${celular}`;
/** Las demos nunca coinciden: su número es público y el código de WhatsApp es simulado. */
const coincide = (d: DatosTienda, celular: string) => !esDemo(d.tienda.slug) && (d.tienda.celularIngreso ?? d.tienda.celularVentas) === celular;

export const recordarIngreso = (celular: string, slug: string) => escribir(claveIngreso(celular), slug);

/** Sesión simulada, no autenticación real. También recupera tiendas creadas antes del índice. */
export async function tiendaDeIngreso(celular: string): Promise<string | null> {
  const guardado = await leer<string>(claveIngreso(celular));
  if (guardado) {
    const d = await datosTienda(guardado);
    if (d && coincide(d, celular)) return guardado;
  }
  let encontrada: string | null = null;
  const vistas = new Set<string>();
  for await (const clave of clavesConPrefijo(`${entorno()}:tienda:`)) {
    if (vistas.has(clave)) continue;
    vistas.add(clave);
    const d = await datosTienda(clave.slice(`${entorno()}:tienda:`.length));
    if (!d || !coincide(d, celular)) continue;
    if (encontrada) return null; // No elegir una tienda arbitraria si datos antiguos son ambiguos.
    encontrada = d.tienda.slug;
  }
  if (encontrada) await recordarIngreso(celular, encontrada);
  return encontrada;
}
