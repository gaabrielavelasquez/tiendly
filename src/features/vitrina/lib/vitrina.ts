import { obtenerProductos } from "@/features/productos/lib/mock";
import { nivelStock } from "@/features/productos/lib/reglas";
import type { Categoria, Producto } from "@/features/productos/types";
import { tiendaActual } from "@/lib/sesion";

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
};

export type Vitrina = { tienda: { nombre: string; slug: string }; productos: ProductoVitrina[]; categorias: { id: Categoria; label: string }[] };

const LABEL: Record<Categoria, string> = { ropa: "Ropa", calzado: "Calzado", accesorios: "Accesorios", joyeria: "Joyería" };

/** "Vestido Chloé" → "vestido-chloe" (para el link del producto). */
export const slugProducto = (nombre: string) =>
  nombre.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/** La foto del panel viene en 160 × 160; la vitrina la pide en 4:5 y más grande. */
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
});

/**
 * Datos de la vitrina de una tienda. `null` si la tienda no existe (404).
 * Solo productos activos: los borradores y archivados no se publican. Los agotados se muestran
 * (con su etiqueta) al final, para que la tienda no se vea vacía y el cliente sepa que vuelven.
 */
export async function obtenerVitrina(slug: string): Promise<Vitrina | null> {
  if (slug !== tiendaActual.slug) return null;
  const productos = (await obtenerProductos("catalogo"))
    .filter((p) => p.estado === "activo")
    .map(aVitrina)
    .sort((a, b) => Number(a.agotado) - Number(b.agotado));
  const presentes = new Set(productos.flatMap((p) => p.categorias));
  const categorias = (Object.keys(LABEL) as Categoria[]).filter((c) => presentes.has(c)).map((id) => ({ id, label: LABEL[id] }));
  return { tienda: { nombre: tiendaActual.nombre, slug }, productos, categorias };
}

export const leerCategoria = (v: string | string[] | undefined, validas: Categoria[]): Categoria | "todos" => {
  const c = Array.isArray(v) ? v[0] : v;
  return validas.includes(c as Categoria) ? (c as Categoria) : "todos";
};
