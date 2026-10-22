import { obtenerProductos } from "@/features/productos/lib/mock";
import { obtenerVitrina, slugProducto } from "@/features/vitrina/lib/vitrina";
import { configActual } from "@/features/configuracion/lib/mock";
import type { CatalogoCompra } from "../types";
import { reglasCompra } from "./config";

/**
 * Lo que el carrito y la compra necesitan: del catálogo publicado (precio, foto por color y stock por
 * variante) y de la configuración de la tienda (métodos de pago, entregas y envío gratis). Se arma en el servidor; el carrito en sí vive en el navegador. `null` si la tienda no existe.
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
  // Lo que la tienda configuró en Pagos y Entregas (módulo 2) manda en el checkout.
  return { tienda: vitrina.tienda, categorias: vitrina.categorias, catalogo, reglas: reglasCompra(configActual()) };
}

export type DatosCompra = NonNullable<Awaited<ReturnType<typeof obtenerCompra>>>;
