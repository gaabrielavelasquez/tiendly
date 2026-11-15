"use server";

import { ApiError, usingApi, apiJson } from "@/lib/api-client";
import { agregarPedido, horaPedido, siguienteNumero } from "@/features/pedidos/lib/almacen";
import { RESERVA_HORAS } from "@/features/pedidos/lib/reglas";
import { asignarStock } from "@/features/productos/lib/inventario";
import { textoVariante, textoVarianteLargo } from "@/features/productos/lib/variantes";
import type { DetallePedido, Pedido } from "@/features/pedidos/types";
import type { ItemCarrito } from "@/features/vitrina/lib/carrito";
import type { Datos, MetodoPago, Totales } from "../types";
import { obtenerCompra } from "./catalogo";
import { sumarUso } from "@/features/cupones/lib/mock";
import { datosTienda, mutarTienda } from "@/lib/datos/tienda";
import type { Cupon as CuponTienda } from "@/features/cupones/types";
import { usarEnCarrito } from "@/features/cupones/lib/reglas";
import { hoyLima } from "@/lib/reloj";
import type { Cupon } from "../types";
import type { OrderReceipt } from "@tiendly/contracts";
import { calcularTotales, faltaEnvioGratis, resolverLineas, validarDatos } from "./reglas";

// Acciones de la vitrina. Sin API: escriben en los datos de la tienda (lib/datos). Con API
// (TIENDLY_API_URL): el backend recalcula precios, valida el stock y guarda el pedido en D1.

/** Hoy en el reloj de la demo (los cupones vencen por día). */

/** Valida un cupón contra los de la tienda (módulo 3): estado, fechas, compra mínima y envío gratis. */
function validarCuponCompra(cupones: CuponTienda[], codigo: string, productos: number, envioGratisDesde: number | null) {
  return usarEnCarrito(codigo, cupones, productos, faltaEnvioGratis(productos, envioGratisDesde) === 0, hoyLima());
}

/** El cliente aplica un cupón en el carrito o en "Finalizar compra" (Figma C3a–C3c y C5). */
export async function aplicarCupon(tienda: string, codigo: string, productos: number): Promise<{ cupon: Cupon } | { error: string }> {
  const compra = await obtenerCompra(tienda);
  const d = await datosTienda(tienda);
  if (!compra || !d) return { error: "La tienda no existe." };
  const r = validarCuponCompra(d.cupones, codigo, productos, compra.reglas.envioGratisDesde);
  return r.ok ? { cupon: { codigo: r.cupon.codigo, tipo: r.cupon.tipo, valor: r.cupon.valor } } : { error: r.error };
}

/** Reserva el número del pedido al llegar al pago (el mensaje de WhatsApp ya lo muestra). */
export async function reservarNumero(tienda: string, token?: string): Promise<string | null> {
  if (usingApi()) {
    if (!token) return null;
    try {
      return (await apiJson<{ number: string }>(`/api/public/stores/${tienda}/checkout`, { method: "POST", body: JSON.stringify({ token }), headers: { "Content-Type": "application/json" } })).number;
    } catch (error) {
      if (error instanceof ApiError && error.code === "not_found") return null;
      throw error; // la vista ya muestra el reintento
    }
  }
  return mutarTienda(tienda, (d) => siguienteNumero(d.pedidos));
}

/** El stock pudo cambiar mientras el cliente compraba (otra venta o una reserva por WhatsApp). */
function faltaStock(items: ItemCarrito[], lineas: ReturnType<typeof resolverLineas>) {
  const l = lineas.find((x) => items.some((i) => i.id === x.id && i.variante === x.variante && i.cantidad > x.maximo));
  if (!l) return null;
  const talla = l.detalle.find((d) => d.tipo === "talla");
  const otras = textoVarianteLargo(l.detalle, " · ", "talla");
  const cual = `${l.nombre}${talla ? ` en talla ${talla.valor}` : otras ? ` (${otras})` : ""}`;
  return l.maximo ? `Solo quedan ${l.maximo} de ${cual}. Ajusta la cantidad en tu carrito.` : `Se agotó ${cual}. Quítalo de tu carrito para seguir.`;
}

