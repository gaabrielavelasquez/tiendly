import { textoVarianteLargo } from "@/features/productos/lib/variantes";
import { formatoSoles } from "@/lib/formato";
import type { Datos, Entrega, Linea, Totales } from "../types";
import { formatoCelular } from "./reglas";

type Mensaje = { tienda: string; numero: string; lineas: Linea[]; cupon?: string; totales: Totales; datos: Datos; entrega: Entrega };

/** Mensaje del pedido para WhatsApp (Figma, "Pedir por WhatsApp" y K5). */
export function mensajePedido({ tienda, numero, lineas, cupon, totales, datos, entrega }: Mensaje) {
  const productos = lineas.map((l) => `• ${l.nombre}${l.detalle.length ? ` — ${textoVarianteLargo(l.detalle, ", ", "talla")}` : ""}${l.cantidad > 1 ? ` (x${l.cantidad})` : ""} — ${formatoSoles(l.precio * l.cantidad)}`);
  const lineasEntrega =
    entrega.tipo === "recojo"
      ? ["Recojo en tienda (gratis)"]
      : entrega.tipo === "coordinar"
        ? ["Entrega: la coordinamos por aquí (el envío va aparte)"]
        : [`Delivery a ${entrega.distrito.nombre} (${totales.envio ? formatoSoles(totales.envio) : "gratis"})`, `Dirección: ${entrega.direccion}${entrega.referencia ? ` (${entrega.referencia})` : ""}`];
  return [
    `¡Hola ${tienda}! Quiero hacer el Pedido #${numero}:`,
    ...productos,
    ...(cupon && totales.descuento ? [`Cupón aplicado: ${cupon} (−${formatoSoles(totales.descuento)})`] : []),
    ...lineasEntrega,
    `Total: ${formatoSoles(totales.total)}`,
    `A nombre de ${datos.nombre.trim()} · ${formatoCelular(datos.celular)}`,
    "¿Cómo puedo pagar?",
  ].join("\n");
}

export const linkWhatsApp = (celular: string, texto: string) => `https://wa.me/51${celular}?text=${encodeURIComponent(texto)}`;
