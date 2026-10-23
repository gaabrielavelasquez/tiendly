import type { Categoria, Opcion, Producto } from "../types";
import { FOTOS_GENERAL, valorDe } from "./variantes";

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
  estado: "activo" | "pausado";
  categorias: Categoria[];
  imagenes: ImagenForm[];
};

export type Errores = Partial<Record<"nombre" | "precio" | "precioAntes" | "variantes", string>>;

export const COLORES_SUGERIDOS = ["Negro", "Plata", "Burdeos", "Vainilla", "Choco", "Camel", "Blanco"];
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
  estado: "activo", categorias: [], imagenes: [], // se publica al guardar (decisión 0028)
});

/**
 * Prellena el formulario para editar un producto existente. El formulario todavía arma color × talla
 * (auditoría multirubro, PR 3): sin color o sin talla usa "Único" y "Única" solo como claves internas.
 */
export function desdeProducto(p: Producto): FormProducto {
  const color = (v: Producto["variantes"][number]) => valorDe(p, v, "color") ?? COLOR_UNICO;
  const talla = (v: Producto["variantes"][number]) => valorDe(p, v, "talla") ?? TALLA_UNICA;
  const colores = p.opciones.find((o) => o.tipo === "color")?.valores ?? [];
  const tallas = p.opciones.find((o) => o.tipo === "talla")?.valores ?? [];
  return {
    nombre: p.nombre,
    descripcion: p.descripcion ?? "",
    precio: String(p.precio),
    precioAntes: p.precioAntes ? String(p.precioAntes) : "",
    colores,
    tallas,
    variantes: Object.fromEntries(p.variantes.map((v) => [clave(color(v), talla(v)), { ...VARIANTE_VACIA, stock: String(v.stock) }])),
    estado: p.estado,
    categorias: p.categorias,
    // Todas las fotos del producto (de todos los colores), sin repetir.
    imagenes: [...new Set(Object.values(p.fotos ?? {}).flat().concat(p.imagen ? [p.imagen] : []))].map((url, i) => ({ id: `actual-${i}`, url, nombre: p.nombre })),
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
  // Vacío no es error: se guarda pausado (decisión 0028). Escrito y mal, sí.
  if (f.precio.trim() && !(precio > 0)) e.precio = "Escribe un precio mayor a 0.";
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

/**
 * Lo que impide publicar (decisión 0028): sin foto, precio o stock, el producto se guarda pausado.
 * Devuelve el texto para el aviso ("la foto y el precio") o null si está completo.
 */
export function faltaParaPublicar(f: FormProducto): string | null {
  const faltan = [
    !f.imagenes.length && "la foto",
    !(numero(f.precio) > 0) && "el precio",
    stockTotal(f) === 0 && "el stock",
  ].filter(Boolean) as string[];
  if (!faltan.length) return null;
  return faltan.length === 1 ? faltan[0] : `${faltan.slice(0, -1).join(", ")} y ${faltan.at(-1)}`;
}

/**
 * Del formulario al catálogo. Lo que el modelo aún no guarda: el precio y el SKU por variante.
 * Las fotos que ya tenía cada color se mantienen; las nuevas se suman a todos los colores.
 */
export function aProducto(f: FormProducto, id: string, anterior?: Producto | null): Producto {
  const urls = f.imagenes.map((i) => i.url);
  const previas = new Set(Object.values(anterior?.fotos ?? {}).flat());
  const nuevas = urls.filter((u) => !previas.has(u));
  // Fotos por color; sin colores, una sola galería.
  const claves = f.colores.length ? f.colores : [FOTOS_GENERAL];
  const fotos = Object.fromEntries(
    claves.map((k) => {
      const propias = (anterior?.fotos?.[k] ?? []).filter((u) => urls.includes(u)).concat(nuevas);
      return [k, propias.length ? propias : urls];
    }),
  );
  const opciones: Opcion[] = [
    ...(f.colores.length ? [{ nombre: "Color", tipo: "color" as const, valores: f.colores }] : []),
    ...(f.tallas.length ? [{ nombre: "Talla", tipo: "talla" as const, valores: f.tallas }] : []),
  ];
  // "Único" y "Única" son claves internas del formulario: no se guardan como valores.
  const valores = (color: string, talla: string) => [f.colores.length && color, f.tallas.length && talla].filter((x): x is string => !!x);
  return {
    id,
    nombre: f.nombre.trim(),
    sku: anterior?.sku,
    descripcion: f.descripcion.trim() || undefined,
    categorias: f.categorias,
    estado: f.estado,
    precio: numero(f.precio) > 0 ? numero(f.precio) : 0,
    precioAntes: numero(f.precioAntes) > 0 ? numero(f.precioAntes) : undefined,
    opciones,
    variantes: filasVariantes(f.colores, f.tallas).map(({ color, talla, clave: k }) => ({ valores: valores(color, talla), stock: Number(f.variantes[k]?.stock || 0) })),
    imagen: urls[0],
    fotos: urls.length ? fotos : undefined,
  };
}
