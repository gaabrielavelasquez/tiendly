import type { ItemCarrito } from "@/features/vitrina/lib/carrito";
import type { CatalogoCompra, Cupon, Datos, Entrega, Linea, Totales } from "../types";
import { descuentoDe } from "@/features/cupones/lib/reglas";

// Reglas del carrito y de la compra. Funciones puras: fáciles de probar y de mover al backend.
// Mensajes con punto final (regla de micro-copy) y textos de Figma (módulo 1).

const claveVariante = (color: string, talla: string) => `${color}|${talla}`;

/** Une lo guardado en el navegador con el catálogo publicado. Lo que ya no se vende, se descarta. */
export function resolverLineas(items: ItemCarrito[], catalogo: CatalogoCompra): Linea[] {
  return items.flatMap((i) => {
    const p = catalogo[i.id];
    if (!p) return [];
    const maximo = p.stock[claveVariante(i.color, i.talla)] ?? 0;
    return [{ ...i, cantidad: Math.min(i.cantidad, Math.max(maximo, 1)), nombre: p.nombre, slug: p.slug, precio: p.precio, foto: p.fotos[i.color] ?? p.foto, maximo }];
  });
}

export const mismaLinea = (a: ItemCarrito, b: ItemCarrito) => a.id === b.id && a.color === b.color && a.talla === b.talla;

/** Lo que falta para el envío gratis (0 si ya llegó). Se cuenta después del cupón. null: la tienda no lo ofrece. */
export const faltaEnvioGratis = (base: number, desde: number | null) => (desde === null ? null : Math.max(0, desde - base));

/** Las tallas agotadas no suman: no se pueden comprar (el carrito pide quitarlas). */
export function calcularTotales(todas: Linea[], cupon: Cupon | null, entrega: Entrega | null, envioGratisDesde: number | null): Totales {
  const lineas = todas.filter((l) => l.maximo > 0);
  const productos = lineas.reduce((s, l) => s + l.precio * l.cantidad, 0);
  const unidades = lineas.reduce((s, l) => s + l.cantidad, 0);
  const descuento = cupon ? descuentoDe(cupon, productos) : 0;
  const base = productos - descuento;
  const envioGratis = cupon?.tipo === "envio" || faltaEnvioGratis(base, envioGratisDesde) === 0;
  const envio = !entrega ? null : entrega.tipo === "recojo" || envioGratis ? 0 : entrega.distrito.costo;
  return { productos, unidades, descuento, envio, envioGratis, total: base + (envio ?? 0) };
}

export const soloDigitos = (s: string) => s.replace(/\D/g, "");

/** "987654321" → "987 654 321". */
export const formatoCelular = (s: string) => soloDigitos(s).slice(0, 9).replace(/(\d{3})(?=\d)/g, "$1 ");

export function validarDatos(d: Datos): Partial<Record<keyof Datos, string>> {
  const e: Partial<Record<keyof Datos, string>> = {};
  if (d.nombre.trim().split(/\s+/).filter(Boolean).length < 2) e.nombre = "Escribe tu nombre y apellido.";
  if (!/^9\d{8}$/.test(soloDigitos(d.celular))) e.celular = "Revisa tu celular: son 9 dígitos y empieza con 9.";
  return e;
}

export type ErroresEntrega = Partial<Record<"distrito" | "direccion", string>>;

export function validarEntrega(tipo: "delivery" | "recojo", distrito: unknown, direccion: string): ErroresEntrega {
  if (tipo === "recojo") return {};
  const e: ErroresEntrega = {};
  if (!distrito) e.distrito = "Elige el distrito donde recibes tu pedido.";
  if (direccion.trim().length < 5) e.direccion = "Escribe tu dirección: calle, número y dpto. si tienes.";
  return e;
}

/** Búsqueda de distritos sin tildes ni mayúsculas ("cay" encuentra Cayma y Cayaltí). */
export const normalizar = (s: string) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim();
