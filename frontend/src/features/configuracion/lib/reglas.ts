import { formatoSoles } from "@/lib/formato";
import { NOMBRE_ZONA, type ConfigEntregas, type ConfigPagos, type IdZona } from "../types";

// Reglas de Configuración → Pagos y Entregas (decisiones 0007 y 0009). Funciones puras.

const monto = (s: string) => Number(s.replace(",", "."));
const vacio = (s: string) => s.trim() === "";

/** Métodos que ve el cliente al pagar (Figma: "Al pagar, tu cliente verá"). */
export function metodosVisibles(p: ConfigPagos) {
  const ahora = p.cobros.estado === "activo" ? [p.cobros.tarjeta && "Tarjeta", p.cobros.yape && "Yape"].filter(Boolean) as string[] : [];
  return { ahora, despues: p.whatsapp.activo ? ["Pedir por WhatsApp"] : [] };
}

/** Siempre tiene que quedar al menos un método de cobro activo (Figma E2). */
export const quedaAlgunMetodo = (p: ConfigPagos) => {
  const m = metodosVisibles(p);
  return m.ahora.length + m.despues.length > 0;
};

export type ErroresEntregas = Partial<Record<`costo-${IdZona}` | `plazo-${IdZona}` | "zonas" | "envioGratis" | "direccion" | "distrito" | "horario", string>>;
export type ResultadoEntregas = { errores: ErroresEntregas; regla?: boolean; resumen?: string };

/** Valida antes de guardar (Figma: errores al guardar y "al menos una activa"). Mensajes con punto final. */
export function validarEntregas({ delivery, recojo }: ConfigEntregas): ResultadoEntregas {
  if (!delivery.activo && !recojo.activo) return { errores: {}, regla: true };
  const e: ErroresEntregas = {};
  const faltas: string[] = [];
  if (delivery.activo) {
    const activas = delivery.zonas.filter((z) => z.activa);
    if (!activas.length) (e.zonas = "Elige al menos una zona."), faltas.push("una zona de delivery");
    for (const z of activas) {
      if (vacio(z.costo) || !(monto(z.costo) >= 0)) (e[`costo-${z.id}`] = `Escribe el costo de envío para ${NOMBRE_ZONA[z.id]}.`), faltas.push(`el costo de envío de ${NOMBRE_ZONA[z.id]}`);
      if (vacio(z.plazo)) (e[`plazo-${z.id}`] = "Escribe en cuánto tiempo llega."), faltas.push(`el plazo de ${NOMBRE_ZONA[z.id]}`);
    }
    if (delivery.envioGratis.activo && !(monto(delivery.envioGratis.desde) > 0)) (e.envioGratis = "Escribe el monto mínimo de compra."), faltas.push("el monto del envío gratis");
  }
  if (recojo.activo) {
    if (vacio(recojo.direccion)) (e.direccion = "Escribe la dirección donde tus clientes recogen sus pedidos."), faltas.push("la dirección de recojo");
    if (vacio(recojo.distrito)) (e.distrito = "Escribe el distrito."), faltas.push("el distrito de recojo");
    if (vacio(recojo.horario)) (e.horario = "Escribe tu horario de atención."), faltas.push("el horario de atención");
  }
  if (!faltas.length) return { errores: e };
  const lista = faltas.length === 1 ? faltas[0] : `${faltas.slice(0, -1).join(", ")} y ${faltas.at(-1)}`;
  return { errores: e, resumen: `Falta ${lista}.` };
}

const ENVIO: Record<IdZona, string> = { lima: "Delivery en Lima", callao: "Delivery en Callao", provincias: "Delivery a provincias" };

/** Lo que verá el cliente al comprar (Figma: "Al comprar, tu cliente verá"). */
export function vistaCliente({ delivery, recojo }: ConfigEntregas): string[] {
  const lineas: string[] = [];
  if (delivery.activo) {
    const completas = delivery.zonas.filter((x) => x.activa && !vacio(x.costo) && monto(x.costo) >= 0 && !vacio(x.plazo));
    for (const z of completas) lineas.push(`${ENVIO[z.id]} · ${formatoSoles(monto(z.costo))} · Llega en ${z.plazo}`);
    if (completas.length && delivery.envioGratis.activo && monto(delivery.envioGratis.desde) > 0) lineas.push(`Envío gratis en compras desde ${formatoSoles(monto(delivery.envioGratis.desde))}`);
  }
  if (recojo.activo) lineas.push(`Recojo en tienda · Gratis${recojo.distrito ? ` · ${recojo.distrito}` : ""}`);
  return lineas;
}
