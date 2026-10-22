import type { EstadoEntrega, EstadoPago, Filtro, MetodoPago, Pedido } from "../types";
import { mismoDiaLima } from "./tiempo";

// Reglas de pedidos. Funciones puras: fáciles de probar y de mover al backend.

const HORA = 60 * 60 * 1000;
/** Reserva de pago: 24 h para pagar; si no, se auto-cancela (decisión 0010). */
export const RESERVA_HORAS = 24;

/** Contra entrega no es una reserva: se cobra al entregar, así que no vence. */
const esReserva = (p: Pedido) => p.pago.estado === "pendiente" && p.pago.metodo !== "contra-entrega";

export const venceEl = (p: Pedido) => new Date(p.creadoEl).getTime() + RESERVA_HORAS * HORA;

/** Aplica la auto-cancelación: una reserva vencida se ve como cancelada. */
export function conReglas(p: Pedido, ahora: string): Pedido {
  if (esReserva(p) && venceEl(p) <= new Date(ahora).getTime()) {
    return { ...p, pago: { ...p.pago, estado: "cancelado" } };
  }
  return p;
}

/** "Vence en 1 h 40 min" para reservas vigentes; null en otro caso. */
export function tiempoRestante(p: Pedido, ahora: string) {
  if (!esReserva(p)) return null;
  const min = Math.max(0, Math.round((venceEl(p) - new Date(ahora).getTime()) / 60000));
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `Vence en ${h ? `${h} h${m ? ` ${m} min` : ""}` : `${m} min`}`;
}

const activo = (p: Pedido) => p.pago.estado !== "cancelado";
const porCobrar = (p: Pedido) => activo(p) && p.pago.estado === "pendiente";
const porEnviar = (p: Pedido) => p.pago.estado === "pagado" && p.entrega.estado === "por-enviar";

/**
 * Reservas que vencen hoy: reservas de 24 h vigentes cuyo vencimiento cae hoy en Lima.
 * Es la misma definición que usa Inicio ("2 reservas vencen hoy"), así el número coincide.
 * No incluye contra entrega (no vence) ni reservas ya vencidas (se cancelaron solas).
 */
export const venceHoy = (p: Pedido, ahora: string) => {
  const t = new Date(ahora).getTime();
  return esReserva(p) && venceEl(p) > t && mismoDiaLima(venceEl(p), t);
};

/** Reglas de cada filtro. "reservas" depende de la hora, por eso todas reciben `ahora`. */
const CUMPLE: Record<Filtro, (p: Pedido, ahora: string) => boolean> = {
  todos: () => true,
  /** Todo lo que pide una acción de la tienda: cobrar o enviar. */
  "para-atender": (p) => porCobrar(p) || porEnviar(p),
  "por-cobrar": porCobrar,
  reservas: venceHoy,
  "por-enviar": porEnviar,
};

export function contarPorFiltro(lista: Pedido[], ahora: string): Record<Filtro, number> {
  const contar = (f: Filtro) => lista.filter((p) => CUMPLE[f](p, ahora)).length;
  return { todos: lista.length, "para-atender": contar("para-atender"), "por-cobrar": contar("por-cobrar"), reservas: contar("reservas"), "por-enviar": contar("por-enviar") };
}

const normalizar = (s: string) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().replace(/[\s#-]/g, "");

/** Busca por número de pedido (con o sin "#T-"), nombre del cliente o celular. */
export function filtrarPedidos(lista: Pedido[], filtro: Filtro, busqueda: string, ahora: string) {
  const q = normalizar(busqueda);
  return lista.filter(
    (p) =>
      CUMPLE[filtro](p, ahora) &&
      (!q || normalizar(p.numero).includes(q) || normalizar(p.cliente.nombre).includes(q) || p.cliente.celular.includes(q)),
  );
}

export function leerFiltro(v: string | null | undefined): Filtro {
  return v === "para-atender" || v === "por-cobrar" || v === "reservas" || v === "por-enviar" ? v : "todos";
}

export const METODO_PAGO: Record<MetodoPago, string> = {
  yape: "Yape",
  plin: "Plin",
  tarjeta: "Tarjeta",
  transferencia: "Transferencia",
  "contra-entrega": "Contra entrega",
};

type Tono = "success" | "warning" | "neutral";

/** Badge de pago: pagado en verde, pendiente en ámbar (feedback/warning), cancelado en neutro. */
export const BADGE_PAGO: Record<EstadoPago, { tono: Tono; texto: string }> = {
  pagado: { tono: "success", texto: "Pagado" },
  pendiente: { tono: "warning", texto: "Pendiente" },
  cancelado: { tono: "neutral", texto: "Cancelado" },
};

/** Badge de entrega. "Por enviar" cambia a "Por recoger" si es recojo en tienda. */
export function badgeEntrega(estado: EstadoEntrega, metodo: "delivery" | "recojo"): { tono: Tono; texto: string } {
  if (estado === "por-enviar") return { tono: "warning", texto: metodo === "recojo" ? "Por recoger" : "Por enviar" };
  if (estado === "enviado") return { tono: "neutral", texto: "Enviado" };
  return { tono: "success", texto: metodo === "recojo" ? "Recogido" : "Entregado" };
}

/** "Nombre Apellido" → "NA". */
export const iniciales = (nombre: string) =>
  nombre.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]!.toUpperCase()).join("");

/** "987 654 321". */
export const celularVisible = (c: string) => c.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3");

/** Mensaje de WhatsApp listo para escribirle al cliente por su pedido. */
export function whatsappCliente(p: Pedido) {
  const nombre = p.cliente.nombre.split(" ")[0];
  const texto = `¡Hola, ${nombre}! Te escribo por tu pedido #${p.numero}.`;
  return `https://wa.me/51${p.cliente.celular}?text=${encodeURIComponent(texto)}`;
}
