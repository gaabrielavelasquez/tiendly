import { formatoSoles, plural } from "@/lib/formato";
import type { DetallePedido, Pedido } from "../types";
import { totalDetalle, unidades } from "./detalle-mock";
import { fechaPedido } from "./format";
import { conReglas, METODO_PAGO, venceEl } from "./reglas";

// Reglas del detalle de un pedido. Funciones puras: qué acción sigue, qué pasa al aplicarla y el historial.

export type Accion = "pagar" | "enviar" | "recoger" | "entregar" | "entregar-cobrar";

const ETIQUETA: Record<Accion, string> = {
  pagar: "Marcar como pagado",
  enviar: "Marcar como enviado",
  recoger: "Marcar como recogido",
  entregar: "Marcar como entregado",
  "entregar-cobrar": "Marcar como entregado y cobrado",
};

/** La próxima acción lógica del pedido (el CTA). `null` si ya no hay nada que hacer. */
export function siguienteAccion(p: Pedido): { id: Accion; label: string } | null {
  const a = ((): Accion | null => {
    if (p.pago.estado === "cancelado" || p.entrega.estado === "entregado") return null;
    // Contra entrega ya enviado: se cobra al entregar, en un solo paso.
    if (p.pago.estado === "pendiente" && p.pago.metodo === "contra-entrega" && p.entrega.estado === "enviado") return "entregar-cobrar";
    if (p.pago.estado === "pendiente") return "pagar";
    if (p.entrega.estado === "por-enviar") return p.entrega.metodo === "recojo" ? "recoger" : "enviar";
    return "entregar";
  })();
  return a ? { id: a, label: ETIQUETA[a] } : null;
}

/** Se puede cancelar mientras no esté cancelado ni entregado. */
export const puedeCancelar = (p: Pedido) => p.pago.estado !== "cancelado" && p.entrega.estado !== "entregado";

/** Aplica una acción y registra su momento en el historial. */
export function aplicar(p: Pedido, d: DetallePedido, accion: Accion | "cancelar", ahora: string): [Pedido, DetallePedido] {
  switch (accion) {
    case "pagar":
      return [{ ...p, pago: { ...p.pago, estado: "pagado" } }, { ...d, pagadoEl: ahora }];
    case "enviar":
      return [{ ...p, entrega: { ...p.entrega, estado: "enviado" } }, { ...d, enviadoEl: ahora }];
    case "recoger":
    case "entregar":
      return [{ ...p, entrega: { ...p.entrega, estado: "entregado" } }, { ...d, entregadoEl: ahora }];
    case "entregar-cobrar":
      return [{ ...p, pago: { ...p.pago, estado: "pagado" }, entrega: { ...p.entrega, estado: "entregado" } }, { ...d, pagadoEl: ahora, entregadoEl: ahora }];
    case "cancelar":
      return [{ ...p, pago: { ...p.pago, estado: "cancelado" } }, { ...d, canceladoEl: ahora, cancelacion: "tienda" }];
  }
}

/** Estado inicial: aplica la auto-cancelación de reservas vencidas y fecha la cancelación. */
export function inicial(p: Pedido, d: DetallePedido, ahora: string): [Pedido, DetallePedido] {
  const conR = conReglas(p, ahora);
  if (conR.pago.estado === "cancelado" && !d.canceladoEl) return [conR, { ...d, canceladoEl: new Date(venceEl(p)).toISOString(), cancelacion: "reserva-vencida" }];
  return [conR, d];
}

/** "Hoy, 10:45 p. m." → "hoy a las 10:45 p. m." (la hora ya termina en punto: no se agrega otro). */
const aLasHora = (texto: string) => texto.charAt(0).toLowerCase() + texto.slice(1).replace(", ", " a las ");

export type Paso = { id: string; titulo: string; detalle?: string; cuando?: string; estado: "hecho" | "actual" | "pendiente" | "cancelado" };

/** Historial vertical: lo que ya pasó con su hora y lo que falta como marcador de posición. */
export function lineaDeTiempo(p: Pedido, d: DetallePedido, ahora: string): Paso[] {
  const cuando = (iso?: string) => (iso ? fechaPedido(iso, ahora) : undefined);
  const recibido: Paso = { id: "recibido", titulo: "Pedido recibido", detalle: `${plural(unidades(d), "producto", "productos")} · ${formatoSoles(totalDetalle(d))}.`, cuando: cuando(p.creadoEl), estado: "hecho" };
  if (p.pago.estado === "cancelado") {
    return [recibido, { id: "cancelado", titulo: "Pedido cancelado", detalle: d.cancelacion === "tienda" ? "Lo cancelaste desde el panel." : "La reserva de 24 h venció sin pago.", cuando: cuando(d.canceladoEl), estado: "cancelado" }];
  }
  const recojo = p.entrega.metodo === "recojo";
  const pagado = p.pago.estado === "pagado";
  const pago: Paso = pagado
    ? { id: "pago", titulo: `Pagado con ${METODO_PAGO[p.pago.metodo]}`, cuando: cuando(d.pagadoEl), estado: "hecho" }
    : p.pago.metodo === "contra-entrega"
      ? { id: "pago", titulo: "Pago contra entrega", detalle: "Se cobra al entregar.", estado: "pendiente" }
      : { id: "pago", titulo: "Esperando el pago", detalle: `La reserva vence ${aLasHora(cuando(new Date(venceEl(p)).toISOString())!)} Si no se paga, se cancela sola.`, estado: "actual" };
  const enviado = p.entrega.estado !== "por-enviar";
  const envio: Paso = { id: "envio", titulo: enviado ? `Enviado a ${p.entrega.distrito}` : "Envío", detalle: enviado ? undefined : `Delivery a ${p.entrega.distrito}.`, cuando: cuando(d.enviadoEl), estado: enviado ? "hecho" : pagado ? "actual" : "pendiente" };
  const entregado = p.entrega.estado === "entregado";
  const final: Paso = { id: "entrega", titulo: recojo ? (entregado ? "Recogido en tienda" : "Recojo en tienda") : entregado ? "Entregado" : "Entrega", cuando: cuando(d.entregadoEl), estado: entregado ? "hecho" : (recojo ? pagado : enviado) ? "actual" : "pendiente" };
  return recojo ? [recibido, pago, final] : [recibido, pago, envio, final];
}
