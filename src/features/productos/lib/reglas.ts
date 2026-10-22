import { formatoSoles, plural } from "@/lib/formato";
import type { Filtro, NivelStock, Producto } from "../types";

// Reglas de inventario. Funciones puras: fáciles de probar y de mover al backend.

/** Con 5 unidades o menos en total, el producto pasa a "Bajo stock". */
export const UMBRAL_BAJO_STOCK = 5;

export const stockTotal = (p: Producto) => p.variantes.reduce((s, v) => s + v.stock, 0);

export function nivelStock(p: Producto): NivelStock {
  const total = stockTotal(p);
  if (total === 0) return "agotado";
  return total <= UMBRAL_BAJO_STOCK ? "bajo-stock" : "en-stock";
}

/** "2 colores · 3 tallas". Las variantes únicas ("Única") no se cuentan como talla. */
export function resumenVariantes(p: Producto) {
  const colores = new Set(p.variantes.map((v) => v.color)).size;
  const tallas = new Set(p.variantes.map((v) => v.talla).filter((t) => t !== "Única")).size;
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

const CUMPLE: Record<Filtro, (p: Producto) => boolean> = {
  todos: () => true,
  activos: (p) => p.estado === "activo",
  "bajo-stock": (p) => nivelStock(p) === "bajo-stock",
  agotados: (p) => nivelStock(p) === "agotado",
  pausados: (p) => p.estado === "pausado",
};

export function contarPorFiltro(lista: Producto[]): Record<Filtro, number> {
  const contar = (f: Filtro) => lista.filter(CUMPLE[f]).length;
  return { todos: lista.length, activos: contar("activos"), "bajo-stock": contar("bajo-stock"), agotados: contar("agotados"), pausados: contar("pausados") };
}

/** Busca por nombre o SKU, sin distinguir mayúsculas ni tildes. */
const normalizar = (s: string) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim();

export function filtrarProductos(lista: Producto[], filtro: Filtro, busqueda: string) {
  const q = normalizar(busqueda);
  return lista.filter((p) => CUMPLE[filtro](p) && (!q || normalizar(p.nombre).includes(q) || normalizar(p.sku ?? "").includes(q)));
}

export function leerFiltro(valor: string | null | undefined): Filtro {
  return valor === "activos" || valor === "bajo-stock" || valor === "agotados" || valor === "pausados" ? valor : "todos";
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
