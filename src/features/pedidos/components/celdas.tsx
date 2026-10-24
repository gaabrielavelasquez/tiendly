import { MontoPedido } from "./monto-pedido";
import Link from "next/link";
import { Badge } from "@/components/ui";
import { plural } from "@/lib/formato";
import type { Pedido } from "../types";
import { fechaPedido } from "../lib/format";
import { BADGE_PAGO, badgeEntrega, celularVisible, METODO_PAGO, tiempoRestante, textoEntrega } from "../lib/reglas";

type CeldaProps = { p: Pedido; ahora: string };

/** Número del pedido (Outfit SemiBold, link al detalle) y fecha en texto atenuado. */
export function CeldaPedido({ p, ahora }: CeldaProps) {
  return (
    <div className="flex flex-col gap-0.5">
      <Link href={`/panel/pedidos/${p.id}`} className="min-h-11 content-center font-medium text-body-sm text-fg outline-offset-2 focus-visible:outline-2 focus-visible:outline-focus after:absolute after:inset-0 after:content-['']">
        #{p.numero}
      </Link>
      <span className="text-caption whitespace-nowrap text-fg-secondary">{fechaPedido(p.creadoEl, ahora)}</span>
    </div>
  );
}

/** Avatar con iniciales (neutro, sin colores inventados) + nombre y WhatsApp. */
export function CeldaCliente({ p }: { p: Pedido }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="truncate text-body-sm font-medium text-fg">{p.cliente.nombre}</span>
        <span className="text-caption whitespace-nowrap text-fg-secondary tabular-nums">+51 {celularVisible(p.cliente.celular)}</span>
      </div>
    </div>
  );
}

/** Pago: badge + método; si es una reserva, cuánto falta para que venza (regla de 24 h). */
export function CeldaPago({ p, ahora }: CeldaProps) {
  const { tono, texto } = BADGE_PAGO[p.pago.estado];
  const vence = tiempoRestante(p, ahora);
  const detalle = p.pago.estado === "cancelado" ? "Reserva vencida" : METODO_PAGO[p.pago.metodo];
  return (
    <div className="flex flex-col items-start gap-1">
      <Badge tone={tono}>{texto}</Badge>
      <span className={vence ? "text-caption font-medium text-warning" : "text-caption text-fg-secondary"}>{vence ?? detalle}</span>
    </div>
  );
}

/** Entrega: badge + distrito o "Recojo en tienda". Un pedido cancelado no se entrega. */
export function CeldaEntrega({ p }: { p: Pedido }) {
  if (p.pago.estado === "cancelado") return <span className="text-body-sm text-fg-tertiary">—</span>;
  const { tono, texto } = badgeEntrega(p.entrega.estado, p.entrega.metodo);
  return (
    <div className="flex flex-col items-start gap-1">
      <Badge tone={tono}>{texto}</Badge>
      <span className="text-caption text-fg-secondary">
        {textoEntrega(p)}
      </span>
    </div>
  );
}

export function CeldaTotal({ p }: { p: Pedido }) {
  return (
    <div className="flex flex-col items-end gap-0.5 tabular-nums">
      <span className={p.pago.estado === "cancelado" ? "text-body text-fg-tertiary line-through" : "text-body font-normal text-fg"}>
        <MontoPedido valor={p.total} />
      </span>
      <span className="text-caption text-fg-secondary">{plural(p.items, "producto", "productos")}</span>
    </div>
  );
}
