import { cookies } from "next/headers";
import { datosTienda, mutarTienda, type DatosTienda, type TiendaSesion } from "./datos/tienda";
import { esDemo, slugDemo } from "./datos/semillas";

// Sesión simulada del panel hasta tener backend: qué tienda abre este navegador. El onboarding guarda el
// link de la tienda nueva en una cookie; sin cookie (o si la tienda ya no existe), el panel es la tienda de demo.
// Solo para el servidor: los componentes de cliente reciben la tienda por props o por SesionPanel.

export type { TiendaSesion };

export const COOKIE_TIENDA = "tiendly_tienda";

/** El link (slug) de la tienda del panel en este navegador. */
export async function slugPanel(): Promise<string> {
  const slug = (await cookies()).get(COOKIE_TIENDA)?.value;
  return slug && /^[a-z0-9-]{1,40}$/.test(slug) && (await datosTienda(slug)) ? slug : slugDemo();
}

/** Todos los datos de la tienda del panel. */
export async function datosPanel(): Promise<DatosTienda> {
  const d = await datosTienda(await slugPanel());
  if (!d) throw new Error("No se pudo cargar la tienda.");
  return d;
}

export const tiendaActual = async (): Promise<TiendaSesion> => (await datosPanel()).tienda;

/** En producción el panel sin sesión abre la demo: se puede mirar, pero no guardar (ni con la cookie a mano). */
export const demoProtegida = (slug: string) => process.env.VERCEL_ENV === "production" && esDemo(slug);

/** Cambia los datos de la tienda del panel (acciones de servidor). */
export async function mutarPanel<T>(cambio: (d: DatosTienda) => T | Promise<T>): Promise<T> {
  const slug = await slugPanel();
  if (demoProtegida(slug)) throw new Error("La tienda de demo no se puede editar.");
  const r = await mutarTienda(slug, cambio);
  if (r === null) throw new Error("No se pudo guardar.");
  return r;
}

export async function marcarHecho(paso: keyof TiendaSesion["hechos"]) {
  await mutarPanel((d) => void (d.tienda.hechos[paso] = true));
}
