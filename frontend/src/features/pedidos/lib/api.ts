import type { OrderDetail, OrderView } from "@tiendly/contracts";
import type { DetallePedido, EstadoEntrega, EstadoPago, MetodoPago, Pedido } from "../types";

// Traducción del contrato de la API a lo que muestra Pedidos. Los pedidos vencidos siguen llegando
// "pendientes": la auto-cancelación se calcula al leer (conReglas), igual que en el almacén local.

const metodo: Record<OrderView["payment"]["method"], MetodoPago> = { card: "tarjeta", yape: "yape", whatsapp: "whatsapp" };
const pago: Record<OrderView["payment"]["status"], EstadoPago> = { pending: "pendiente", paid: "pagado", canceled: "cancelado" };
const entregaMetodo: Record<OrderView["delivery"]["method"], Pedido["entrega"]["metodo"]> = { delivery: "delivery", pickup: "recojo", coordinate: "coordinar" };
const entregaEstado: Record<OrderView["delivery"]["status"], EstadoEntrega> = { "to-ship": "por-enviar", shipped: "enviado", delivered: "entregado" };
const cancelacion: Record<NonNullable<OrderDetail["cancellation"]>, "tienda" | "reserva-vencida"> = { store: "tienda", "expired-reservation": "reserva-vencida" };

export function pedidoDe(o: OrderView): Pedido {
  return {
    id: o.id,
    numero: o.number,
    creadoEl: o.createdAt,
    version: o.version,
    cliente: { nombre: o.customer.name, celular: o.customer.phone },
    items: o.totals.units,
    total: o.totals.totalCents / 100,
    pago: { estado: pago[o.payment.status], metodo: metodo[o.payment.method] },
    entrega: { estado: entregaEstado[o.delivery.status], metodo: entregaMetodo[o.delivery.method], ...(o.delivery.district ? { distrito: o.delivery.district } : {}) },
  };
}

export function pedidoConDetalle(o: OrderDetail): { pedido: Pedido; detalle: DetallePedido } {
  return {
    pedido: pedidoDe(o),
    detalle: {
      items: o.items.map((i) => ({ producto: i.name, variante: i.variantText, cantidad: i.quantity, precio: i.unitPriceCents / 100, ...(i.photoUrl ? { foto: i.photoUrl } : {}) })),
      envio: (o.totals.shippingCents ?? 0) / 100,
      direccion: o.address ?? undefined,
      referencia: o.reference ?? undefined,
      ...(o.paidAt ? { pagadoEl: o.paidAt } : {}),
      ...(o.unmarkedPayments.length ? { pagosDesmarcados: o.unmarkedPayments } : {}),
      ...(o.shippedAt ? { enviadoEl: o.shippedAt } : {}),
      ...(o.deliveredAt ? { entregadoEl: o.deliveredAt } : {}),
      ...(o.canceledAt ? { canceladoEl: o.canceledAt, ...(o.cancellation ? { cancelacion: cancelacion[o.cancellation] } : {}) } : {}),
    },
  };
}