/** Se llama ANTES de cobrar: si falta stock o el cupón ya no vale, no se cobra nada. */
export async function revisarStock(tienda: string, items: ItemCarrito[], cupon?: string): Promise<string | null> {
  const compra = await obtenerCompra(tienda);
  if (!compra) return "La tienda no existe.";
  const lineas = resolverLineas(items, compra.catalogo);
  const falta = faltaStock(items, lineas);
  if (falta || !cupon) return falta;
  const productos = lineas.reduce((s, l) => s + l.precio * l.cantidad, 0);
  const r = validarCuponCompra((await datosTienda(tienda))?.cupones ?? [], cupon, productos, compra.reglas.envioGratisDesde);
  return r.ok ? null : `Tu cupón ${cupon} ya no se puede usar: ${r.error.charAt(0).toLowerCase()}${r.error.slice(1)} Quítalo para seguir.`;
}

type Entrada = {
  tienda: string;
  numero: string;
  /** Token del intento de checkout: con API, une la reserva del número con la creación del pedido. */
  token?: string;
  items: ItemCarrito[];
  cupon?: string;
  datos: Datos;
  entrega: { tipo: "recojo" } | { tipo: "coordinar" } | { tipo: "delivery"; distrito: string; direccion: string; referencia: string };
  metodo: MetodoPago;
};

/** "Plata|36" → ["Plata", "36"]; "" → []. Los valores no llevan "|": lo garantiza el formulario. */
const valoresVariante = (variante: string) => (variante === "" ? [] : variante.split("|"));

const entregaApi = (e: Entrada["entrega"]) =>
  e.tipo === "recojo" ? { kind: "pickup" } : e.tipo === "coordinar" ? { kind: "coordinate" } : { kind: "delivery", district: e.distrito, address: e.direccion, ...(e.referencia ? { reference: e.referencia } : {}) };

const metodoApi = (m: MetodoPago) => (m === "tarjeta" ? "card" : m);

/** Céntimos del backend → soles de la vista (Totales). */
function totalesDe(r: OrderReceipt["totals"]): Totales {
  return {
    productos: r.subtotalCents / 100,
    unidades: r.units,
    descuento: r.discountCents / 100,
    envio: r.shippingCents === null ? null : r.shippingCents / 100,
    envioGratis: r.shippingCents === 0,
    ...(r.shippingPending ? { envioPorCoordinar: true } : {}),
    total: r.totalCents / 100,
  };
}

/**
 * Crea el pedido en Panel › Pedidos con su estado (decisiones 0007 y 0010): pagado con tarjeta o Yape
 * → "Pagado · Por enviar"; por WhatsApp → "Pago pendiente" con reserva de 24 h. Precios, cupón y envío
 * se recalculan aquí con el catálogo: no se confía en los montos que manda el navegador.
 */
