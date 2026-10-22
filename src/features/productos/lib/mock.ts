import type { Escenario, Producto, Variante } from "../types";

// Catálogo de Heather: calzado hecho a mano en Lima, con las fotos reales de la marca
// (public/heather). Fotos por color; tallas de calzado 35–40. Se elige el escenario con ?escenario=.

const TALLAS = ["35", "36", "37", "38", "39", "40"];
const f = (archivo: string) => `/heather/${archivo}`;

/** Arma las variantes color × talla con el stock de cada color en orden de talla (35 → 40). */
function variantes(stockPorColor: Record<string, number[]>): Variante[] {
  return Object.entries(stockPorColor).flatMap(([color, stock]) => TALLAS.map((talla, i) => ({ color, talla, stock: stock[i] ?? 0 })));
}

type Base = Omit<Producto, "variantes" | "imagen"> & { stock: Record<string, number[]> };
/** La foto principal es la primera del primer color. */
const producto = ({ stock, ...p }: Base): Producto => ({ ...p, variantes: variantes(stock), imagen: Object.values(p.fotos ?? {})[0]?.[0] });

const CATALOGO: Producto[] = [
  producto({ id: "p1", nombre: "Balerinas Chloé", sku: "BAL-CHL", categorias: ["balerinas"], estado: "activo", precio: 360,
    fotos: { Plata: [f("chloe-silver-1.jpg"), f("chloe-silver-2.png"), f("chloe-silver-3.png")], Burdeos: [f("chloe-burgundy.png")], Negro: [f("chloe-black.png")] },
    stock: { Plata: [2, 4, 5, 3, 2, 0], Burdeos: [1, 2, 3, 2, 1, 0], Negro: [2, 3, 4, 3, 2, 1] } }),
  producto({ id: "p2", nombre: "Balerinas Chlow Vainilla", sku: "BAL-CLW", categorias: ["balerinas"], estado: "activo", precio: 340,
    fotos: { Vainilla: [f("chlow-vainilla.png")] }, stock: { Vainilla: [1, 3, 3, 2, 1, 0] } }),
  producto({ id: "p3", nombre: "Zapatos de Taco Vivienne", sku: "TAC-VIV", categorias: ["tacos"], estado: "activo", precio: 330, precioAntes: 380,
    fotos: { Negro: [f("vivienne-black.png")], Vainilla: [f("vivienne-vainilla.png")], Burdeos: [f("vivienne-burgundy.png")] },
    stock: { Negro: [1, 2, 3, 2, 1, 1], Vainilla: [0, 2, 2, 1, 1, 0], Burdeos: [1, 1, 2, 1, 0, 0] } }),
  producto({ id: "p4", nombre: "Botas Danika", sku: "BOT-DAN", categorias: ["botas", "plataformas"], estado: "activo", precio: 520,
    fotos: { Negro: [f("danika-black-1.png"), f("danika-black-2.png")] }, stock: { Negro: [0, 1, 2, 1, 1, 0] } }),
  producto({ id: "p5", nombre: "Tacos Amelie", sku: "TAC-AME", categorias: ["tacos"], estado: "activo", precio: 370,
    fotos: { Negro: [f("amelie-black.png")], Vainilla: [f("amelie-vainilla.png")], Burdeos: [f("amelie-burgundy.png")] },
    stock: { Negro: [2, 3, 4, 3, 2, 1], Vainilla: [1, 2, 3, 2, 1, 0], Burdeos: [1, 2, 2, 1, 1, 0] } }),
  producto({ id: "p6", nombre: "Botines Sophie", sku: "BOT-SOP", categorias: ["botas"], estado: "activo", precio: 470,
    fotos: { Negro: [f("sophie-black.png")], Choco: [f("sophie-choco.png")] }, stock: { Negro: [0, 0, 0, 0, 0, 0], Choco: [0, 0, 0, 0, 0, 0] } }),
  producto({ id: "p7", nombre: "Zapatos Mary Jane", sku: "BAL-MRY", categorias: ["balerinas"], estado: "activo", precio: 380,
    fotos: { Burdeos: [f("mary-jane-burgundy.png")], Negro: [f("mary-jane-black.png"), f("mary-jane-black-2.png")] },
    stock: { Burdeos: [1, 2, 2, 2, 1, 0], Negro: [2, 3, 3, 2, 1, 1] } }),
  producto({ id: "p8", nombre: "Plataformas Rouge", sku: "PLA-ROU", categorias: ["plataformas"], estado: "activo", precio: 410,
    fotos: { Negro: [f("rouge-black-1.png"), f("rouge-black-2.png"), f("rouge-black-3.png"), f("rouge-black-4.png")] }, stock: { Negro: [0, 1, 1, 1, 0, 0] } }),
];

export function leerEscenario(valor: string | string[] | undefined): Escenario {
  const v = Array.isArray(valor) ? valor[0] : valor;
  return v === "vacio" || v === "error" ? v : "catalogo";
}

/** Un producto por id (para editar). `null` si no existe. */
export async function obtenerProducto(id: string): Promise<Producto | null> {
  await new Promise((r) => setTimeout(r, 400));
  return CATALOGO.find((p) => p.id === id) ?? null;
}

/** Simula la llamada al backend: tarda un poco (se ve el esqueleto) y puede fallar. */
export async function obtenerProductos(escenario: Escenario): Promise<Producto[]> {
  await new Promise((r) => setTimeout(r, 600));
  if (escenario === "error") throw new Error("No se pudo cargar Productos (simulado).");
  return escenario === "vacio" ? [] : CATALOGO;
}
