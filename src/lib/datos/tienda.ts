import { cache } from "react";
import type { ConfigCompra } from "@/features/configuracion/types";
import type { Cupon } from "@/features/cupones/types";
import type { RubroId } from "@/features/onboarding/lib/rubros";
import type { AlmacenPedidos } from "@/features/pedidos/lib/almacen";
import type { Inventario } from "@/features/productos/lib/inventario";
import type { Producto } from "@/features/productos/types";
import { existe, leer, escribir } from "./almacen";
import { migrarDatos } from "./migrar";
import { esEjemplo, esHeather, RETIRADAS, semillaDe, slugDemo } from "./semillas";

// Todos los datos de una tienda en un solo documento (hasta tener backend): la tienda, su catálogo, sus
// pedidos e inventario, sus cupones, su configuración de cobro y entrega, y sus rubros.

export type TiendaSesion = {
  nombre: string;
  slug: string;
  /** Nombre de la sección de ofertas en la tienda y en su menú (Mi tienda, Plan Free; 0034). Vacío: "Ofertas". */
  nombreOfertas?: string;
  /** Nombre de pila de quien lleva la tienda, solo si entró con Google (el onboarding no lo pide, decisión 0013). */
  duena?: string;
  /** El WhatsApp al que escriben los clientes desde la vitrina. */
  celularVentas: string;
  logo?: string;
  /** Identidad publicada desde Mi tienda; sin valor se conservan los datos originales de la tienda. */
  apariencia?: Omit<import("@/features/mi-tienda/types").Tienda, "whatsapp" | "nombreOfertas">;
  plan: "free" | "pro";
  /** Pasos de "arrancar tu tienda" que no se deducen de los datos (Inicio, tienda nueva). */
  hechos: { pagos: boolean; entregas: boolean; compartir: boolean };
};

export type DatosTienda = {
  tienda: TiendaSesion;
  productos: Producto[];
  pedidos: AlmacenPedidos;
  inventario: Inventario;
  cupones: Cupon[];
  config: ConfigCompra;
  rubros: RubroId[];
  /** Detalle que se escribe al elegir Otro en el registro. */
  rubroOtro?: string;
};

/** Separadas por entorno: local, preview y producción no comparten datos aunque usen la misma base. */
const clave = (slug: string) => `${process.env.VERCEL_ENV ?? "local"}:tienda:${slug}`;

/** Lee de nuevo (sin caché): para modificar. La tienda de demo se crea la primera vez que se pide. */
async function cargar(slug: string): Promise<DatosTienda | null> {
  if (esHeather(slug) && slugDemo() !== "heather") return null; // Heather no es pública hasta tener su permiso
  if (RETIRADAS.has(slug)) return null; // demo retirada: 404 aunque siga en la base
  const d = await leer<DatosTienda>(clave(slug));
  if (d) return migrarDatos(d);
  const semilla = semillaDe(slug);
  if (!semilla) return null;
  await escribir(clave(slug), semilla);
  return semilla;
}

/** Los datos de una tienda, una sola lectura por pedido de página. `null` si no existe. */
export const datosTienda = cache(cargar);

export const existeTienda = (slug: string) => (esEjemplo(slug) ? Promise.resolve(true) : existe(clave(slug)));

export async function guardarTienda(d: DatosTienda) {
  await escribir(clave(d.tienda.slug), d);
}

/**
 * Lee, cambia y guarda los datos de una tienda. `null` si no existe.
 * Sin bloqueo: dos cambios al mismo tiempo en la misma tienda pueden pisarse (alcanza para el test).
 */
export async function mutarTienda<T>(slug: string, cambio: (d: DatosTienda) => T | Promise<T>): Promise<T | null> {
  const d = await cargar(slug);
  if (!d) return null;
  const r = await cambio(d);
  await guardarTienda(d);
  return r;
}
