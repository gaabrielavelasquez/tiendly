import { obtenerProductos } from "@/features/productos/lib/mock";
import { obtenerVitrina, slugProducto } from "@/features/vitrina/lib/vitrina";
import type { CatalogoCompra } from "../types";

/**
 * Lo que el carrito y la compra necesitan del catálogo publicado: precio, foto por color y stock por
 * variante. Se arma en el servidor; el carrito en sí vive en el navegador. `null` si la tienda no existe.
 */
export async function obtenerCompra(slug: string) {
  const vitrina = await obtenerVitrina(slug);
  if (!vitrina) return null;
  const activos = (await obtenerProductos("catalogo")).filter((p) => p.estado === "activo");
  const catalogo: CatalogoCompra = Object.fromEntries(
    activos.map((p) => [
      p.id,
      {
        nombre: p.nombre,
        slug: slugProducto(p.nombre),
        precio: p.precio,
        foto: p.imagen,
        fotos: Object.fromEntries(Object.entries(p.fotos ?? {}).map(([color, fotos]) => [color, fotos[0]])),
        stock: Object.fromEntries(p.variantes.map((v) => [`${v.color}|${v.talla}`, v.stock])),
      },
    ]),
  );
  return { tienda: vitrina.tienda, categorias: vitrina.categorias, catalogo };
}

export type DatosCompra = NonNullable<Awaited<ReturnType<typeof obtenerCompra>>>;
