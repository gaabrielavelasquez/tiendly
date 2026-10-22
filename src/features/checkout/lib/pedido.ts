import { enLima } from "@/features/pedidos/lib/tiempo";
import type { PedidoCreado } from "../types";
import { HORAS_RESERVA } from "./config";

// Copia del pedido en este navegador para la confirmación (con fotos y plazos). El pedido "oficial"
// lo crea registrarPedido en el almacén del panel (lib/acciones.ts).

const clave = (slug: string) => `tiendly:pedidos:${slug}`;
export function guardarPedido(slug: string, pedido: PedidoCreado) {
  try {
    const todos = JSON.parse(localStorage.getItem(clave(slug)) ?? "{}");
    localStorage.setItem(clave(slug), JSON.stringify({ ...todos, [pedido.numero]: pedido }));
  } catch {}
}

export function leerPedido(slug: string, numero: string): PedidoCreado | null {
  try {
    return JSON.parse(localStorage.getItem(clave(slug)) ?? "{}")[numero] ?? null;
  } catch {
    return null;
  }
}

/** Hasta cuándo se separan los productos de un pedido por WhatsApp (decisión 0010). */
export const reservaHasta = (creadoEl: string) => new Date(new Date(creadoEl).getTime() + HORAS_RESERVA * 3600000).toISOString();

const hora = (h: number, min: number) => `${h % 12 || 12}:${String(min).padStart(2, "0")} ${h < 12 ? "a. m." : "p. m."}`;

/** "mañana a las 9:41 a. m." (hora de Lima, sin Intl). Ya termina en punto: no sumarle otro. */
export function textoReserva(hasta: string, desde: string) {
  const h = enLima(new Date(hasta).getTime());
  const d = enLima(new Date(desde).getTime());
  const cuando = h.dia === d.dia ? "hoy" : "mañana";
  return `${cuando} a las ${hora(h.h, h.min)}`;
}
