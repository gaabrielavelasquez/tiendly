import type { DetallePedido, Pedido } from "../types";
import { AHORA } from "./mock";

// Pedidos creados desde la vitrina, en la memoria del servidor (simulado, hasta tener backend).
// Se borran al reiniciar el servidor. Viven en globalThis para que la acción de la vitrina y las páginas
// del panel vean el mismo almacén, y para que una recarga en caliente no lo vacíe.

type Almacen = { ultimo: number; creados: { pedido: Pedido; detalle: DetallePedido }[] };
const g = globalThis as typeof globalThis & { __tiendlyPedidos?: Almacen };
const almacen = (g.__tiendlyPedidos ??= { ultimo: 1047, creados: [] });

/** Siguiente número después de los simulados (#T-1047). Se reserva al llegar al pago. */
export const siguienteNumero = () => `T-${++almacen.ultimo}`;

/**
 * Hora del pedido en el reloj de la demo: el panel vive en AHORA (jueves 15, 6:30 p. m.), así que un
 * pedido nuevo se hizo "ahora". Así cuadran "Hoy" y la reserva de 24 h ("Vence en 24 h").
 */
export const horaDemo = () => new Date(AHORA).toISOString();

export function agregarPedido(pedido: Pedido, detalle: DetallePedido) {
  almacen.creados = [{ pedido, detalle }, ...almacen.creados.filter((c) => c.pedido.id !== pedido.id)];
}

export const pedidosCreados = () => almacen.creados;
