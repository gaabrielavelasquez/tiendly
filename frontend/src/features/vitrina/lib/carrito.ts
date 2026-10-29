// Carrito de la vitrina en este navegador (hasta tener backend). Avisa con un evento propio porque
// el evento "storage" del navegador solo llega a las OTRAS pestañas, no a la que escribió.

import { claveLegado } from "@/features/productos/lib/variantes";

/** `variante`: la clave de la variante (`claveVariante`), "Plata|36" o "" si el producto no tiene opciones. */
export type ItemCarrito = { id: string; variante: string; cantidad: number };
type ItemLegado = { id: string; color: string; talla: string; cantidad: number };
export const EVENTO_CARRITO = "tiendly:carrito";
const clave = (slug: string) => `tiendly:carrito:${slug}`;

export function leerCarrito(slug: string): ItemCarrito[] {
  try {
    // Un carrito guardado antes de 0032 trae color y talla: se traduce a la clave nueva sin perder nada.
    const items: (ItemCarrito | ItemLegado)[] = JSON.parse(localStorage.getItem(clave(slug)) ?? "[]");
    return items.map((i) => ("variante" in i ? i : { id: i.id, variante: claveLegado(i.color, i.talla), cantidad: i.cantidad }));
  } catch {
    return [];
  }
}

/** Suma una unidad (si ya está la misma variante, aumenta la cantidad). */
export function agregarAlCarrito(slug: string, item: Omit<ItemCarrito, "cantidad">) {
  const items = leerCarrito(slug);
  const igual = items.find((i) => i.id === item.id && i.variante === item.variante);
  if (igual) igual.cantidad += 1;
  else items.push({ ...item, cantidad: 1 });
  try {
    localStorage.setItem(clave(slug), JSON.stringify(items));
  } catch {}
  window.dispatchEvent(new Event(EVENTO_CARRITO));
}

/** Reemplaza el carrito completo (cambiar cantidad, quitar o deshacer) y avisa a la cabecera. */
export function guardarCarrito(slug: string, items: ItemCarrito[]) {
  try {
    localStorage.setItem(clave(slug), JSON.stringify(items));
  } catch {}
  window.dispatchEvent(new Event(EVENTO_CARRITO));
}
