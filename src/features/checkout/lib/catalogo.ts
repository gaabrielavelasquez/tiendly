import { obtenerProductos } from "@/features/productos/lib/mock";
import { obtenerVitrina, slugProducto } from "@/features/vitrina/lib/vitrina";
import { configDe } from "@/features/configuracion/lib/mock";
import { claveVariante, detalleVariante, fotosDe } from "@/features/productos/lib/variantes";
import type { CatalogoCompra } from "../types";
import { reglasCompra } from "./config";

/**
 * Lo que el carrito y la compra necesitan: del catálogo publicado (precio, y foto, stock y valores de
 * cada variante) y de la configuración de la tienda (métodos de pago, entregas y envío gratis). Se arma en el servidor; el carrito en sí vive en el navegador. `null` si la tienda no existe.
 */
export async function obtenerCompra(slug: string) {
  const vitrina = await obtenerVitrina(slug);
  if (!vitrina) return null;
  const [productos, config] = await Promise.all([obtenerProductos("catalogo", slug), configDe(slug)]);
  if (!config) return null;
  const activos = productos.filter((p) => p.estado === "activo");
  const catalogo: CatalogoCompra = Object.fromEntries(
    activos.map((p) => [
      p.id,
      {
        nombre: p.nombre,
        slug: slugProducto(p.nombre),
        precio: p.precio,
        foto: p.imagen,
        variantes: Object.fromEntries(
          p.variantes.map((v) => [claveVariante(v.valores), { stock: v.stock, foto: fotosDe(p, v.valores)[0], detalle: detalleVariante(p.opciones, v.valores) }]),
        ),
      },
    ]),
  );
  // Lo que la tienda configuró en Pagos y Entregas (módulo 2) manda en el checkout.
  return { tienda: vitrina.tienda, categorias: vitrina.categorias, catalogo, reglas: reglasCompra(config) };
}

export type DatosCompra = NonNullable<Awaited<ReturnType<typeof obtenerCompra>>>;
