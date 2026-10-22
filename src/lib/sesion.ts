// Sesión simulada del panel hasta tener backend: la tienda y su dueña.
// Vive en la memoria del servidor (globalThis), como los demás datos simulados: arranca con Heather, la tienda
// de demo Pro (decisión 0030), y el onboarding la reemplaza por la tienda recién creada (ver abrirTienda).
// En el navegador este objeto siempre es Heather: los componentes de cliente reciben la tienda por props o
// por el contexto del panel (components/panel/sesion-panel).

export type TiendaSesion = {
  nombre: string;
  slug: string;
  duena: string;
  /** El WhatsApp al que escriben los clientes desde la vitrina. */
  celularVentas: string;
  logo?: string;
  plan: "free" | "pro";
  /** Pasos de "arrancar tu tienda" que no se deducen de los datos (Inicio, tienda nueva). */
  hechos: { pagos: boolean; entregas: boolean; compartir: boolean };
};

const HEATHER: TiendaSesion = {
  nombre: "Heather", slug: "heather", duena: "Cecilia", celularVentas: "987654321", logo: "/heather/logo-heather-wordmark.png", plan: "pro",
  hechos: { pagos: true, entregas: true, compartir: true },
};

const g = globalThis as typeof globalThis & { __tiendlySesion?: TiendaSesion };

/** La tienda de la sesión. Se modifica en el lugar (nunca se reemplaza) para que todos los módulos vean la misma. */
export const tiendaActual: TiendaSesion = (g.__tiendlySesion ??= structuredClone(HEATHER));

/** Heather trae datos de demo (pedidos, catálogo, cupones); una tienda nueva arranca vacía. */
export const esTiendaDemo = () => tiendaActual.slug === HEATHER.slug;

/**
 * Cambia la tienda de la sesión (onboarding). El onboarding no pide el nombre de la dueña: se usa el de la tienda.
 * Quien la llama también vacía los datos de la tienda anterior.
 */
export function abrirTienda(t: Pick<TiendaSesion, "nombre" | "slug" | "celularVentas">) {
  const nueva: TiendaSesion = { ...t, duena: t.nombre, logo: undefined, plan: "free", hechos: { pagos: false, entregas: false, compartir: false } };
  Object.assign(tiendaActual, nueva);
}

export function marcarHecho(paso: keyof TiendaSesion["hechos"]) {
  tiendaActual.hechos[paso] = true;
}
