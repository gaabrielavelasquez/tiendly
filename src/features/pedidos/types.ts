export type Escenario = "pedidos" | "vacio" | "error";

/** "whatsapp": pedido de la vitrina que se paga después, coordinando por chat (decisión 0007). */
export type MetodoPago = "yape" | "plin" | "tarjeta" | "transferencia" | "contra-entrega" | "whatsapp";

/** Pago. "pendiente" es una reserva de 24 h; si vence sin pago, el pedido se cancela solo (decisión 0010). */
export type EstadoPago = "pagado" | "pendiente" | "cancelado";

export type EstadoEntrega = "por-enviar" | "enviado" | "entregado";

export type Pedido = {
  id: string;
  /** Número visible, p. ej. "TL-1042" (decisión 0028). */
  numero: string;
  creadoEl: string;
  cliente: { nombre: string; celular: string };
  items: number;
  total: number;
  pago: { estado: EstadoPago; metodo: MetodoPago };
  /** "coordinar": la tienda aún no definió sus entregas; se acuerda con el cliente por WhatsApp. */
  entrega: { estado: EstadoEntrega; metodo: "delivery" | "recojo" | "coordinar"; distrito?: string };
};

export type Filtro = "todos" | "para-atender" | "por-cobrar" | "reservas" | "por-enviar";

/** Una línea del pedido: un producto en una variante, con su cantidad y precio unitario. */
export type ItemPedido = { producto: string; variante: string; cantidad: number; precio: number; foto?: string };

/** Lo que solo se ve en el detalle de un pedido. */
export type DetallePedido = {
  items: ItemPedido[];
  /** Costo de delivery; 0 en recojo o con envío gratis. */
  envio: number;
  /** Cupón usado en la vitrina (decisión 0008): se resta del subtotal. */
  cupon?: { codigo: string; descuento: number };
  email?: string;
  direccion?: string;
  referencia?: string;
  /** Momentos del historial (ISO). El de creación es `Pedido.creadoEl`. */
  pagadoEl?: string;
  /** Correcciones manuales del pago; se conservan aunque se vuelva a marcar como pagado. */
  pagosDesmarcados?: string[];
  enviadoEl?: string;
  entregadoEl?: string;
  canceladoEl?: string;
  /** Quién lo canceló: la tienda desde el panel o la reserva de 24 h que venció. */
  cancelacion?: "tienda" | "reserva-vencida";
  nota?: string;
};
