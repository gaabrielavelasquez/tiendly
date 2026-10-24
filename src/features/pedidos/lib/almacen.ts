import type { ItemStock } from "@/features/productos/lib/inventario";
import type { DetallePedido, Pedido } from "../types";
import { ahoraIso } from "@/lib/reloj";

// Pedidos creados desde la vitrina, guardados con los datos de cada tienda (lib/datos/tienda) hasta tener
// backend. Funciones puras sobre ese almacén: quien las llama lee y guarda los datos.

/** `stock`: qué variantes del catálogo lleva el pedido (para descontar o reservar). */
export type Creado = { pedido: Pedido; detalle: DetallePedido; stock: ItemStock[] };
export type AlmacenPedidos = { ultimo: number; creados: Creado[] };

/** Siguiente número (#TL-1001 en una tienda nueva). Se reserva al llegar al pago. */
export const siguienteNumero = (a: AlmacenPedidos) => `TL-${++a.ultimo}`;

/** Hora real del pedido nuevo: cuenta en "Hoy" y su reserva vence en 24 h. */
export const horaPedido = () => ahoraIso();

export function agregarPedido(a: AlmacenPedidos, c: Creado) {
  a.creados = [c, ...a.creados.filter((x) => x.pedido.id !== c.pedido.id)];
}

/** Reemplaza el estado de un pedido creado (acciones del panel). `null` si no es de la vitrina. */
export function actualizarPedido(a: AlmacenPedidos, pedido: Pedido, detalle: DetallePedido) {
  const c = a.creados.find((x) => x.pedido.id === pedido.id);
  if (!c || (c.pedido.pago.estado === "cancelado" && pedido.pago.estado !== "cancelado")) return null;
  Object.assign(c, { pedido, detalle });
  return c;
}
