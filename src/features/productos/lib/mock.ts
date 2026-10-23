import { conDisponible } from "./inventario";
import { ahoraIso } from "@/lib/reloj";
import { datosTienda } from "@/lib/datos/tienda";
import type { Escenario, Producto } from "../types";

// El catálogo de cada tienda vive en sus datos (lib/datos/tienda): lo que se guarda en el panel se ve al
// instante en la vitrina y en la compra. Se elige el escenario con ?escenario= (solo en desarrollo).

export function leerEscenario(valor: string | string[] | undefined): Escenario {
  const v = Array.isArray(valor) ? valor[0] : valor;
  return v === "vacio" || v === "error" ? v : "catalogo";
}

/** Un producto por id (para editar), sin descontar ventas. `null` si no existe. */
export async function obtenerProducto(slug: string, id: string): Promise<Producto | null> {
  const d = await datosTienda(slug);
  return d?.productos.find((p) => p.id === id) ?? null;
}

/** El catálogo con el stock disponible en el reloj de la demo: lo vendido y reservado ya no está (0010 y 0028). */
export async function obtenerProductos(escenario: Escenario, slug: string): Promise<Producto[]> {
  if (escenario === "error") throw new Error("No se pudo cargar Productos (simulado).");
  if (escenario === "vacio") return [];
  const d = await datosTienda(slug);
  return d ? conDisponible(d.productos, d.inventario, ahoraIso()) : [];
}

/** Las categorías que ya usa la tienda, en orden de aparición (para elegir en el formulario de producto). */
export async function categoriasDeTienda(slug: string): Promise<string[]> {
  const d = await datosTienda(slug);
  return [...new Set((d?.productos ?? []).flatMap((p) => p.categorias))];
}
