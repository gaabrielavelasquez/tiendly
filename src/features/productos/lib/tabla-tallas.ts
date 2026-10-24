import { normalizarMedida } from "./medidas";
import type { Producto, TablaTallas } from "../types";

// Tabla de tallas por producto (parte 4 de 0034). Funciones puras: el formulario edita, el catálogo guarda.

export const MAXIMO_MEDIDAS = 4;
/** Fila de medidas del producto sin talla; no crea una opción ni una variante. */
export const FILA_UNICA = "";

/** Calzado (tallas con números): el largo del pie. Ropa (S, M, L…): pecho, cintura y largo. */
export const medidasSugeridas = (tallas: string[]) => (tallas.length > 0 && tallas.every((t) => /^\d/.test(t)) ? ["Largo del pie"] : ["Pecho", "Cintura", "Largo"]);

/** Una tabla nueva para estas tallas, con las medidas sugeridas y las celdas vacías. */
export function tablaNueva(tallas: string[]): TablaTallas {
  const medidas = tallas.length === 1 && tallas[0] === FILA_UNICA ? ["Alto", "Ancho", "Largo"] : medidasSugeridas(tallas);
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
  const usadas = t.medidas.map((m, i) => (m.trim() || tallas.some((x) => normalizarMedida(filaDe(t, x)[i])) ? i : -1)).filter((i) => i >= 0);
  const medidas = usadas.map((i) => t.medidas[i].trim() || `Medida ${i + 1}`);
  const filas = Object.fromEntries(tallas.map((x) => [x, usadas.map((i) => normalizarMedida(filaDe(t, x)[i]))]));
  return Object.values(filas).some((f) => f.some(Boolean)) ? { medidas, filas } : undefined;
}

/** Guía de calzado que ya mostraba #29: solo para documentos anteriores sin decisión explícita sobre la tabla. */
const PIE_LEGADO: Record<string, string> = { "35": "22.5", "36": "23", "37": "23.5", "38": "24", "39": "24.5", "40": "25" };

/** Lectura compatible sin escribir en Redis. null representa la elección explícita "Sin tabla". */
export function tablaDelProducto(p: Pick<Producto, "opciones" | "tablaTallas">): TablaTallas | undefined {
  const tallas = p.opciones.find((o) => o.tipo === "talla")?.valores;
  if (p.tablaTallas !== undefined) return p.tablaTallas ? limpiarTabla(p.tablaTallas, tallas ?? [FILA_UNICA]) : undefined;
  if (!tallas?.length) return undefined;
  if (!tallas.some((t) => PIE_LEGADO[t])) return undefined;
  return { medidas: ["Largo del pie"], filas: Object.fromEntries(tallas.map((t) => [t, [PIE_LEGADO[t] ?? ""]])) };
}

/** Otros productos con tabla propia o heredada, sin el que se edita. */
export const conTabla = (productos: Producto[], excluir?: string) => productos.flatMap((p) => {
  const tabla = tablaDelProducto(p);
  return p.id !== excluir && tabla ? [{ id: p.id, nombre: p.nombre, tabla }] : [];
});

export type TablaDeOtro = ReturnType<typeof conTabla>[number];
