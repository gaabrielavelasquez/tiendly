import type { Producto } from "../types";

// Inventario simulado (decisiones 0010 y 0028), guardado con los datos de cada tienda hasta tener backend.
// Cada pedido de la vitrina tiene una "asignación" de stock según su estado:
//   pagado → vendido (baja para siempre) · pendiente por WhatsApp → reservado hasta `hasta` · cancelado → nada.
// El disponible es el stock base menos lo vendido y lo reservado vigente: una reserva vencida se libera sola.

export type ItemStock = { id: string; color: string; talla: string; cantidad: number };
export type Asignacion = { tipo: "vendido" | "reservado"; items: ItemStock[]; hasta?: string };
/** Por pedido: lo que consume del stock. Vive en los datos de la tienda (lib/datos/tienda). */
export type Inventario = Record<string, Asignacion>;

const clave = (id: string, color: string, talla: string) => `${id}|${color}|${talla}`;

/** Fija lo que un pedido consume. `null` (cancelado) lo libera. */
export function asignarStock(inv: Inventario, pedidoId: string, a: Asignacion | null) {
  if (a) inv[pedidoId] = a;
  else delete inv[pedidoId];
}

/** Unidades tomadas por variante en este momento (vendidas + reservas vigentes). */
function tomadas(inv: Inventario, ahora: number) {
  const t: Record<string, number> = {};
  for (const a of Object.values(inv)) {
    if (a.tipo === "reservado" && a.hasta && new Date(a.hasta).getTime() <= ahora) continue; // venció: se liberó
    for (const i of a.items) t[clave(i.id, i.color, i.talla)] = (t[clave(i.id, i.color, i.talla)] ?? 0) + i.cantidad;
  }
  return t;
}

/** El catálogo con el stock disponible (nunca negativo). Una talla en 0 se ve agotada en la vitrina. */
export function conDisponible(productos: Producto[], inv: Inventario, ahora: string): Producto[] {
  const t = tomadas(inv, new Date(ahora).getTime());
  if (!Object.keys(t).length) return productos;
  return productos.map((p) => ({
    ...p,
    variantes: p.variantes.map((v) => ({ ...v, stock: Math.max(0, v.stock - (t[clave(p.id, v.color, v.talla)] ?? 0)) })),
  }));
}
