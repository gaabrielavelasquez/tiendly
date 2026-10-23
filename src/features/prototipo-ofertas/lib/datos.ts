// PROTOTIPO: datos de ejemplo de la propuesta (PR 3 + decisión 0034). Fechas relativas a hoy en Lima,
// para que las capturas digan siempre lo mismo ("Hasta el domingo…").
import { proximo, sumarDias, type Oferta } from "./oferta";

export type TipoOpcion = "color" | "talla" | "otra";
export type OpcionProto = { nombre: string; valores: string[] };
export type ProductoProto = {
  id: string;
  nombre: string;
  categoria: string;
  foto?: string;
  precio: number;
  precioAntes?: number;
  oferta?: Oferta;
  opciones: OpcionProto[];
  /** Stock por combinación, con la clave de la variante ("Negro|40" o "" sin opciones). */
  stock: Record<string, number>;
  estado: "activo" | "pausado";
};

/** El tipo sale del nombre: así la tienda no elige un "tipo" aparte (Color → muestras; Talla → tabla de tallas). */
export const tipoDe = (nombre: string): TipoOpcion => {
  const n = nombre.trim().toLowerCase();
  return n === "color" ? "color" : n === "talla" ? "talla" : "otra";
};

export const SUGERIDAS = ["Color", "Talla", "Tamaño", "Tono", "Aroma", "Material"];
export const TALLAS_RAPIDAS: Record<string, string[]> = {
  "XS–XXL": ["XS", "S", "M", "L", "XL", "XXL"],
  "35–45": ["35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45"],
};

/** Combinaciones de valores, en orden (la primera opción agrupa en móvil). Sin opciones: una sola, "". */
export function combinaciones(opciones: OpcionProto[]): string[][] {
  return opciones.filter((o) => o.valores.length).reduce<string[][]>((acc, o) => acc.flatMap((c) => o.valores.map((v) => [...c, v])), [[]]);
}

const f = (archivo: string) => `/tiendas-ejemplo/glow-labo/${archivo}.webp`;

/** Ejemplos del formulario: Color + Talla, Tamaño y sin opciones. */
export function ejemplosFormulario(hoy: string): Record<"zapatilla" | "serum" | "vela", ProductoProto> {
  return {
    zapatilla: {
      id: "z1", nombre: "Zapatilla Norte", categoria: "Calzado", precio: 199, estado: "activo",
      opciones: [{ nombre: "Color", valores: ["Blanco", "Negro"] }, { nombre: "Talla", valores: ["38", "39", "40", "41", "42"] }],
      stock: { "Blanco|38": 2, "Blanco|39": 3, "Blanco|40": 4, "Blanco|41": 2, "Blanco|42": 1, "Negro|38": 1, "Negro|39": 2, "Negro|40": 3, "Negro|41": 2, "Negro|42": 0 },
    },
    serum: {
      id: "s1", nombre: "Sérum Calma", categoria: "Skincare", foto: f("serum-calma"), precio: 69, precioAntes: 89, estado: "activo",
      oferta: { hasta: proximo(hoy, 0) },
      opciones: [{ nombre: "Tamaño", valores: ["15 ml", "30 ml"] }],
      stock: { "15 ml": 6, "30 ml": 4 },
    },
    // Producto nuevo: precio y stock vacíos, para ver los ejemplos de los campos.
    vela: { id: "v1", nombre: "Vela Ámbar", categoria: "Hogar", precio: 0, estado: "activo", opciones: [], stock: { "": 0 } },
  };
}

/** Catálogo de Glow Labo para la lista y la tienda: 2 ofertas activas, 1 programada. */
export function catalogoGlow(hoy: string): ProductoProto[] {
  const domingo = proximo(hoy, 0);
  return [
    { ...ejemplosFormulario(hoy).serum },
    { id: "g2", nombre: "BB cream Nube", categoria: "Maquillaje", foto: f("bb-cream-nube"), precio: 55, precioAntes: 75, oferta: { hasta: domingo }, estado: "activo",
      opciones: [{ nombre: "Tono", valores: ["Claro", "Medio", "Canela"] }], stock: { Claro: 3, Medio: 5, Canela: 2 } },
    { id: "g3", nombre: "Aceite Kiwano", categoria: "Skincare", foto: f("aceite-kiwano"), precio: 98, estado: "activo", opciones: [], stock: { "": 7 } },
    { id: "g4", nombre: "Base Piel", categoria: "Maquillaje", foto: f("base-piel"), precio: 99, precioAntes: 119, oferta: { desde: sumarDias(hoy, 5), hasta: sumarDias(hoy, 12) }, estado: "activo",
      opciones: [{ nombre: "Tono", valores: ["02", "04", "06"] }], stock: { "02": 2, "04": 3, "06": 1 } },
    { id: "g5", nombre: "Jabón Avena", categoria: "Cuerpo", foto: f("jabon-avena"), precio: 29, estado: "activo", opciones: [], stock: { "": 20 } },
    { id: "g6", nombre: "Bruma Rosas", categoria: "Skincare", precio: 49, estado: "pausado", opciones: [{ nombre: "Tamaño", valores: ["50 ml", "100 ml"] }], stock: { "50 ml": 0, "100 ml": 0 } },
  ];
}

/** "2 colores", "3 tonos", "1 tamaño": plural en español del nombre de la opción. */
export const contarOpcion = (o: OpcionProto) => {
  const n = o.nombre.trim().toLowerCase() || "valor";
  return `${o.valores.length} ${o.valores.length === 1 ? n : /[aeiouáéó]$/.test(n) ? `${n}s` : `${n}es`}`;
};

export const stockTotal = (p: ProductoProto) => Object.values(p.stock).reduce((s, n) => s + n, 0);
