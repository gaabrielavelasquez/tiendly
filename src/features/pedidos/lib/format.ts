import type { Pedido } from "../types";
import { BADGE_PAGO, badgeEntrega, METODO_PAGO } from "./reglas";

// Fechas de pedidos sin Intl: el texto se arma igual en el servidor (Node) y en el navegador, así no hay
// diferencias de hidratación (Intl puede variar entre motores, p. ej. el espacio antes de "p. m.").
// Lima está siempre en UTC−5 (sin horario de verano).
const ZONA = "America/Lima";
const OFFSET_LIMA_MIN = -5 * 60;
const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

function enLima(ms: number) {
  const d = new Date(ms + OFFSET_LIMA_MIN * 60000);
  return { dia: `${d.getUTCFullYear()}-${d.getUTCMonth()}-${d.getUTCDate()}`, mes: d.getUTCMonth(), fecha: d.getUTCDate(), h: d.getUTCHours(), min: d.getUTCMinutes() };
}

/** "5:52 p. m." */
function hora(h: number, min: number) {
  return `${h % 12 || 12}:${String(min).padStart(2, "0")} ${h < 12 ? "a. m." : "p. m."}`;
}

/** "Hoy, 5:52 p. m.", "Ayer, 10:45 p. m." o "13 oct, 9:30 p. m.". */
export function fechaPedido(iso: string, ahora: string) {
  const p = enLima(new Date(iso).getTime());
  const base = new Date(ahora).getTime();
  const cuando = p.dia === enLima(base).dia ? "Hoy" : p.dia === enLima(base - 86400000).dia ? "Ayer" : `${p.fecha} ${MESES[p.mes]}`;
  return `${cuando}, ${hora(p.h, p.min)}`;
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
    p.total.toFixed(2),
    BADGE_PAGO[p.pago.estado].texto,
    METODO_PAGO[p.pago.metodo],
    badgeEntrega(p.entrega.estado, p.entrega.metodo).texto,
    p.entrega.metodo === "recojo" ? "Recojo" : "Delivery",
    p.entrega.distrito ?? "",
  ]);
  return "﻿" + [cabecera, ...filas].map((f) => f.map(celda).join(",")).join("\r\n");
}
