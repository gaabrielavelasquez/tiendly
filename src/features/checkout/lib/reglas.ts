import { redondearSoles } from "@/lib/formato";
import type { ItemCarrito } from "@/features/vitrina/lib/carrito";
import type { CatalogoCompra, Cupon, Datos, Entrega, Linea, Totales, TipoEntrega } from "../types";
import { descuentoDe } from "@/features/cupones/lib/reglas";

// Reglas del carrito y de la compra. Funciones puras: fáciles de probar y de mover al backend.
// Mensajes con punto final (regla de micro-copy) y textos de Figma (módulo 1).

/** Une lo guardado en el navegador con el catálogo publicado. Lo que ya no se vende, se descarta. */
export function resolverLineas(items: ItemCarrito[], catalogo: CatalogoCompra): Linea[] {
  return items.flatMap((i) => {
    const p = catalogo[i.id];
    if (!p) return [];
    // Una variante que ya no existe se muestra agotada (el carrito pide quitarla).
    const v = p.variantes[i.variante];
    const maximo = v?.stock ?? 0;
    return [{ ...i, cantidad: Math.min(i.cantidad, Math.max(maximo, 1)), nombre: p.nombre, slug: p.slug, precio: p.precio, precioAntes: p.precioAntes, foto: v?.foto ?? p.foto, maximo, detalle: v?.detalle ?? [] }];
  });
}

export const mismaLinea = (a: ItemCarrito, b: ItemCarrito) => a.id === b.id && a.variante === b.variante;

/** Lo que falta para el envío gratis (0 si ya llegó). Se cuenta después del cupón. null: la tienda no lo ofrece. */
export const faltaEnvioGratis = (base: number, desde: number | null) => (desde === null ? null : Math.max(0, redondearSoles(desde - base)));

/** Las tallas agotadas no suman: no se pueden comprar (el carrito pide quitarlas). */
export function calcularTotales(todas: Linea[], cupon: Cupon | null, entrega: Entrega | null, envioGratisDesde: number | null): Totales {
  const lineas = todas.filter((l) => l.maximo > 0);
  const productos = redondearSoles(lineas.reduce((s, l) => s + l.precio * l.cantidad, 0));
  const unidades = lineas.reduce((s, l) => s + l.cantidad, 0);
  const descuento = cupon ? descuentoDe(cupon, productos) : 0;
  const base = redondearSoles(productos - descuento);
  const envioGratis = cupon?.tipo === "envio" || faltaEnvioGratis(base, envioGratisDesde) === 0;
  if (entrega?.tipo === "coordinar") return { productos, unidades, descuento, envio: null, envioGratis: false, envioPorCoordinar: true, total: base };
  const envio = !entrega ? null : entrega.tipo === "recojo" || envioGratis ? 0 : entrega.distrito.costo;
  return { productos, unidades, descuento, envio, envioGratis, total: redondearSoles(base + (envio ?? 0)) };
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

export function validarEntrega(tipo: TipoEntrega, distrito: unknown, direccion: string): ErroresEntrega {
  if (tipo !== "delivery") return {};
  const e: ErroresEntrega = {};
  if (!distrito) e.distrito = "Elige el distrito donde recibes tu pedido.";
  if (direccion.trim().length < 5) e.direccion = "Escribe tu dirección: calle, número y dpto. si tienes.";
  return e;
}

/** Búsqueda de distritos sin tildes ni mayúsculas ("cay" encuentra Cayma y Cayaltí). */
export const normalizar = (s: string) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim();
