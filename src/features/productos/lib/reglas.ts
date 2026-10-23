import { formatoSoles, plural } from "@/lib/formato";
import type { Filtro, NivelStock, Producto } from "../types";
import { estadoOferta, precioEnLote } from "./ofertas";

// Reglas de inventario. Funciones puras: fáciles de probar y de mover al backend.

/** Con 5 unidades o menos en total, el producto pasa a "Bajo stock". */
export const UMBRAL_BAJO_STOCK = 5;

export const stockTotal = (p: Producto) => p.variantes.reduce((s, v) => s + v.stock, 0);

export function nivelStock(p: Producto): NivelStock {
  const total = stockTotal(p);
  if (total === 0) return "agotado";
  return total <= UMBRAL_BAJO_STOCK ? "bajo-stock" : "en-stock";
}

/** "2 colores · 3 tallas". Sin opción de color cuenta como 1 color; sin tallas, no se nombran (hasta PR 3 de la auditoría multirubro). */
export function resumenVariantes(p: Producto) {
  const colores = p.opciones.find((o) => o.tipo === "color")?.valores.length || 1;
  const tallas = p.opciones.find((o) => o.tipo === "talla")?.valores.length ?? 0;
  const partes = [plural(colores, "color", "colores")];
  if (tallas) partes.push(plural(tallas, "talla", "tallas"));
  return partes.join(" · ");
}

/** Variantes agotadas dentro de un producto que todavía tiene stock: aviso para reponer. */
export function variantesAgotadas(p: Producto) {
  if (nivelStock(p) === "agotado") return 0;
  return p.variantes.filter((v) => v.stock === 0).length;
}

/** "22 unidades", "1 unidad" o "0 unidades". */
export const textoStock = (p: Producto) => plural(stockTotal(p), "unidad", "unidades");

export const textoPrecio = (p: Producto) => formatoSoles(p.precio);

/** "En oferta" (0034): activas y programadas. Depende del día de Lima, por eso las reglas reciben `hoy`. */
const cumple = (hoy: string): Record<Filtro, (p: Producto) => boolean> => ({
  todos: () => true,
  activos: (p) => p.estado === "activo",
  "en-oferta": (p) => ["activa", "programada"].includes(estadoOferta(p, hoy)),
  "bajo-stock": (p) => nivelStock(p) === "bajo-stock",
  agotados: (p) => nivelStock(p) === "agotado",
  pausados: (p) => p.estado === "pausado",
});

export const FILTROS: Filtro[] = ["todos", "activos", "en-oferta", "bajo-stock", "agotados", "pausados"];

export function contarPorFiltro(lista: Producto[], hoy: string): Record<Filtro, number> {
  const c = cumple(hoy);
  return Object.fromEntries(FILTROS.map((f) => [f, lista.filter(c[f]).length])) as Record<Filtro, number>;
}

/** Busca por nombre o SKU, sin distinguir mayúsculas ni tildes. */
const normalizar = (s: string) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim();

export function filtrarProductos(lista: Producto[], filtro: Filtro, busqueda: string, hoy: string) {
  const q = normalizar(busqueda);
  const c = cumple(hoy)[filtro];
  return lista.filter((p) => c(p) && (!q || normalizar(p.nombre).includes(q) || normalizar(p.sku ?? "").includes(q)));
}

export function leerFiltro(valor: string | null | undefined): Filtro {
  return FILTROS.includes(valor as Filtro) ? (valor as Filtro) : "todos";
}

/** Copia pausada y sin stock: duplicar un modelo no duplica su inventario ni lo publica. */
export function duplicar(p: Producto): Producto {
  return {
    ...p,
    id: `${p.id}-copia-${Date.now()}`,
    nombre: `Copia de ${p.nombre}`,
    sku: p.sku && `${p.sku}-C`,
    estado: "pausado",
    variantes: p.variantes.map((v) => ({ ...v, stock: 0 })),
  };
}

/** El precio normal: el "precio antes" si está en oferta; si no, el precio. */
export const precioNormal = (p: Producto) => (p.precioAntes && p.precioAntes > p.precio ? p.precioAntes : p.precio);

export type OfertaEnLote = { modo: "porcentaje" | "precio"; valor: number; desde?: string; hasta?: string };

/**
 * Poner en oferta en lote (0034): sobre el precio normal de cada uno, redondeado al sol. Si no baja el precio,
 * el producto queda igual (null). Reemplaza la oferta que tuviera.
 */
export function conOferta(p: Producto, o: OfertaEnLote): Producto | null {
  const normal = precioNormal(p);
  const nuevo = precioEnLote(normal, o.modo, o.valor);
  if (!(nuevo > 0) || nuevo >= normal) return null;
  return { ...p, precio: nuevo, precioAntes: normal, oferta: o.desde || o.hasta ? { desde: o.desde, hasta: o.hasta } : undefined };
}

/** Quitar la oferta: vuelve al precio normal, sin precio antes ni fechas. */
export const sinOferta = (p: Producto): Producto => ({ ...p, precio: precioNormal(p), precioAntes: undefined, oferta: undefined });
