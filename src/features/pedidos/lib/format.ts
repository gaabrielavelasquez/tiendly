import { conArticulo } from "@/lib/formato";
import type { Pedido } from "../types";
import { BADGE_PAGO, badgeEntrega, METODO_PAGO, venceEl } from "./reglas";
import { enLima } from "./tiempo";

// Fechas de pedidos sin Intl (ver lib/tiempo.ts): el mismo texto en servidor y navegador.
const ZONA = "America/Lima";
const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

/** "5:52 p. m." */
function hora(h: number, min: number) {
  return `${h % 12 || 12}:${String(min).padStart(2, "0")} ${h < 12 ? "a. m." : "p. m."}`;
}

/** Hora de Lima con artículo: "las 5:52 p. m." o "la 1:11 p. m.". */
export function horaConArticulo(iso: string) {
  const f = enLima(Date.parse(iso));
  return conArticulo(hora(f.h, f.min));
}

/** "Hoy, 5:52 p. m.", "Ayer, 10:45 p. m." o "13 oct, 9:30 p. m.". */
export function fechaPedido(iso: string, ahora: string) {
  const p = enLima(new Date(iso).getTime());
  const base = new Date(ahora).getTime();
  const cuando = p.dia === enLima(base).dia ? "Hoy" : p.dia === enLima(base - 86400000).dia ? "Ayer" : `${p.fecha} ${MESES[p.mes]}`;
  return `${cuando}, ${hora(p.h, p.min)}`;
}

/** Plazo de la reserva en Lima, igual que Inicio, con la 1 en singular. La lista conserva su formato corto. */
export function plazoReserva(p: Pedido, ahora: string): string | null {
  const fin = venceEl(p);
  const base = new Date(ahora).getTime();
  if (p.pago.estado !== "pendiente" || p.pago.metodo === "contra-entrega" || fin <= base) return null;
  const f = enLima(fin);
  const dia = f.dia === enLima(base).dia ? "hoy" : f.dia === enLima(base + 86400000).dia ? "mañana" : `el ${f.fecha} ${MESES[f.mes]}`;
  return `Vence ${dia}, a ${conArticulo(hora(f.h, f.min))}`;
}

const celda = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;

/** CSV de los pedidos visibles (abre bien en Excel y Google Sheets: separador coma y BOM UTF-8). */
export function aCsv(pedidos: Pedido[]) {
  const cabecera = ["Pedido", "Fecha", "Cliente", "Celular", "Productos", "Total (S/)", "Pago", "Método", "Entrega", "Tipo", "Distrito"];
  const filas = pedidos.map((p) => [
    `#${p.numero}`,
    new Date(p.creadoEl).toLocaleString("es-PE", { timeZone: ZONA }),
    p.cliente.nombre,
    `+51 ${p.cliente.celular}`,
    p.items,
    String(Math.round((p.total + Number.EPSILON) * 100) / 100),
    BADGE_PAGO[p.pago.estado].texto,
    METODO_PAGO[p.pago.metodo],
    badgeEntrega(p.entrega.estado, p.entrega.metodo).texto,
    p.entrega.metodo === "recojo" ? "Recojo" : p.entrega.metodo === "coordinar" ? "Por coordinar" : "Delivery",
    p.entrega.distrito ?? "",
  ]);
  return "﻿" + [cabecera, ...filas].map((f) => f.map(celda).join(",")).join("\r\n");
}

export type GrupoDia = "Hoy" | "Ayer" | "Esta semana" | "Antes";

/** Grupo de la lista móvil según el día en Lima: Hoy, Ayer, Esta semana (últimos 7 días) o Antes. */
export function grupoDia(iso: string, ahora: string): GrupoDia {
  const base = new Date(ahora).getTime();
  const dia = enLima(new Date(iso).getTime()).dia;
  if (dia === enLima(base).dia) return "Hoy";
  if (dia === enLima(base - 86400000).dia) return "Ayer";
  return base - new Date(iso).getTime() < 7 * 86400000 ? "Esta semana" : "Antes";
}
