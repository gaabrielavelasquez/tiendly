import type { Escenario, Producto, Variante } from "../types";

// Catálogo simulado de una tienda de moda (Heather) hasta tener backend. Se elige con ?escenario=.

/** Arma las variantes color × talla con el stock dado en orden. */
function variantes(colores: string[], tallas: string[], stock: number[]): Variante[] {
  return colores.flatMap((color, i) => tallas.map((talla, j) => ({ color, talla, stock: stock[i * tallas.length + j] ?? 0 })));
}

const CATALOGO: Producto[] = [
  { id: "p1", nombre: "Vestido Chloé", sku: "VES-CHL", categoria: "ropa", estado: "activo", precio: 189,
    variantes: variantes(["Negro", "Arena"], ["S", "M", "L"], [4, 6, 3, 2, 5, 2]) },
  { id: "p2", nombre: "Botines Sophie", sku: "BOT-SOP", categoria: "calzado", estado: "activo", precio: 249,
    variantes: variantes(["Negro", "Camel"], ["36", "37", "38", "39"], [0, 0, 0, 0, 0, 0, 0, 0]) },
  { id: "p3", nombre: "Blazer Amalia", sku: "BLA-AMA", categoria: "ropa", estado: "activo", precio: 229, precioAntes: 289,
    variantes: variantes(["Crudo"], ["S", "M", "L"], [1, 2, 0]) },
  { id: "p4", nombre: "Polo básico oversize", sku: "POL-OVR", categoria: "ropa", estado: "activo", precio: 69,
    variantes: variantes(["Blanco", "Negro", "Gris"], ["S", "M", "L", "XL"], [8, 12, 10, 4, 9, 14, 11, 6, 3, 5, 4, 2]) },
  { id: "p5", nombre: "Jean mom fit", sku: "JEA-MOM", categoria: "ropa", estado: "activo", precio: 139,
    variantes: variantes(["Azul claro", "Azul oscuro"], ["26", "28", "30", "32"], [3, 5, 4, 0, 2, 6, 5, 1]) },
  { id: "p6", nombre: "Sandalias Lía", sku: "SAN-LIA", categoria: "calzado", estado: "activo", precio: 159,
    variantes: variantes(["Dorado"], ["36", "37", "38"], [1, 0, 1]) },
  { id: "p7", nombre: "Cartera Bruna", sku: "CAR-BRU", categoria: "accesorios", estado: "activo", precio: 199,
    variantes: variantes(["Chocolate", "Negro"], ["Única"], [7, 4]) },
  { id: "p8", nombre: "Aretes Luna", sku: "ARE-LUN", categoria: "joyeria", estado: "activo", precio: 59,
    variantes: variantes(["Plata", "Oro"], ["Única"], [15, 9]) },
  { id: "p9", nombre: "Casaca denim Rocío", sku: "CAS-ROC", categoria: "ropa", estado: "activo", precio: 199, precioAntes: 239,
    variantes: variantes(["Índigo"], ["S", "M", "L"], [0, 0, 0]) },
  { id: "p10", nombre: "Falda plisada Inés", sku: "FAL-INE", categoria: "ropa", estado: "activo", precio: 119,
    variantes: variantes(["Verde oliva", "Negro"], ["S", "M"], [4, 3, 6, 2]) },
  { id: "p11", nombre: "Top de lino Mar", sku: "TOP-MAR", categoria: "ropa", estado: "borrador", precio: 89,
    variantes: variantes(["Blanco"], ["S", "M", "L"], [5, 5, 5]) },
  { id: "p12", nombre: "Zapatillas Nube", sku: "ZAP-NUB", categoria: "calzado", estado: "activo", precio: 279,
    variantes: variantes(["Blanco"], ["36", "37", "38", "39", "40"], [2, 4, 5, 3, 1]) },
  { id: "p13", nombre: "Pañuelo de seda Vera", sku: "PAN-VER", categoria: "accesorios", estado: "archivado", precio: 79,
    variantes: variantes(["Estampado"], ["Única"], [0]) },
];

export function leerEscenario(valor: string | string[] | undefined): Escenario {
  const v = Array.isArray(valor) ? valor[0] : valor;
  return v === "vacio" || v === "error" ? v : "catalogo";
}

/** Simula la llamada al backend: tarda un poco (se ve el esqueleto) y puede fallar. */
export async function obtenerProductos(escenario: Escenario): Promise<Producto[]> {
  await new Promise((r) => setTimeout(r, 600));
  if (escenario === "error") throw new Error("No se pudo cargar Productos (simulado).");
  return escenario === "vacio" ? [] : CATALOGO;
}
