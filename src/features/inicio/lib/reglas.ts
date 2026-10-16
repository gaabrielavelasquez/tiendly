import type { InicioData, Paso } from "../types";
import { fechaCorta, hora } from "./format";

// Reglas de negocio de Inicio (decisión 0012). Funciones puras: fáciles de probar y de mover al backend.

/** "Hoy" solo cuenta pedidos pagados. */
export function resumenHoy(d: InicioData) {
  const pagados = d.pedidosHoy.filter((p) => p.pagado);
  return { ventas: pagados.reduce((s, p) => s + p.monto, 0), pedidos: pagados.length };
}

export type Pendiente = {
  id: "por-enviar" | "reservas" | "agotados";
  tono: "info" | "warning" | "error";
  titulo: string;
  detalle: string;
  href: string;
  /** Dato urgente que va en un badge (p. ej. la hora en que vence la primera reserva). */
  etiqueta?: string;
};

const plural = (n: number, uno: string, varios: string) => `${n} ${n === 1 ? uno : varios}`;

function detalleEntregas(delivery: number, recojo: number) {
  if (delivery && recojo) return `${delivery} delivery y ${recojo} recojo.`;
  return delivery ? "Por delivery." : "Para recojo en tienda.";
}

/** Filas de "Para atender hoy". Solo entran las que tienen algo pendiente. */
export function pendientes(d: InicioData): Pendiente[] {
  const porEnviar = d.pedidosHoy.filter((p) => p.pagado && !p.enviado);
  const hoy = fechaCorta(d.ahora);
  const ahora = new Date(d.ahora).getTime();
  const reservas = d.reservas.filter((r) => fechaCorta(r.venceEl) === hoy && new Date(r.venceEl).getTime() > ahora);
  const agotados = d.productos.filter((p) => p.stock === 0);
  const filas: Pendiente[] = [];

  if (porEnviar.length) {
    const delivery = porEnviar.filter((p) => p.entrega === "delivery").length;
    filas.push({
      id: "por-enviar",
      tono: "info",
      titulo: plural(porEnviar.length, "pedido por enviar", "pedidos por enviar"),
      detalle: detalleEntregas(delivery, porEnviar.length - delivery),
      href: "/panel/pedidos?estado=por-enviar",
    });
  }
  if (reservas.length) {
    const primera = reservas.map((r) => r.venceEl).sort()[0];
    filas.push({
      id: "reservas",
      tono: "warning",
      titulo: plural(reservas.length, "reserva vence hoy", "reservas vencen hoy"),
      detalle: "Revisa si ya te pagaron por Yape.",
      href: "/panel/pedidos?estado=reservas",
      etiqueta: `Vence ${hora(primera)}`,
    });
  }
  if (agotados.length) {
    const [primero, ...resto] = agotados;
    filas.push({
      id: "agotados",
      tono: "error",
      titulo: plural(agotados.length, "producto agotado", "productos agotados"),
      detalle: resto.length ? `${primero.nombre} y ${resto.length} más.` : `${primero.nombre} · 0 en stock.`,
      href: "/panel/productos?estado=agotados",
    });
  }
  return filas;
}

export type Comparacion = { direccion: "sube" | "baja" | "igual"; texto: string } | null;

/** Comparación con la semana pasada (la UI suma el ícono de tendencia: nunca solo color). Sin base, no se muestra. */
export function compararSemana(total: number, pasada: number): Comparacion {
  if (pasada <= 0) return null;
  const pct = Math.round(((total - pasada) / pasada) * 100);
  if (pct === 0) return { direccion: "igual", texto: "Igual que la semana pasada" };
  return pct > 0
    ? { direccion: "sube", texto: `${pct} % más que la semana pasada` }
    : { direccion: "baja", texto: `${Math.abs(pct)} % menos que la semana pasada` };
}

export function totalSemana(d: InicioData) {
  return d.semana.reduce((acc, dia) => ({ monto: acc.monto + (dia.monto ?? 0), pedidos: acc.pedidos + dia.pedidos }), {
    monto: 0,
    pedidos: 0,
  });
}

const MENSAJES = ["Empieza por el primero.", "¡Buen comienzo!", "Vas por la mitad.", "Te falta uno.", "¡Tu tienda está lista!"];

export function progresoPasos(pasos: Paso[]) {
  const hechos = pasos.filter((p) => p.hecho).length;
  return { hechos, total: pasos.length, mensaje: MENSAJES[hechos] ?? "", siguiente: pasos.find((p) => !p.hecho)?.id };
}

/** Mientras falte algún paso, Inicio muestra "Pasos para arrancar". Con los 4, la vista con actividad. */
export const esTiendaNueva = (d: InicioData) => d.pasos.some((p) => !p.hecho);
