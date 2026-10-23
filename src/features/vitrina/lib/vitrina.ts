import { obtenerProductos } from "@/features/productos/lib/mock";
import { nivelStock, stockTotal } from "@/features/productos/lib/reglas";
import type { Producto } from "@/features/productos/types";
import { claveVariante, COLOR_UNICO_LEGADO, fotosDe, TALLA_UNICA_LEGADO, valorDe } from "@/features/productos/lib/variantes";
import { DETALLE, HEX_COLOR } from "./contenido";
import { esHeather } from "@/lib/datos/semillas";
import { datosTienda } from "@/lib/datos/tienda";

// Vitrina pública: lo que ve el cliente. Lee el mismo catálogo que el panel, pero solo lo publicado.

export type ProductoVitrina = {
  id: string;
  slug: string;
  nombre: string;
  precio: number;
  precioAntes?: number;
  imagen?: string;
  /** Ids de sus categorías (`slugProducto` del texto), para filtrar en la vitrina. */
  categorias: string[];
  agotado: boolean;
  /** Colores en orden, con su muestra (dato del producto). */
  colores: { nombre: string; hex?: string }[];
  stock: number;
};

/**
 * Una variante vista como color × talla, para los selectores actuales de la ficha (hasta PR 2 de la auditoría
 * multirubro). Sin color o sin talla, "Único" y "Única". `clave`: la que va al carrito.
 */
export type VarianteFicha = { color: string; talla: string; stock: number; clave: string };

/** Lo que agrega la página de producto. `fotos`: por color de la ficha. */
export type FichaProducto = ProductoVitrina & { variantes: VarianteFicha[]; tallas: string[]; fotos: Record<string, string[]>; corto?: string; sobre?: string };

/** `demo`: Heather trae su portada, fotos y beneficios; las demás tiendas muestran solo lo que cargaron. */
export type Vitrina = { tienda: { nombre: string; slug: string; celular: string; logo?: string; plan: "free" | "pro"; demo: boolean }; productos: ProductoVitrina[]; categorias: { id: string; label: string }[] };

/** "Vestido Chloé" → "vestido-chloe" (para el link del producto). */
export const slugProducto = (nombre: string) =>
  nombre.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/** Las fotos de Pexels venían en 160 × 160 para el panel; la vitrina las pide en 4:5. Las locales pasan igual. */
const fotoVitrina = (url?: string) => url?.replace(/w=\d+&h=\d+/, "w=640&h=800");

const aVitrina = (p: Producto): ProductoVitrina => ({
  id: p.id,
  slug: slugProducto(p.nombre),
  nombre: p.nombre,
  precio: p.precio,
  precioAntes: p.precioAntes,
  imagen: fotoVitrina(p.imagen),
  categorias: p.categorias.map(slugProducto),
  agotado: nivelStock(p) === "agotado",
  colores: [...new Set(p.variantes.map((v) => valorDe(p, v, "color") ?? COLOR_UNICO_LEGADO))].map((nombre) => ({ nombre, hex: HEX_COLOR[nombre] })),
  stock: stockTotal(p),
});

function aFicha(p: Producto): FichaProducto {
  const variantes = p.variantes.map((v) => ({
    color: valorDe(p, v, "color") ?? COLOR_UNICO_LEGADO,
    talla: valorDe(p, v, "talla") ?? TALLA_UNICA_LEGADO,
    stock: v.stock,
    clave: claveVariante(v.valores),
  }));
  // Fotos por color de la ficha: las de la primera variante de ese color (la opción de fotos manda).
  const fotos = Object.fromEntries(variantes.map((v, i) => [v.color, fotosDe(p, p.variantes[i].valores)]).reverse());
  return { ...aVitrina(p), variantes, tallas: [...new Set(variantes.map((v) => v.talla))], fotos, corto: DETALLE[p.id]?.corto, sobre: p.descripcion ?? DETALLE[p.id]?.sobre };
}

/**
 * Página de producto: la ficha y 4 relacionados (primero de la misma categoría, sin agotados).
 * `null` si la tienda o el producto no existen, o si el producto no está publicado.
 */
export async function obtenerFicha(tienda: string, slug: string) {
  const d = await datosTienda(tienda);
  if (!d) return null;
  const activos = (await obtenerProductos("catalogo", tienda)).filter((p) => p.estado === "activo");
  const p = activos.find((x) => slugProducto(x.nombre) === slug);
  if (!p) return null;
  const otros = activos.filter((x) => x.id !== p.id && nivelStock(x) !== "agotado");
  const misma = otros.filter((x) => x.categorias.some((c) => p.categorias.includes(c)));
  const relacionados = [...misma, ...otros.filter((x) => !misma.includes(x))].slice(0, 4).map(aVitrina);
  // WhatsApp de ventas: un solo dato, se edita en Mi tienda › Contacto (lo usan la vitrina, Pagos y el checkout).
  return { tienda: { nombre: d.tienda.nombre, slug: tienda, celular: d.config.pagos.whatsapp.celular, demo: esHeather(tienda) }, ficha: aFicha(p), relacionados };
}

/**
 * Datos de la vitrina de una tienda. `null` si la tienda no existe (404).
 * Solo productos activos: los pausados no se publican. Los agotados se muestran
 * (con su etiqueta) al final, para que la tienda no se vea vacía y el cliente sepa que vuelven.
 */
export async function obtenerVitrina(slug: string): Promise<Vitrina | null> {
  const d = await datosTienda(slug);
  if (!d) return null;
  const activos = (await obtenerProductos("catalogo", slug)).filter((p) => p.estado === "activo");
  const productos = activos
    .map(aVitrina)
    .sort((a, b) => Number(a.agotado) - Number(b.agotado));
  // Las categorías de la tienda, en el orden en que aparecen en su catálogo (texto libre, decisión 0032).
  const textos = [...new Set(activos.flatMap((p) => p.categorias))];
  const categorias = [...new Map(textos.map((label) => [slugProducto(label), { id: slugProducto(label), label }])).values()];
  const { nombre, logo, plan } = d.tienda;
  return { tienda: { nombre, slug, celular: d.config.pagos.whatsapp.celular, logo, plan, demo: esHeather(slug) }, productos, categorias };
}

export const leerCategoria = (v: string | string[] | undefined, validas: string[]): string | "todos" => {
  const c = Array.isArray(v) ? v[0] : v;
  return c && validas.includes(c) ? c : "todos";
};
