"use server";

import { agregarPedido, horaDemo, siguienteNumero } from "@/features/pedidos/lib/almacen";
import { RESERVA_HORAS } from "@/features/pedidos/lib/reglas";
import { asignarStock } from "@/features/productos/lib/inventario";
import type { DetallePedido, Pedido } from "@/features/pedidos/types";
import type { ItemCarrito } from "@/features/vitrina/lib/carrito";
import type { Datos, MetodoPago, Totales } from "../types";
import { obtenerCompra } from "./catalogo";
import { DISTRITOS } from "./config";
import { calcularTotales, resolverLineas, validarCupon, validarDatos } from "./reglas";

// Acciones de la vitrina que llegan al panel (Pedidos). Simulado: escriben en el almacén en memoria.

/** Reserva el número del pedido al llegar al pago (el mensaje de WhatsApp ya lo muestra). */
export async function reservarNumero(): Promise<string> {
  return siguienteNumero();
}

/** El stock pudo cambiar mientras el cliente compraba (otra venta o una reserva por WhatsApp). */
function faltaStock(items: ItemCarrito[], lineas: ReturnType<typeof resolverLineas>) {
  const l = lineas.find((x) => items.some((i) => i.id === x.id && i.color === x.color && i.talla === x.talla && i.cantidad > x.maximo));
  if (!l) return null;
  return l.maximo ? `Solo quedan ${l.maximo} de ${l.nombre} en talla ${l.talla}. Ajusta la cantidad en tu carrito.` : `Se agotó ${l.nombre} en talla ${l.talla}. Quítala de tu carrito para seguir.`;
}

/** Se llama ANTES de cobrar: si falta stock, no se cobra nada. */
export async function revisarStock(tienda: string, items: ItemCarrito[]): Promise<string | null> {
  const compra = await obtenerCompra(tienda);
  return compra ? faltaStock(items, resolverLineas(items, compra.catalogo)) : "La tienda no existe.";
}

type Entrada = {
  tienda: string;
  numero: string;
  items: ItemCarrito[];
  cupon?: string;
  datos: Datos;
  entrega: { tipo: "recojo" } | { tipo: "delivery"; distrito: string; direccion: string; referencia: string };
  metodo: MetodoPago;
};

/**
 * Crea el pedido en Panel › Pedidos con su estado (decisiones 0007 y 0010): pagado con tarjeta o Yape
 * → "Pagado · Por enviar"; por WhatsApp → "Pago pendiente" con reserva de 24 h. Precios, cupón y envío
 * se recalculan aquí con el catálogo: no se confía en los montos que manda el navegador.
 */
export async function registrarPedido(e: Entrada): Promise<{ creadoEl: string; totales: Totales } | { error: string }> {
  const compra = await obtenerCompra(e.tienda);
  if (!compra) return { error: "La tienda no existe." };
  const lineas = resolverLineas(e.items, compra.catalogo);
  if (!lineas.length || Object.keys(validarDatos(e.datos)).length) return { error: "Revisa tu pedido y tus datos." };
  const falta = faltaStock(e.items, lineas);
  if (falta) return { error: falta };
  const distrito = e.entrega.tipo === "delivery" ? DISTRITOS.find((d) => d.nombre === (e.entrega as { distrito: string }).distrito) : undefined;
  if (e.entrega.tipo === "delivery" && !distrito) return { error: "Elige el distrito donde recibes tu pedido." };
  const productos = lineas.reduce((s, l) => s + l.precio * l.cantidad, 0);
  const cupon = e.cupon ? validarCupon(e.cupon, productos) : null;
  const entrega = e.entrega.tipo === "delivery" && distrito ? { ...e.entrega, distrito } : { tipo: "recojo" as const };
  const totales = calcularTotales(lineas, cupon?.ok ? cupon.cupon : null, entrega);

  const creadoEl = horaDemo();
  const pagado = e.metodo !== "whatsapp";
  const pedido: Pedido = {
    id: e.numero.toLowerCase(),
    numero: e.numero,
    creadoEl,
    cliente: { nombre: e.datos.nombre.trim(), celular: e.datos.celular.replace(/\D/g, "") },
    items: totales.unidades,
    total: totales.total,
    pago: { estado: pagado ? "pagado" : "pendiente", metodo: e.metodo },
    entrega: { estado: "por-enviar", metodo: entrega.tipo, distrito: distrito?.nombre },
  };
  const detalle: DetallePedido = {
    items: lineas.map((l) => ({ producto: l.nombre, variante: `${l.color} · ${l.talla}`, cantidad: l.cantidad, precio: l.precio, foto: l.foto })),
    envio: totales.envio ?? 0,
    cupon: totales.descuento && cupon?.ok ? { codigo: cupon.cupon.codigo, descuento: totales.descuento } : undefined,
    direccion: entrega.tipo === "delivery" ? entrega.direccion : undefined,
    referencia: entrega.tipo === "delivery" && entrega.referencia ? entrega.referencia : undefined,
    pagadoEl: pagado ? creadoEl : undefined,
  };
  const stock = lineas.map(({ id, color, talla, cantidad }) => ({ id, color, talla, cantidad }));
  agregarPedido({ pedido, detalle, stock });
  // Pagado: el stock baja ya. Por WhatsApp: queda reservado 24 h (si vence, se libera solo).
  const hasta = new Date(new Date(creadoEl).getTime() + RESERVA_HORAS * 3600000).toISOString();
  asignarStock(pedido.id, pagado ? { tipo: "vendido", items: stock } : { tipo: "reservado", items: stock, hasta });
  return { creadoEl, totales };
}
