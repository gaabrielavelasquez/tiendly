export type Escenario = "actividad" | "al-dia" | "nueva" | "error";

/** `link`: URL pública de la vitrina (la pone la página, ver lib/link-tienda). */
export type Tienda = { nombre: string; slug: string; duena: string; link: string };

export type PedidoHoy = {
  monto: number;
  pagado: boolean;
  entrega: "delivery" | "recojo";
  enviado: boolean;
};

/** Reserva de pago: se auto-cancela a las 24 h (decisión 0010). */
export type Reserva = { venceEl: string };

export type Producto = { nombre: string; stock: number };

/** Un día de la semana (lunes a domingo). Los días que aún no llegan van en `null`. */
export type DiaVentas = { fecha: string; monto: number | null; pedidos: number };

export type PasoId = "producto" | "pagos" | "entregas" | "compartir";

export type Paso = {
  id: PasoId;
  titulo: string;
  /** Termina con punto. */
  descripcion: string;
  hecho: boolean;
  href: string;
};

export type InicioData = {
  tienda: Tienda;
  /** Momento del corte, con zona horaria de Lima. */
  ahora: string;
  pedidosHoy: PedidoHoy[];
  reservas: Reserva[];
  productos: Producto[];
  semana: DiaVentas[];
  /** Total de la semana pasada hasta el mismo día, para comparar parejo. */
  semanaPasadaTotal: number;
  pasos: Paso[];
};
