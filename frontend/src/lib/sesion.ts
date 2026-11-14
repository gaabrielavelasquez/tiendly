import { usingApi, privateSnapshot } from './api-client';
import { snapshotData } from './datos/api';
import { storeStorage } from "@/lib/store-storage";
import { environment, testLoginAllowed } from "@tiendly/backend/rules";
import { ownedPanelSlug } from "./panel-access";
import { cookies } from "next/headers";
import { datosTienda, mutarTienda, type DatosTienda, type TiendaSesion } from "./datos/tienda";
import { esDemo, slugDemo } from "./datos/semillas";

// La cookie de slug sirve solo para pruebas explícitas. En el runtime migrado,
// la sesión verificada y la relación de titularidad resuelven la tienda.

export type { TiendaSesion };

export const COOKIE_TIENDA = "tiendly_tienda";

/** El link (slug) de la tienda del panel en este navegador. */
export async function slugPanel(): Promise<string> {
  if (usingApi()) return (await privateSnapshot())?.store.slug ?? slugDemo();
  if (testLoginAllowed(process.env.TIENDLY_ENTORNO, process.env.TIENDLY_TEST_LOGIN)) {
    const slug = (await cookies()).get(COOKIE_TIENDA)?.value;
    return slug && /^[a-z0-9-]{1,40}$/.test(slug) && (await datosTienda(slug)) ? slug : slugDemo();
  }
  if (!(await storeStorage())) return slugDemo();
  return (await ownedPanelSlug()) ?? slugDemo();
}

/** Todos los datos de la tienda del panel. */
export async function datosPanel(): Promise<DatosTienda> {
  if (usingApi()) { const own = await privateSnapshot(); if (own) return snapshotData(own); }
  const d = await datosTienda(await slugPanel());
  if (!d) throw new Error("No se pudo cargar la tienda.");
  return d;
}

export const tiendaActual = async (): Promise<TiendaSesion> => (await datosPanel()).tienda;

/** En producción el panel sin sesión abre la demo: se puede mirar, pero no guardar (ni con la cookie a mano). */
export const demoProtegida = (slug: string) => environment(process.env.TIENDLY_ENTORNO) === "production" && esDemo(slug);

/** Cambia los datos de la tienda del panel (acciones de servidor). */
export async function mutarPanel<T>(cambio: (d: DatosTienda) => T | Promise<T>): Promise<T> {
  if (usingApi()) throw new Error("Esta operación todavía no está disponible en la API.");
  const slug = await slugPanel();
  if (!testLoginAllowed(process.env.TIENDLY_ENTORNO, process.env.TIENDLY_TEST_LOGIN) && (await ownedPanelSlug()) !== slug) throw new Error("Ingresa para guardar los cambios.");
  if (demoProtegida(slug)) throw new Error("La tienda de demo no se puede editar.");
  const r = await mutarTienda(slug, cambio);
  if (r === null) throw new Error("No se pudo guardar.");
  return r;
}

export async function marcarHecho(paso: keyof TiendaSesion["hechos"]) {
  await mutarPanel((d) => void (d.tienda.hechos[paso] = true));
}
