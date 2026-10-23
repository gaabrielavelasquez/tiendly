import { obtenerProductos } from "@/features/productos/lib/mock";
import { obtenerVitrina, slugProducto } from "@/features/vitrina/lib/vitrina";
import { configDe } from "@/features/configuracion/lib/mock";
import { claveVariante, detalleVariante, fotosDe } from "@/features/productos/lib/variantes";
import { estadoOferta, precioVigente } from "@/features/productos/lib/ofertas";
import { obtenerCupones } from "@/features/cupones/lib/mock";
import { estadoCupon } from "@/features/cupones/lib/reglas";
import { hoyLima } from "@/lib/reloj";
import type { CatalogoCompra } from "../types";
import { reglasCompra } from "./config";

/**
 * Lo que el carrito y la compra necesitan: del catálogo publicado (precio, y foto, stock y valores de
 * cada variante) y de la configuración de la tienda (métodos de pago, entregas y envío gratis). `hayCupones`: el carrito
 * muestra el campo de cupón solo si la tienda tiene alguno activo hoy. Se arma en el servidor; el carrito en sí vive en el navegador. `null` si la tienda no existe.
 */
export async function obtenerCompra(slug: string) {
  const vitrina = await obtenerVitrina(slug);
  if (!vitrina) return null;
  const [productos, config, cupones] = await Promise.all([obtenerProductos("catalogo", slug), configDe(slug), obtenerCupones(slug).catch(() => [])]);
  if (!config) return null;
  const activos = productos.filter((p) => p.estado === "activo");
  const hoy = hoyLima();
  const catalogo: CatalogoCompra = Object.fromEntries(
    activos.map((p) => [
      p.id,
      {
        nombre: p.nombre,
        slug: slugProducto(p.nombre),
        // El precio de hoy (0034): con la oferta activa, el de oferta; si no, el normal. El cupón se aplica encima.
        precio: precioVigente(p, hoy),
        precioAntes: estadoOferta(p, hoy) === "activa" ? p.precioAntes : undefined,
        foto: p.imagen,
        variantes: Object.fromEntries(
          p.variantes.map((v) => [claveVariante(v.valores), { stock: v.stock, foto: fotosDe(p, v.valores)[0], detalle: detalleVariante(p.opciones, v.valores) }]),
        ),
      },
    ]),
  );
  // Lo que la tienda configuró en Pagos y Entregas (módulo 2) manda en el checkout.
  const hayCupones = cupones.some((c) => estadoCupon(c, hoy) === "activo");
  return { tienda: vitrina.tienda, categorias: vitrina.categorias, catalogo, reglas: reglasCompra(config), hayCupones };
}

export type DatosCompra = NonNullable<Awaited<ReturnType<typeof obtenerCompra>>>;
