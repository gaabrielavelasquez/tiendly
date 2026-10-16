import type { Escenario, Producto, Variante } from "../types";

// Catálogo simulado de una tienda de moda (Heather) hasta tener backend. Se elige con ?escenario=.

/** Foto de ejemplo de Pexels (licencia libre), recortada en cuadrado para la miniatura. */
const foto = (id: number) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=160&h=160&fit=crop`;

/** Arma las variantes color × talla con el stock dado en orden. */
function variantes(colores: string[], tallas: string[], stock: number[]): Variante[] {
  return colores.flatMap((color, i) => tallas.map((talla, j) => ({ color, talla, stock: stock[i * tallas.length + j] ?? 0 })));
}

const CATALOGO: Producto[] = [
  { id: "p1", imagen: foto(6046220), nombre: "Vestido Chloé", sku: "VES-CHL", categorias: ["ropa"], estado: "activo", precio: 189,
    variantes: variantes(["Negro", "Arena"], ["S", "M", "L"], [4, 6, 3, 2, 5, 2]) },
  { id: "p2", imagen: foto(4786126), nombre: "Botines Sophie", sku: "BOT-SOP", categorias: ["calzado"], estado: "activo", precio: 249,
    variantes: variantes(["Negro", "Camel"], ["36", "37", "38", "39"], [0, 0, 0, 0, 0, 0, 0, 0]) },
  { id: "p3", imagen: foto(12951783), nombre: "Blazer Amalia", sku: "BLA-AMA", categorias: ["ropa"], estado: "activo", precio: 229, precioAntes: 289,
    variantes: variantes(["Crudo"], ["S", "M", "L"], [1, 2, 0]) },
  { id: "p4", imagen: foto(4440567), nombre: "Polo básico oversize", sku: "POL-OVR", categorias: ["ropa"], estado: "activo", precio: 69,
    variantes: variantes(["Blanco", "Negro", "Gris"], ["S", "M", "L", "XL"], [8, 12, 10, 4, 9, 14, 11, 6, 3, 5, 4, 2]) },
  { id: "p5", imagen: foto(4109797), nombre: "Jean mom fit", sku: "JEA-MOM", categorias: ["ropa"], estado: "activo", precio: 139,
    variantes: variantes(["Azul claro", "Azul oscuro"], ["26", "28", "30", "32"], [3, 5, 4, 0, 2, 6, 5, 1]) },
  { id: "p6", imagen: foto(6862846), nombre: "Sandalias Lía", sku: "SAN-LIA", categorias: ["calzado"], estado: "activo", precio: 159,
    variantes: variantes(["Dorado"], ["36", "37", "38"], [1, 0, 1]) },
  { id: "p7", imagen: foto(6650001), nombre: "Cartera Bruna", sku: "CAR-BRU", categorias: ["accesorios"], estado: "activo", precio: 199,
    variantes: variantes(["Chocolate", "Negro"], ["Única"], [7, 4]) },
  { id: "p8", imagen: foto(18597841), nombre: "Aretes Luna", sku: "ARE-LUN", categorias: ["joyeria"], estado: "activo", precio: 59,
    variantes: variantes(["Plata", "Oro"], ["Única"], [15, 9]) },
  { id: "p9", imagen: foto(16428589), nombre: "Casaca denim Rocío", sku: "CAS-ROC", categorias: ["ropa"], estado: "activo", precio: 199, precioAntes: 239,
    variantes: variantes(["Índigo"], ["S", "M", "L"], [0, 0, 0]) },
  { id: "p10", imagen: foto(15240413), nombre: "Falda plisada Inés", sku: "FAL-INE", categorias: ["ropa"], estado: "activo", precio: 119,
    variantes: variantes(["Verde oliva", "Negro"], ["S", "M"], [4, 3, 6, 2]) },
  { id: "p11", imagen: foto(4256573), nombre: "Top de lino Mar", sku: "TOP-MAR", categorias: ["ropa"], estado: "borrador", precio: 89,
    variantes: variantes(["Blanco"], ["S", "M", "L"], [5, 5, 5]) },
  { id: "p12", imagen: foto(1464625), nombre: "Zapatillas Nube", sku: "ZAP-NUB", categorias: ["calzado"], estado: "activo", precio: 279,
    variantes: variantes(["Blanco"], ["36", "37", "38", "39", "40"], [2, 4, 5, 3, 1]) },
  { id: "p13", imagen: foto(2120584), nombre: "Pañuelo de seda Vera", sku: "PAN-VER", categorias: ["accesorios"], estado: "archivado", precio: 79,
    variantes: variantes(["Estampado"], ["Única"], [0]) },
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
