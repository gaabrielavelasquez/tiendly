import type { Producto, TablaTallas } from "../types";
import { colorPorTalla } from "./variantes";

// Catálogo de Heather: calzado hecho a mano en Lima, con las fotos reales de la marca
// (public/heather). Fotos por color; tallas de calzado 35–40.

const TALLAS = ["35", "36", "37", "38", "39", "40"];
/** Tabla orientativa de la marca: largo del pie en cm (la misma para todos sus modelos). */
const TABLA: TablaTallas = { medidas: ["Largo del pie"], filas: { "35": ["22.5"], "36": ["23"], "37": ["23.5"], "38": ["24"], "39": ["24.5"], "40": ["25"] } };
const f = (archivo: string) => `/heather/${archivo}`;

type Base = Omit<Producto, "opciones" | "variantes" | "imagen"> & { stock: Record<string, number[]> };
/** Variantes color × talla; la foto principal es la primera del primer color. */
const producto = ({ stock, ...p }: Base): Producto => ({ ...p, ...colorPorTalla(stock, TALLAS), imagen: Object.values(p.fotos ?? {})[0]?.[0], tablaTallas: TABLA });

/** El catálogo de Heather (tienda de demo local). En Vercel no se usa: ver lib/datos/semillas. */
export const CATALOGO_HEATHER: Producto[] = [
  producto({ id: "p1", nombre: "Balerinas Chloé", sku: "BAL-CHL", categorias: ["Balerinas"], estado: "activo", precio: 360,
    fotos: { Plata: [f("chloe-silver-1.jpg"), f("chloe-silver-2.png"), f("chloe-silver-3.png")], Burdeos: [f("chloe-burgundy.png")], Negro: [f("chloe-black.png")] },
    stock: { Plata: [2, 4, 5, 3, 2, 0], Burdeos: [1, 2, 3, 2, 1, 0], Negro: [2, 3, 4, 3, 2, 1] } }),
  producto({ id: "p2", nombre: "Balerinas Chlow Vainilla", sku: "BAL-CLW", categorias: ["Balerinas"], estado: "activo", precio: 340,
    fotos: { Vainilla: [f("chlow-vainilla.png")] }, stock: { Vainilla: [1, 3, 3, 2, 1, 0] } }),
  producto({ id: "p3", nombre: "Zapatos de Taco Vivienne", sku: "TAC-VIV", categorias: ["Tacos"], estado: "activo", precio: 330, precioAntes: 380,
    fotos: { Negro: [f("vivienne-black.png")], Vainilla: [f("vivienne-vainilla.png")], Burdeos: [f("vivienne-burgundy.png")] },
    stock: { Negro: [1, 2, 3, 2, 1, 1], Vainilla: [0, 2, 2, 1, 1, 0], Burdeos: [1, 1, 2, 1, 0, 0] } }),
  producto({ id: "p4", nombre: "Botas Danika", sku: "BOT-DAN", categorias: ["Botas", "Plataformas"], estado: "activo", precio: 520,
    fotos: { Negro: [f("danika-black-1.png"), f("danika-black-2.png")] }, stock: { Negro: [0, 1, 2, 1, 1, 0] } }),
  producto({ id: "p5", nombre: "Tacos Amelie", sku: "TAC-AME", categorias: ["Tacos"], estado: "activo", precio: 370,
    fotos: { Negro: [f("amelie-black.png")], Vainilla: [f("amelie-vainilla.png")], Burdeos: [f("amelie-burgundy.png")] },
    stock: { Negro: [2, 3, 4, 3, 2, 1], Vainilla: [1, 2, 3, 2, 1, 0], Burdeos: [1, 2, 2, 1, 1, 0] } }),
  producto({ id: "p6", nombre: "Botines Sophie", sku: "BOT-SOP", categorias: ["Botas"], estado: "activo", precio: 470,
    fotos: { Negro: [f("sophie-black.png")], Choco: [f("sophie-choco.png")] }, stock: { Negro: [0, 0, 0, 0, 0, 0], Choco: [0, 0, 0, 0, 0, 0] } }),
  producto({ id: "p7", nombre: "Zapatos Mary Jane", sku: "BAL-MRY", categorias: ["Balerinas"], estado: "activo", precio: 380,
    fotos: { Burdeos: [f("mary-jane-burgundy.png")], Negro: [f("mary-jane-black.png"), f("mary-jane-black-2.png")] },
    stock: { Burdeos: [1, 2, 2, 2, 1, 0], Negro: [2, 3, 3, 2, 1, 1] } }),
  producto({ id: "p8", nombre: "Plataformas Rouge", sku: "PLA-ROU", categorias: ["Plataformas"], estado: "activo", precio: 410,
    fotos: { Negro: [f("rouge-black-1.png"), f("rouge-black-2.png"), f("rouge-black-3.png"), f("rouge-black-4.png")] }, stock: { Negro: [0, 1, 1, 1, 0, 0] } }),
];
