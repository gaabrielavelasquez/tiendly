import type { ItemStock } from "@/features/productos/lib/inventario";
import type { DetallePedido, Pedido } from "../types";
import { AHORA } from "./mock";

// Pedidos creados desde la vitrina, en la memoria del servidor (simulado, hasta tener backend).
// Se borran al reiniciar el servidor. Viven en globalThis para que la acción de la vitrina y las páginas
// del panel vean el mismo almacén, y para que una recarga en caliente no lo vacíe.

/** `stock`: qué variantes del catálogo lleva el pedido (para descontar o reservar). */
type Creado = { pedido: Pedido; detalle: DetallePedido; stock: ItemStock[] };
type Almacen = { ultimo: number; creados: Creado[] };
const g = globalThis as typeof globalThis & { __tiendlyPedidos?: Almacen };
const almacen = (g.__tiendlyPedidos ??= { ultimo: 1047, creados: [] });

/** Siguiente número después de los simulados (#TL-1047). Se reserva al llegar al pago. */
export const siguienteNumero = () => `TL-${++almacen.ultimo}`;

/**
 * Hora del pedido en el reloj de la demo: el panel vive en AHORA (jueves 15, 6:30 p. m.), así que un
 * pedido nuevo se hizo "ahora". Así cuadran "Hoy" y la reserva de 24 h ("Vence en 24 h").
 */
export const horaDemo = () => new Date(AHORA).toISOString();

export function agregarPedido(c: Creado) {
  almacen.creados = [c, ...almacen.creados.filter((x) => x.pedido.id !== c.pedido.id)];
}

/** Reemplaza el estado de un pedido creado (acciones del panel). `null` si no es de la vitrina. */
export function actualizarPedido(pedido: Pedido, detalle: DetallePedido) {
  const c = almacen.creados.find((x) => x.pedido.id === pedido.id);
  if (!c) return null;
  Object.assign(c, { pedido, detalle });
  return c;
}

export const pedidosCreados = () => almacen.creados;
