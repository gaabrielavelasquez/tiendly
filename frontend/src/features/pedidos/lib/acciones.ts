"use server";

import { ApiError, apiJson, usingApi } from "@/lib/api-client";
import { asignarStock } from "@/features/productos/lib/inventario";
import type { DetallePedido, Pedido } from "../types";
import { mutarPanel } from "@/lib/sesion";
import { actualizarPedido } from "./almacen";
import { venceEl } from "./reglas";
import type { AccionPedido } from "./detalle";
import { pedidoConDetalle } from "./api";

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

const COMANDO: Record<AccionPedido, string> = {
  pagar: "pay",
  "desmarcar-pago": "unpay",
  enviar: "ship",
  recoger: "deliver",
  entregar: "deliver",
  "entregar-cobrar": "deliver", // contra entrega no nace de la API; se ignora si llegara
  cancelar: "cancel",
};

export type ResultadoPedido = { pedido: Pedido; detalle: DetallePedido } | { error: string };

/**
 * Con API, cada acción es un comando propio del backend: manda el id, la acción y la versión que
 * vio; el backend valida el estado y rechaza el comando que llegó tarde. Nunca manda montos ni estados.
 */
export async function comandoPedido(id: string, accion: AccionPedido, version: number): Promise<ResultadoPedido> {
  if (!usingApi()) throw new Error("Los comandos de pedidos requieren la API.");
  try {
    const { order } = await apiJson<{ order: Parameters<typeof pedidoConDetalle>[0] }>(`/api/business/orders/${encodeURIComponent(id)}/commands`, {
      method: "POST",
      body: JSON.stringify({ kind: COMANDO[accion], version }),
      headers: { "Content-Type": "application/json" },
    });
    return pedidoConDetalle(order);
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 409) return { error: "El pedido cambió mientras tanto. Recarga la página para ver cómo quedó." };
      if (error.status === 400 || error.status === 404) return { error: "Ese cambio ya no se puede aplicar. Recarga la página." };
    }
    throw error;
  }
}

/** Deshacer en la API: el backend invierte su último comando si sigue dentro de la ventana. */
export async function deshacerPedido(id: string): Promise<ResultadoPedido> {
  if (!usingApi()) throw new Error("Los comandos de pedidos requieren la API.");
  try {
    const { order } = await apiJson<{ order: Parameters<typeof pedidoConDetalle>[0] }>(`/api/business/orders/${encodeURIComponent(id)}/commands`, {
      method: "POST",
      body: JSON.stringify({ kind: "undo" }),
      headers: { "Content-Type": "application/json" },
    });
    return pedidoConDetalle(order);
  } catch (error) {
    if (error instanceof ApiError && (error.status === 409 || error.status === 400)) return { error: "El deshacer ya no alcanza este cambio. Recarga la página." };
    throw error;
  }
}
