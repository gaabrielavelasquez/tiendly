// Cupones (módulo 3; decisión 0008).

export type TipoCupon = "porcentaje" | "monto" | "envio";

export type Cupon = {
  id: string;
  codigo: string;
  tipo: TipoCupon;
  /** % o S/ según el tipo; no aplica a envío gratis. */
  valor?: number;
  compraMinima?: number;
  /** Fechas ISO (día en Lima). */
  desde?: string;
  hasta?: string;
  limiteUsos?: number;
  usos: number;
  /** El interruptor de la tienda. Pausado = nadie puede usarlo. */
  activo: boolean;
};

export type EstadoCupon = "activo" | "programado" | "pausado" | "agotado" | "vencido";
export type Escenario = "cupones" | "vacio" | "limite" | "error";
