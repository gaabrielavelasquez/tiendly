import { obtenerProductos } from "@/features/productos/lib/mock";
import { nivelStock, stockTotal } from "@/features/productos/lib/reglas";
import type { Categoria, Producto, Variante } from "@/features/productos/types";
import { DETALLE, HEX_COLOR } from "./contenido";
import { esHeather } from "@/lib/datos/semillas";
import { TIENDAS_EJEMPLO } from "@/lib/datos/tiendas-ejemplo";
import { datosTienda } from "@/lib/datos/tienda";

// Vitrina pública: lo que ve el cliente. Lee el mismo catálogo que el panel, pero solo lo publicado.

export type ProductoVitrina = {
  id: string;
  slug: string;
  nombre: string;
  precio: number;
  precioAntes?: number;
  imagen?: string;
  categorias: Categoria[];
  agotado: boolean;
  /** Colores en orden, con su muestra (dato del producto). */
  colores: { nombre: string; hex?: string }[];
  stock: number;
};

/** Lo que agrega la página de producto. */
export type FichaProducto = ProductoVitrina & { variantes: Variante[]; tallas: string[]; fotos: Record<string, string[]>; corto?: string; sobre?: string };

/** Portada de una sola foto, con su titular y bajada (hoy, la de MUÑA; Mi tienda todavía no la publica). */
export type PortadaPropia = { src: string; alt: string; titulo: string; bajada: string };

/** `demo`: Heather trae su portada, fotos y beneficios; las demás tiendas muestran solo lo que cargaron. */
export type Vitrina = {
  tienda: { nombre: string; slug: string; celular: string; logo?: string; plan: "free" | "pro"; demo: boolean; portada?: PortadaPropia };
  productos: ProductoVitrina[];
  categorias: { id: Categoria; label: string }[];
};

/** La portada de una tienda de ejemplo que existe de verdad (MUÑA, la demo pública): la misma de la vista previa del registro. */
const portadaDe = (slug: string): PortadaPropia | undefined => TIENDAS_EJEMPLO.find((t) => t.slug === slug)?.portada;

export const LABEL: Record<Categoria, string> = { balerinas: "Balerinas", tacos: "Tacos", botas: "Botas", plataformas: "Plataformas", ropa: "Ropa" };

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
  categorias: p.categorias,
  agotado: nivelStock(p) === "agotado",
  colores: [...new Set(p.variantes.map((x) => x.color))].map((nombre) => ({ nombre, hex: HEX_COLOR[nombre] })),
  stock: stockTotal(p),
});

const aFicha = (p: Producto): FichaProducto => ({
  ...aVitrina(p),
  variantes: p.variantes,
  tallas: [...new Set(p.variantes.map((x) => x.talla))],
  fotos: p.fotos ?? (p.imagen ? { [p.variantes[0]?.color ?? ""]: [p.imagen] } : {}),
  corto: DETALLE[p.id]?.corto,
  sobre: p.descripcion ?? DETALLE[p.id]?.sobre,
});

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
  const productos = (await obtenerProductos("catalogo", slug))
    .filter((p) => p.estado === "activo")
    .map(aVitrina)
    .sort((a, b) => Number(a.agotado) - Number(b.agotado));
  const presentes = new Set(productos.flatMap((p) => p.categorias));
  const categorias = (Object.keys(LABEL) as Categoria[]).filter((c) => presentes.has(c)).map((id) => ({ id, label: LABEL[id] }));
  const { nombre, logo, plan } = d.tienda;
  return { tienda: { nombre, slug, celular: d.config.pagos.whatsapp.celular, logo, plan, demo: esHeather(slug), portada: portadaDe(slug) }, productos, categorias };
}

export const leerCategoria = (v: string | string[] | undefined, validas: Categoria[]): Categoria | "todos" => {
  const c = Array.isArray(v) ? v[0] : v;
  return validas.includes(c as Categoria) ? (c as Categoria) : "todos";
};
