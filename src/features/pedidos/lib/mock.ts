import type { DetallePedido, Escenario, Pedido } from "../types";
import { esHeather } from "@/lib/datos/semillas";
import { datosTienda } from "@/lib/datos/tienda";
import { ahoraIso, alPresente } from "@/lib/reloj";
import { DETALLES, unidades } from "./detalle-mock";

// Pedidos simulados de una tienda que vende por WhatsApp (Heather), hasta tener backend.
// Coinciden con Inicio: hoy hay 3 por enviar (2 delivery y 1 recojo) y 2 reservas que vencen esta noche.

// Las fechas están escritas alrededor del jueves 15-oct-2026, 6:30 p. m.; al leerlas se corren al presente
// (lib/reloj · alPresente), así la demo siempre está "hoy".

type Base = Omit<Pedido, "id" | "numero">;
const p = (n: number, datos: Base): Pedido => ({ id: `tl-${n}`, numero: `TL-${n}`, ...datos });

const PEDIDOS: Pedido[] = [
  // Hoy
  p(1047, { creadoEl: "2026-10-15T17:52:00-05:00", cliente: { nombre: "Valeria Quispe", celular: "987654321" }, items: 2, total: 712,
    pago: { estado: "pagado", metodo: "yape" }, entrega: { estado: "por-enviar", metodo: "delivery", distrito: "Miraflores" } }),
  p(1046, { creadoEl: "2026-10-15T16:05:00-05:00", cliente: { nombre: "Camila Torres", celular: "912345678" }, items: 1, total: 382,
    pago: { estado: "pagado", metodo: "tarjeta" }, entrega: { estado: "por-enviar", metodo: "delivery", distrito: "San Isidro" } }),
  p(1045, { creadoEl: "2026-10-15T14:40:00-05:00", cliente: { nombre: "Andrea Salazar", celular: "945112233" }, items: 2, total: 330,
    pago: { estado: "pagado", metodo: "plin" }, entrega: { estado: "por-enviar", metodo: "recojo" } }),
  p(1044, { creadoEl: "2026-10-15T11:20:00-05:00", cliente: { nombre: "Lucía Fernández", celular: "998877665" }, items: 1, total: 392,
    pago: { estado: "pagado", metodo: "yape" }, entrega: { estado: "enviado", metodo: "delivery", distrito: "Surco" } }),
  // Ayer
  p(1043, { creadoEl: "2026-10-14T22:45:00-05:00", cliente: { nombre: "Daniela Ruiz", celular: "934567812" }, items: 1, total: 422,
    pago: { estado: "pendiente", metodo: "yape" }, entrega: { estado: "por-enviar", metodo: "delivery", distrito: "Barranco" } }),
  p(1042, { creadoEl: "2026-10-14T20:10:00-05:00", cliente: { nombre: "Mariana Paredes", celular: "976543210" }, items: 3, total: 890,
    pago: { estado: "pendiente", metodo: "transferencia" }, entrega: { estado: "por-enviar", metodo: "delivery", distrito: "La Molina" } }),
  p(1041, { creadoEl: "2026-10-14T18:30:00-05:00", cliente: { nombre: "Sofía Medina", celular: "923456789" }, items: 1, total: 342,
    pago: { estado: "pendiente", metodo: "contra-entrega" }, entrega: { estado: "enviado", metodo: "delivery", distrito: "Jesús María" } }),
  p(1040, { creadoEl: "2026-10-14T15:45:00-05:00", cliente: { nombre: "Fernanda López", celular: "956781234" }, items: 2, total: 380,
    pago: { estado: "pagado", metodo: "yape" }, entrega: { estado: "entregado", metodo: "delivery", distrito: "Lince" } }),
  p(1039, { creadoEl: "2026-10-14T10:05:00-05:00", cliente: { nombre: "Gabriela Ríos", celular: "981234567" }, items: 1, total: 340,
    pago: { estado: "pagado", metodo: "plin" }, entrega: { estado: "entregado", metodo: "recojo" } }),
  // Esta semana
  p(1038, { creadoEl: "2026-10-13T21:30:00-05:00", cliente: { nombre: "Paola Castillo", celular: "965432187" }, items: 1, total: 482,
    pago: { estado: "pendiente", metodo: "yape" }, entrega: { estado: "por-enviar", metodo: "delivery", distrito: "Pueblo Libre" } }), // reserva vencida
  p(1037, { creadoEl: "2026-10-13T12:10:00-05:00", cliente: { nombre: "Renata Vargas", celular: "947258369" }, items: 4, total: 750,
    pago: { estado: "pagado", metodo: "tarjeta" }, entrega: { estado: "entregado", metodo: "delivery", distrito: "San Borja" } }),
  p(1036, { creadoEl: "2026-10-12T19:25:00-05:00", cliente: { nombre: "Isabella Chávez", celular: "938271645" }, items: 1, total: 370,
    pago: { estado: "pagado", metodo: "yape" }, entrega: { estado: "entregado", metodo: "recojo" } }),
  p(1035, { creadoEl: "2026-10-12T09:40:00-05:00", cliente: { nombre: "Ximena Rojas", celular: "974185296" }, items: 2, total: 530,
    pago: { estado: "pagado", metodo: "transferencia" }, entrega: { estado: "entregado", metodo: "delivery", distrito: "Magdalena" } }),
];

