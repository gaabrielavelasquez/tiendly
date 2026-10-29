import type { Opcion, Producto, TipoOpcion, Variante } from "../types";

// Variantes como opciones genéricas (decisión 0032). Funciones puras: las usan el panel, la vitrina,
// la compra y la migración de los datos guardados con el formato anterior (color × talla).

/** Un valor elegido, con el nombre y el tipo de su opción ("Talla", talla, "36"). */
export type ValorOpcion = { nombre: string; tipo: TipoOpcion; valor: string };

/** El tipo de una opción sale de su nombre (0034): "Color" lleva muestras; "Talla", tabla de tallas; el resto, botones. */
export function tipoDeNombre(nombre: string): TipoOpcion {
  const n = nombre.trim().toLowerCase();
  return n === "color" ? "color" : n === "talla" ? "talla" : "otra";
}

/** Combinaciones de valores, en el orden de las opciones (la primera agrupa). Sin opciones: una sola, []. */
export function combinaciones(opciones: readonly { valores: readonly string[] }[]): string[][] {
  return opciones.filter((o) => o.valores.length).reduce<string[][]>((acc, o) => acc.flatMap((c) => o.valores.map((v) => [...c, v])), [[]]);
}

/** Clave de una variante: sus valores unidos. Para color × talla queda igual que antes ("Plata|36"). */
export const claveVariante = (valores: readonly string[]) => valores.join("|");

/** Galería única: la clave de `fotos` cuando ninguna opción cambia las fotos. */
export const FOTOS_GENERAL = "";

export const indiceOpcion = (p: Pick<Producto, "opciones">, tipo: TipoOpcion) => p.opciones.findIndex((o) => o.tipo === tipo);

/** El valor de una variante para un tipo de opción ("Plata" para color), o undefined si no tiene esa opción. */
export function valorDe(p: Pick<Producto, "opciones">, v: Pick<Variante, "valores">, tipo: TipoOpcion) {
  const i = indiceOpcion(p, tipo);
  return i < 0 ? undefined : v.valores[i];
}

/** Opción que cambia las fotos: la que eligió la tienda; si no, la de color o la llamada "Tono"; -1, ninguna. */
export function opcionDeFotos(p: Pick<Producto, "opciones" | "opcionFotos">) {
  if (p.opcionFotos !== undefined) return p.opcionFotos < p.opciones.length ? p.opcionFotos : -1;
  const color = indiceOpcion(p, "color");
  return color >= 0 ? color : p.opciones.findIndex((o) => o.nombre.trim().toLowerCase() === "tono");
}

/** Clave de `fotos` para una variante: el valor de la opción de fotos, o la galería general. */
export function claveFotos(p: Pick<Producto, "opciones" | "opcionFotos">, valores: readonly string[]) {
  const i = opcionDeFotos(p);
  return i < 0 ? FOTOS_GENERAL : (valores[i] ?? FOTOS_GENERAL);
}

/** Fotos de una variante; sin fotos propias, la foto principal del producto. */
export function fotosDe(p: Pick<Producto, "opciones" | "opcionFotos" | "fotos" | "imagen">, valores: readonly string[]) {
  return p.fotos?.[claveFotos(p, valores)] ?? (p.imagen ? [p.imagen] : []);
}

/** Color × talla con el stock de cada color en orden de talla (semillas de Heather y Aurora). */
export function colorPorTalla(stockPorColor: Record<string, number[]>, tallas: string[]): Pick<Producto, "opciones" | "variantes"> {
  return {
    opciones: [
      { nombre: "Color", tipo: "color", valores: Object.keys(stockPorColor) },
      { nombre: "Talla", tipo: "talla", valores: tallas },
    ],
    variantes: Object.entries(stockPorColor).flatMap(([color, stock]) => tallas.map((talla, i) => ({ valores: [color, talla], stock: stock[i] ?? 0 }))),
  };
}

/** Cada valor con su opción, para mostrar y describir la variante. */
export const detalleVariante = (opciones: readonly Opcion[], valores: readonly string[]): ValorOpcion[] =>
  opciones.flatMap((o, i) => (valores[i] === undefined ? [] : [{ nombre: o.nombre, tipo: o.tipo, valor: valores[i] }]));

/** "Plata · 36" (así se guarda en el pedido). Sin opciones, texto vacío. */
export const textoVariante = (d: readonly ValorOpcion[], separador = " · ") => d.map((x) => x.valor).join(separador);

/** "Plata · Talla 36": la talla lleva su nombre para que el número no quede suelto. */
export const textoVarianteLargo = (d: readonly ValorOpcion[], separador = " · ", talla = "Talla") =>
  d.map((x) => (x.tipo === "talla" ? `${talla} ${x.valor}` : x.valor)).join(separador);

// ── Formato anterior (hasta la decisión 0032) ────────────────────────────────────────────────────────
// Variante = { color, talla, stock }, con "Único" y "Única" cuando el producto no tenía colores o tallas.

export const COLOR_UNICO_LEGADO = "Único";
export const TALLA_UNICA_LEGADO = "Única";

/** Valores nuevos de una variante guardada con color y talla: se quitan "Único" y "Única". */
const valoresLegado = (color: string, talla: string) =>
  [color !== COLOR_UNICO_LEGADO && color, talla !== TALLA_UNICA_LEGADO && talla].filter((x): x is string => x !== false);

/** Clave nueva para un ítem guardado con color y talla (carrito, inventario). */
export const claveLegado = (color: string, talla: string) => claveVariante(valoresLegado(color, talla));

/** Las categorías de calzado eran ids fijos; ahora son el texto que muestra la tienda. */
const CATEGORIA_LEGADO: Record<string, string> = {
  balerinas: "Balerinas", tacos: "Tacos", botas: "Botas", plataformas: "Plataformas", sandalias: "Sandalias", zapatillas: "Zapatillas", mocasines: "Mocasines", ropa: "Ropa",
};

type VarianteLegado = { color: string; talla: string; stock: number };
type ProductoLegado = Omit<Producto, "opciones" | "variantes"> & { opciones?: undefined; variantes: VarianteLegado[] };

/**
 * Producto guardado con el formato anterior → formato nuevo. Idempotente: un producto con `opciones`
 * solo normaliza sus categorías. Las claves de variante no cambian para color × talla.
 */
export function migrarProducto(p: Producto | ProductoLegado): Producto {
  const categorias = p.categorias.map((c) => CATEGORIA_LEGADO[c] ?? c);
  if (Array.isArray(p.opciones)) return { ...p, categorias } as Producto;
  const viejas = (p as ProductoLegado).variantes;
  const colores = [...new Set(viejas.map((v) => v.color))].filter((c) => c !== COLOR_UNICO_LEGADO);
  const tallas = [...new Set(viejas.map((v) => v.talla))].filter((t) => t !== TALLA_UNICA_LEGADO);
  const opciones: Opcion[] = [
    ...(colores.length ? [{ nombre: "Color", tipo: "color" as const, valores: colores }] : []),
    ...(tallas.length ? [{ nombre: "Talla", tipo: "talla" as const, valores: tallas }] : []),
  ];
  const variantes = viejas.map((v) => ({ valores: valoresLegado(v.color, v.talla), stock: v.stock }));
  // Sin colores, las fotos iban en "Único": pasan a la galería general.
  const fotos = p.fotos && !colores.length ? { [FOTOS_GENERAL]: [...new Set(Object.values(p.fotos).flat())] } : p.fotos;
  return { ...p, categorias, opciones, variantes, fotos };
}
