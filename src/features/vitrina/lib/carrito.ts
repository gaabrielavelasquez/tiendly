// Carrito de la vitrina en este navegador (hasta tener backend). Avisa con un evento propio porque
// el evento "storage" del navegador solo llega a las OTRAS pestañas, no a la que escribió.

export type ItemCarrito = { id: string; color: string; talla: string; cantidad: number };
export const EVENTO_CARRITO = "tiendly:carrito";
const clave = (slug: string) => `tiendly:carrito:${slug}`;

export function leerCarrito(slug: string): ItemCarrito[] {
  try {
    return JSON.parse(localStorage.getItem(clave(slug)) ?? "[]");
  } catch {
    return [];
  }
}

/** Suma una unidad (si ya está la misma variante, aumenta la cantidad). */
export function agregarAlCarrito(slug: string, item: Omit<ItemCarrito, "cantidad">) {
  const items = leerCarrito(slug);
  const igual = items.find((i) => i.id === item.id && i.color === item.color && i.talla === item.talla);
  if (igual) igual.cantidad += 1;
  else items.push({ ...item, cantidad: 1 });
  try {
    localStorage.setItem(clave(slug), JSON.stringify(items));
  } catch {}
  window.dispatchEvent(new Event(EVENTO_CARRITO));
}
