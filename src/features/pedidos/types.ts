export type Escenario = "pedidos" | "vacio" | "error";

export type MetodoPago = "yape" | "plin" | "tarjeta" | "transferencia" | "contra-entrega";

/** Pago. "pendiente" es una reserva de 24 h; si vence sin pago, el pedido se cancela solo (decisión 0010). */
export type EstadoPago = "pagado" | "pendiente" | "cancelado";

export type EstadoEntrega = "por-enviar" | "enviado" | "entregado";

export type Pedido = {
  id: string;
  /** Número visible, p. ej. "T-1042". */
  numero: string;
  creadoEl: string;
  cliente: { nombre: string; celular: string };
  items: number;
  total: number;
  pago: { estado: EstadoPago; metodo: MetodoPago };
  entrega: { estado: EstadoEntrega; metodo: "delivery" | "recojo"; distrito?: string };
};

export type Filtro = "todos" | "para-atender" | "por-cobrar" | "reservas" | "por-enviar";

/** Una línea del pedido: un producto en una variante, con su cantidad y precio unitario. */
export type ItemPedido = { producto: string; variante: string; cantidad: number; precio: number; foto?: string };

/** Lo que solo se ve en el detalle de un pedido. */
export type DetallePedido = {
  items: ItemPedido[];
  /** Costo de delivery; 0 en recojo. */
  envio: number;
  email?: string;
  direccion?: string;
  referencia?: string;
  /** Momentos del historial (ISO). El de creación es `Pedido.creadoEl`. */
  pagadoEl?: string;
  enviadoEl?: string;
  entregadoEl?: string;
  canceladoEl?: string;
  /** Quién lo canceló: la tienda desde el panel o la reserva de 24 h que venció. */
  cancelacion?: "tienda" | "reserva-vencida";
  nota?: string;
};
