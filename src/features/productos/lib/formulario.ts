import type { Categoria, Producto } from "../types";

// Modelo y reglas del formulario de producto. Funciones puras, sin React.

export type ImagenForm = { id: string; url: string; nombre: string };

/** Datos propios de cada combinación. SKU y precio son opcionales (el precio vacío usa el precio base). */
export type VarianteForm = { sku: string; precio: string; stock: string };

export type FormProducto = {
  nombre: string;
  descripcion: string;
  /** Texto tal como lo escribe la persona; se valida y convierte al guardar. */
  precio: string;
  precioAntes: string;
  colores: string[];
  tallas: string[];
  /** Una entrada por combinación, con clave `color|talla`. */
  variantes: Record<string, VarianteForm>;
  estado: "activo" | "borrador";
  categorias: Categoria[];
  imagenes: ImagenForm[];
};

export type Errores = Partial<Record<"nombre" | "precio" | "precioAntes" | "variantes", string>>;

export const COLORES_SUGERIDOS = ["Negro", "Blanco", "Vainilla", "Camel", "Chocolate", "Azul marino", "Rojo", "Verde oliva"];
export const TALLAS_ROPA = ["XS", "S", "M", "L", "XL"];
export const TALLAS_CALZADO = ["35", "36", "37", "38", "39", "40"];
export const TALLA_UNICA = "Única";
export const COLOR_UNICO = "Único";

export const clave = (color: string, talla: string) => `${color}|${talla}`;

export const VARIANTE_VACIA: VarianteForm = { sku: "", precio: "", stock: "" };

/** Lista plana de combinaciones (para la tabla): "Negro · 36". */
export function filasVariantes(colores: string[], tallas: string[]) {
  return combinaciones(colores, tallas).flatMap(({ color, tallas: ts }) => ts.map((talla) => ({ color, talla, clave: clave(color, talla) })));
}

const sigla = (s: string, n: number) =>
  s.normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/[^a-z0-9]/gi, "").slice(0, n).toUpperCase();

/** SKU sugerido (se muestra como ejemplo): VES-NEG-36. */
export const skuSugerido = (nombre: string, color: string, talla: string) =>
  [sigla(nombre, 3) || "SKU", sigla(color, 3), sigla(talla, 4)].filter(Boolean).join("-");

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
  nombre: "", descripcion: "", precio: "", precioAntes: "", colores: [], tallas: [], variantes: {},
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
    variantes: Object.fromEntries(p.variantes.map((v) => [clave(v.color, v.talla), { ...VARIANTE_VACIA, stock: String(v.stock) }])),
    estado: p.estado === "borrador" ? "borrador" : "activo",
    categorias: p.categorias,
    imagenes: p.imagen ? [{ id: "actual", url: p.imagen, nombre: p.nombre }] : [],
  };
}

const numero = (s: string) => (s.trim() === "" ? NaN : Number(s.replace(",", ".")));

/** Precio por variante: vacío es válido (usa el precio base); si se escribe, tiene que ser mayor a 0. */
export const precioVarianteInvalido = (v: VarianteForm) => v.precio.trim() !== "" && !(numero(v.precio) > 0);

/** "Tus clientes verán −21 %." cuando hay un precio de comparación válido. */
export function descuento(f: FormProducto) {
  const p = numero(f.precio);
  const antes = numero(f.precioAntes);
  if (!(p > 0) || !(antes > p)) return null;
  return Math.round((1 - p / antes) * 100);
}

export function stockTotal(f: FormProducto) {
  return filasVariantes(f.colores, f.tallas).reduce((s, fila) => s + Number(f.variantes[fila.clave]?.stock || 0), 0);
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
  // Solo las combinaciones vigentes: si se quitó un color, sus datos viejos no bloquean el guardado.
  const vigentes = filasVariantes(f.colores, f.tallas).map((fila) => f.variantes[fila.clave] ?? VARIANTE_VACIA);
  if (vigentes.some(precioVarianteInvalido)) {
    e.variantes = "Revisa los precios por variante: tienen que ser mayores a 0, o déjalos vacíos para usar el precio base.";
  }
  return e;
}
