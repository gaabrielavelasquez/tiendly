import type { Producto } from "../types";

// Inventario simulado (decisiones 0010 y 0028), en la memoria del servidor hasta tener backend.
// Cada pedido de la vitrina tiene una "asignación" de stock según su estado:
//   pagado → vendido (baja para siempre) · pendiente por WhatsApp → reservado hasta `hasta` · cancelado → nada.
// El disponible es el stock base menos lo vendido y lo reservado vigente: una reserva vencida se libera sola.

export type ItemStock = { id: string; color: string; talla: string; cantidad: number };
type Asignacion = { tipo: "vendido" | "reservado"; items: ItemStock[]; hasta?: string };

const g = globalThis as typeof globalThis & { __tiendlyInventario?: Record<string, Asignacion> };
const asignaciones = (g.__tiendlyInventario ??= {});

const clave = (id: string, color: string, talla: string) => `${id}|${color}|${talla}`;

/** Fija lo que un pedido consume. `null` (cancelado) lo libera. */
export function asignarStock(pedidoId: string, a: Asignacion | null) {
  if (a) asignaciones[pedidoId] = a;
  else delete asignaciones[pedidoId];
}

/** El pedido ya consume stock (para pasar de reservado a vendido sin volver a pedirlo). */
export const asignacionDe = (pedidoId: string) => asignaciones[pedidoId] ?? null;

/** Unidades tomadas por variante en este momento (vendidas + reservas vigentes). */
function tomadas(ahora: number) {
  const t: Record<string, number> = {};
  for (const a of Object.values(asignaciones)) {
    if (a.tipo === "reservado" && a.hasta && new Date(a.hasta).getTime() <= ahora) continue; // venció: se liberó
    for (const i of a.items) t[clave(i.id, i.color, i.talla)] = (t[clave(i.id, i.color, i.talla)] ?? 0) + i.cantidad;
  }
  return t;
}

/** El catálogo con el stock disponible (nunca negativo). Una talla en 0 se ve agotada en la vitrina. */
export function conDisponible(productos: Producto[], ahora: string): Producto[] {
  const t = tomadas(new Date(ahora).getTime());
  if (!Object.keys(t).length) return productos;
  return productos.map((p) => ({
    ...p,
    variantes: p.variantes.map((v) => ({ ...v, stock: Math.max(0, v.stock - (t[clave(p.id, v.color, v.talla)] ?? 0)) })),
  }));
}