export function leerEscenario(valor: string | string[] | undefined): Escenario {
  const v = Array.isArray(valor) ? valor[0] : valor;
  return v === "vacio" || v === "error" ? v : "pedidos";
}

/** Los pedidos de la lista. Los de la vitrina van primero: son los más nuevos. */
export async function obtenerPedidos(escenario: Escenario, slug: string, ahora = ahoraIso()): Promise<Pedido[]> {
  if (escenario === "error") throw new Error("No se pudo cargar Pedidos (simulado).");
  if (escenario === "vacio") return [];
  const d = await datosTienda(slug);
  return [...(d?.pedidos.creados ?? []).map((c) => c.pedido), ...demo(slug, ahora).map(conUnidades)];
}

/** Los pedidos simulados (#TL-1035 a #TL-1047) son de Heather, corridos al presente; las demás tiendas solo tienen los de su vitrina. */
const demo = (slug: string, ahora: string) => (esHeather(slug) ? PEDIDOS.map((p) => ({ ...p, creadoEl: alPresente(p.creadoEl, ahora) })) : []);

/** El historial del detalle de la demo, corrido al presente como su pedido. */
function detalleAlPresente(d: DetallePedido, ahora: string): DetallePedido {
  const mover = (v?: string) => (v ? alPresente(v, ahora) : v);
  return { ...d, pagadoEl: mover(d.pagadoEl), enviadoEl: mover(d.enviadoEl), entregadoEl: mover(d.entregadoEl), canceladoEl: mover(d.canceladoEl) };
}

/** La cantidad de productos de la lista sale del detalle, así no se desalinean. */
const conUnidades = (p: Pedido): Pedido => (DETALLES[p.id] ? { ...p, items: unidades(DETALLES[p.id]) } : p);

/** Un pedido con su detalle (para /panel/pedidos/[id]). `null` si no existe. */
export async function obtenerPedido(slug: string, id: string, ahora = ahoraIso()): Promise<{ pedido: Pedido; detalle: DetallePedido } | null> {
  const creado = (await datosTienda(slug))?.pedidos.creados.find((c) => c.pedido.id === id);
  if (creado) return { pedido: creado.pedido, detalle: creado.detalle };
  const pedido = demo(slug, ahora).find((p) => p.id === id);
  const detalle = DETALLES[id];
  return pedido && detalle ? { pedido: conUnidades(pedido), detalle: detalleAlPresente(detalle, ahora) } : null;
}
