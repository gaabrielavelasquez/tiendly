import type { Categoria, Producto } from "../types";

// Modelo y reglas del formulario de producto. Funciones puras, sin React.

export type ImagenForm = { id: string; url: string; nombre: string };

export type FormProducto = {
  nombre: string;
  descripcion: string;
  /** Texto tal como lo escribe la persona; se valida y convierte al guardar. */
  precio: string;
  precioAntes: string;
  colores: string[];
  tallas: string[];
  /** Stock por combinación, con clave `color|talla`. */
  stock: Record<string, string>;
  estado: "activo" | "borrador";
  categorias: Categoria[];
  imagenes: ImagenForm[];
};

export type Errores = Partial<Record<"nombre" | "precio" | "precioAntes" | "stock", string>>;

export const COLORES_SUGERIDOS = ["Negro", "Blanco", "Vainilla", "Camel", "Chocolate", "Azul marino", "Rojo", "Verde oliva"];
export const TALLAS_ROPA = ["XS", "S", "M", "L", "XL"];
export const TALLAS_CALZADO = ["35", "36", "37", "38", "39", "40"];
export const TALLA_UNICA = "Única";
export const COLOR_UNICO = "Único";

export const clave = (color: string, talla: string) => `${color}|${talla}`;

/**
 * Regla de catálogo: 1 modelo = 1 producto con variantes de colorway y talla.
 * Sin colores o sin tallas elegidas, el producto tiene un solo color o una sola talla.
 */
export function combinaciones(colores: string[], tallas: string[]) {
  const cs = colores.length ? colores : [COLOR_UNICO];
  const ts = tallas.length ? tallas : [TALLA_UNICA];
  return cs.map((color) => ({ color, tallas: ts }));
}

export const formVacio = (): FormProducto => ({
  nombre: "", descripcion: "", precio: "", precioAntes: "", colores: [], tallas: [], stock: {},
  estado: "borrador", categorias: [], imagenes: [],
});

/** Prellena el formulario para editar un producto existente. */
export function desdeProducto(p: Producto): FormProducto {
  const colores = [...new Set(p.variantes.map((v) => v.color))];
  const tallas = [...new Set(p.variantes.map((v) => v.talla))].filter((t) => t !== TALLA_UNICA);
  return {
    nombre: p.nombre,
    descripcion: "",
    precio: String(p.precio),
    precioAntes: p.precioAntes ? String(p.precioAntes) : "",
    colores,
    tallas,
    stock: Object.fromEntries(p.variantes.map((v) => [clave(v.color, v.talla), String(v.stock)])),
    estado: p.estado === "borrador" ? "borrador" : "activo",
    categorias: p.categorias,
    imagenes: p.imagen ? [{ id: "actual", url: p.imagen, nombre: p.nombre }] : [],
  };
}

const numero = (s: string) => (s.trim() === "" ? NaN : Number(s.replace(",", ".")));

/** "Tus clientes verán −21 %." cuando hay un precio de comparación válido. */
export function descuento(f: FormProducto) {
  const p = numero(f.precio);
  const antes = numero(f.precioAntes);
  if (!(p > 0) || !(antes > p)) return null;
  return Math.round((1 - p / antes) * 100);
}

export function stockTotal(f: FormProducto) {
  return combinaciones(f.colores, f.tallas)
    .flatMap(({ color, tallas }) => tallas.map((t) => Number(f.stock[clave(color, t)] || 0)))
    .reduce((s, n) => s + n, 0);
}

/** Mensajes con punto final (regla de micro-copy). */
export function validar(f: FormProducto): Errores {
  const e: Errores = {};
  if (f.nombre.trim().length < 2) e.nombre = "Escribe el nombre del producto.";
  const precio = numero(f.precio);
  if (!(precio > 0)) e.precio = "Escribe un precio mayor a 0.";
  if (f.precioAntes.trim()) {
    const antes = numero(f.precioAntes);
    if (!(antes > 0)) e.precioAntes = "Escribe un número válido o deja el campo vacío.";
    else if (precio > 0 && antes <= precio) e.precioAntes = "Tiene que ser mayor que el precio, para que se vea como rebaja.";
  }
  const negativo = Object.values(f.stock).some((v) => v.trim() !== "" && !(Number(v) >= 0 && Number.isInteger(Number(v))));
  if (negativo) e.stock = "El stock va en unidades enteras, desde 0.";
  return e;
}
