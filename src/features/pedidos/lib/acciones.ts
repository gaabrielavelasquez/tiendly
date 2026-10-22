"use server";

import { asignarStock } from "@/features/productos/lib/inventario";
import type { DetallePedido, Pedido } from "../types";
import { mutarPanel } from "@/lib/sesion";
import { actualizarPedido } from "./almacen";
import { venceEl } from "./reglas";

/**
 * Guarda una acción del panel sobre un pedido de la vitrina y ajusta su stock (decisiones 0010 y 0028):
 * pagado → vendido; pendiente → reservado hasta que vence la reserva; cancelado → se libera.
 * También sirve para "Deshacer": se manda el estado anterior. Los pedidos de la demo no se tocan.
 */
export async function sincronizarPedido(pedido: Pedido, detalle: DetallePedido) {
  await mutarPanel((d) => {
    const c = actualizarPedido(d.pedidos, pedido, detalle);
    if (!c) return;
    const { estado } = pedido.pago;
    if (estado === "cancelado") asignarStock(d.inventario, pedido.id, null);
    else if (estado === "pagado") asignarStock(d.inventario, pedido.id, { tipo: "vendido", items: c.stock });
    else asignarStock(d.inventario, pedido.id, { tipo: "reservado", items: c.stock, hasta: new Date(venceEl(pedido)).toISOString() });
  });
}