export async function registrarPedido(e: Entrada): Promise<{ creadoEl: string; totales: Totales } | { error: string }> {
  if (usingApi()) {
    if (!e.token) return { error: "No pudimos preparar tu pedido. Inténtalo de nuevo." };
    const body = {
      token: e.token,
      items: e.items.map(({ id, variante, cantidad }) => ({ productId: id, variant: valoresVariante(variante), quantity: cantidad })),
      customer: { name: e.datos.nombre.trim(), phone: e.datos.celular.replace(/\D/g, "") },
      delivery: entregaApi(e.entrega),
      payment: { method: metodoApi(e.metodo) },
    };
    try {
      const r = await apiJson<{ order: OrderReceipt }>(`/api/public/stores/${e.tienda}/orders`, { method: "POST", body: JSON.stringify(body), headers: { "Content-Type": "application/json" } });
      return { creadoEl: r.order.createdAt, totales: totalesDe(r.order.totals) };
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.code === "conflict") return { error: "Alguien más llevó lo último de un producto. Revisa tu carrito e inténtalo de nuevo." };
        if (error.code === "invalid") return { error: "Revisa tu pedido y tus datos." };
        if (error.code === "not_found") return { error: "La tienda no existe." };
      }
      throw error; // sin API o caída: la vista muestra el reintento
    }
  }
  const compra = await obtenerCompra(e.tienda);
  if (!compra) return { error: "La tienda no existe." };
  const lineas = resolverLineas(e.items, compra.catalogo);
  if (!lineas.length || Object.keys(validarDatos(e.datos)).length) return { error: "Revisa tu pedido y tus datos." };
  const falta = faltaStock(e.items, lineas);
  if (falta) return { error: falta };
  const { reglas } = compra;
  // La tienda pudo cambiar su configuración mientras el cliente compraba (Pagos y Entregas).
  if (!reglas.pagos[e.metodo]) return { error: "Este método de pago ya no está disponible. Elige otro." };
  if (e.entrega.tipo === "recojo" && !reglas.recojo) return { error: "El recojo en tienda ya no está disponible. Elige delivery." };
  if (e.entrega.tipo === "coordinar" && (!reglas.coordinar || e.metodo !== "whatsapp")) return { error: "La tienda ya definió sus entregas. Elige cómo recibir tu pedido." };
  const distrito = e.entrega.tipo === "delivery" ? reglas.delivery?.distritos.find((d) => d.nombre === (e.entrega as { distrito: string }).distrito) : undefined;
  if (e.entrega.tipo === "delivery" && !distrito) return { error: "Ya no enviamos a ese distrito. Elige otro o recojo en tienda." };
  const productos = lineas.reduce((s, l) => s + l.precio * l.cantidad, 0);
  const cupones = (await datosTienda(e.tienda))?.cupones ?? [];
  const cupon = e.cupon ? validarCuponCompra(cupones, e.cupon, productos, reglas.envioGratisDesde) : null;
  if (cupon && !cupon.ok) return { error: cupon.error };
  const entrega = e.entrega.tipo === "delivery" && distrito ? { ...e.entrega, distrito } : { tipo: e.entrega.tipo === "coordinar" ? ("coordinar" as const) : ("recojo" as const) };
  const totales = calcularTotales(lineas, cupon?.ok ? cupon.cupon : null, entrega, reglas.envioGratisDesde);

  const creadoEl = horaPedido();
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
    items: lineas.map((l) => ({ producto: l.nombre, variante: textoVariante(l.detalle), cantidad: l.cantidad, precio: l.precio, foto: l.foto })),
    envio: totales.envio ?? 0,
    cupon: totales.descuento && cupon?.ok ? { codigo: cupon.cupon.codigo, descuento: totales.descuento } : undefined,
    direccion: entrega.tipo === "delivery" ? entrega.direccion : undefined,
    referencia: entrega.tipo === "delivery" && entrega.referencia ? entrega.referencia : undefined,
    pagadoEl: pagado ? creadoEl : undefined,
  };
  const stock = lineas.map(({ id, variante, cantidad }) => ({ id, variante, cantidad }));
  const hasta = new Date(new Date(creadoEl).getTime() + RESERVA_HORAS * 3600000).toISOString();
  const guardado = await mutarTienda(e.tienda, (d) => {
    agregarPedido(d.pedidos, { pedido, detalle, stock });
    if (cupon?.ok) sumarUso(d.cupones, cupon.cupon.codigo); // el cupón puede pasar a "Agotado"
    // Pagado: el stock baja ya. Por WhatsApp: queda reservado 24 h (si vence, se libera solo).
    asignarStock(d.inventario, pedido.id, pagado ? { tipo: "vendido", items: stock } : { tipo: "reservado", items: stock, hasta });
    return true;
  });
  if (!guardado) return { error: "La tienda no existe." };
  return { creadoEl, totales };
}
