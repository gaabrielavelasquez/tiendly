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
