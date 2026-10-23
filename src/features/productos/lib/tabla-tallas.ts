import type { Producto, TablaTallas } from "../types";

// Tabla de tallas por producto (parte 4 de 0034). Funciones puras: el formulario edita, el catálogo guarda.

export const MAXIMO_MEDIDAS = 4;

/** Calzado (tallas con números): el largo del pie. Ropa (S, M, L…): pecho, cintura y largo. */
export const medidasSugeridas = (tallas: string[]) => (tallas.length > 0 && tallas.every((t) => /^\d/.test(t)) ? ["Largo del pie"] : ["Pecho", "Cintura", "Largo"]);

/** Una tabla nueva para estas tallas, con las medidas sugeridas y las celdas vacías. */
export function tablaNueva(tallas: string[]): TablaTallas {
  const medidas = medidasSugeridas(tallas);
  return { medidas, filas: Object.fromEntries(tallas.map((t) => [t, medidas.map(() => "")])) };
}

/**
 * Copia la tabla de otro producto (el atajo "Usar la de…"): mismas medidas y, para cada talla de este producto, la
 * fila de la misma talla allá (si no está, vacía). Es una copia: cambiarla aquí no cambia la del otro producto.
 */
export function copiarTabla(de: TablaTallas, tallas: string[]): TablaTallas {
  return { medidas: [...de.medidas], filas: Object.fromEntries(tallas.map((t) => [t, de.medidas.map((_, i) => de.filas[t]?.[i] ?? "")])) };
}

/** La fila de una talla, del largo de las medidas (una talla agregada después de crear la tabla viene vacía). */
export const filaDe = (t: TablaTallas, talla: string) => t.medidas.map((_, i) => t.filas[talla]?.[i] ?? "");

/**
 * Lo que se guarda: solo las tallas actuales, sin columnas vacías (sin nombre ni valores) y con los textos limpios.
 * undefined si no queda ninguna medida escrita: sin datos, la tienda no muestra la tabla.
 */
export function limpiarTabla(t: TablaTallas, tallas: string[]): TablaTallas | undefined {
  const usadas = t.medidas.map((m, i) => (m.trim() || tallas.some((x) => filaDe(t, x)[i].trim()) ? i : -1)).filter((i) => i >= 0);
  const medidas = usadas.map((i) => t.medidas[i].trim() || `Medida ${i + 1}`);
  const filas = Object.fromEntries(tallas.map((x) => [x, usadas.map((i) => filaDe(t, x)[i].trim())]));
  return Object.values(filas).some((f) => f.some(Boolean)) ? { medidas, filas } : undefined;
}

/** Los otros productos de la tienda con tabla (para "Usar la de…"), sin el que se edita. */
export const conTabla = (productos: Producto[], excluir?: string) =>
  productos.filter((p) => p.id !== excluir && p.tablaTallas).map((p) => ({ id: p.id, nombre: p.nombre, tabla: p.tablaTallas! }));

export type TablaDeOtro = ReturnType<typeof conTabla>[number];
