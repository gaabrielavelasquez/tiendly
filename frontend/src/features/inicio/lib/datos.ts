import type { Producto as ProductoCatalogo } from "@/features/productos/types";
import { stockTotal } from "@/features/productos/lib/reglas";
import { conReglas, venceEl } from "@/features/pedidos/lib/reglas";
import { mismoDiaLima } from "@/features/pedidos/lib/tiempo";
import type { Pedido } from "@/features/pedidos/types";
import type { DiaVentas, InicioData } from "../types";

/**
 * Lo que Inicio cuenta sale de los mismos pedidos y del mismo catálogo que ven Pedidos y Productos:
 * un pedido nuevo de la vitrina, un "marcar como pagado / enviado" o una venta que baja el stock
 * se reflejan aquí. Funciones puras: se pueden mover al backend tal cual.
 */
export function actividadDe(pedidos: Pedido[], catalogo: ProductoCatalogo[], ahora: string, semana: DiaVentas[]) {
  const corte = new Date(ahora).getTime();
  const vigentes = pedidos.map((p) => conReglas(p, ahora)).filter((p) => p.pago.estado !== "cancelado");
  const hoy = vigentes.filter((p) => mismoDiaLima(new Date(p.creadoEl).getTime(), corte));
  const pedidosHoy: InicioData["pedidosHoy"] = hoy.map((p) => ({
    monto: p.total,
    pagado: p.pago.estado === "pagado",
    entrega: p.entrega.metodo === "recojo" ? "recojo" : "delivery", // por coordinar también sale de la tienda
    enviado: p.entrega.estado !== "por-enviar",
  }));
  const reservas = vigentes
    .filter((p) => p.pago.estado === "pendiente" && p.pago.metodo !== "contra-entrega")
    .map((p) => ({ venceEl: new Date(venceEl(p)).toISOString() }));
  const pagadosHoy = pedidosHoy.filter((p) => p.pagado);
  // El día de hoy en "Esta semana" también sale de los pedidos; los días anteriores quedan como estaban.
  const semanaReal = semana.map((d) =>
    mismoDiaLima(new Date(`${d.fecha}T12:00:00-05:00`).getTime(), corte)
      ? { ...d, monto: pagadosHoy.reduce((s, p) => s + p.monto, 0), pedidos: pagadosHoy.length }
      : d,
  );
  return { pedidosHoy, reservas, productos: catalogo.map((p) => ({ nombre: p.nombre, stock: stockTotal(p) })), semana: semanaReal };
}
