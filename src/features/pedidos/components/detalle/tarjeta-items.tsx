import { ShoppingBag } from "lucide-react";
import Image from "next/image";
import { TarjetaSeccion } from "@/components/panel";
import { formatoSoles, plural } from "@/lib/formato";
import type { DetallePedido, Pedido } from "../../types";
import { subtotal, totalDetalle, unidades } from "../../lib/detalle-mock";
import { METODO_PAGO } from "../../lib/reglas";

type ItemsProps = { pedido: Pedido; detalle: DetallePedido };

/** Productos del pedido (foto, variante, cantidad y precio) y el resumen: subtotal, cupón, envío y total. */
export function TarjetaItems({ pedido, detalle }: ItemsProps) {
  const sub = subtotal(detalle);
  const total = totalDetalle(detalle);
  const cancelado = pedido.pago.estado === "cancelado";
  return (
    <TarjetaSeccion titulo="Productos" descripcion={`${plural(unidades(detalle), "unidad", "unidades")} en este pedido.`}>
      <ul className="flex flex-col divide-y divide-line-subtle">
        {detalle.items.map((it) => (
          <li key={`${it.producto}-${it.variante}`} className="flex items-center gap-3 py-3 first:pt-0">
            <span aria-hidden className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-theme border border-line-subtle bg-sunken">
              {it.foto ? <Image src={it.foto} alt="" fill sizes="48px" className="object-cover" /> : <ShoppingBag strokeWidth={1.6} className="size-5 text-icon-subtle" />}
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="truncate text-body-sm font-semibold text-fg">{it.producto}</span>
              <span className="text-caption text-fg-secondary">{it.variante}</span>
            </div>
            <span className="text-caption text-fg-secondary tabular-nums">
              {formatoSoles(it.precio)} × {it.cantidad}
            </span>
            <span className="w-20 text-right text-body-sm font-semibold text-fg tabular-nums">{formatoSoles(it.precio * it.cantidad)}</span>
          </li>
        ))}
      </ul>
      <dl className="flex flex-col gap-2 border-t border-line-subtle pt-4 text-body-sm tabular-nums">
        <div className="flex justify-between">
          <dt className="text-fg-secondary">Subtotal</dt>
          <dd className="text-fg">{formatoSoles(sub)}</dd>
        </div>
        {detalle.cupon && (
          <div className="flex justify-between">
            <dt className="text-fg-secondary">Cupón {detalle.cupon.codigo}</dt>
            <dd className="text-success">−{formatoSoles(detalle.cupon.descuento)}</dd>
          </div>
        )}
        <div className="flex justify-between">
          <dt className="text-fg-secondary">{pedido.entrega.metodo === "recojo" ? "Recojo en tienda" : `Delivery a ${pedido.entrega.distrito}`}</dt>
          <dd className="text-fg">{detalle.envio ? formatoSoles(detalle.envio) : "Gratis"}</dd>
        </div>
        <div className="flex items-baseline justify-between border-t border-line-subtle pt-3">
          <dt className="font-semibold text-fg">Total</dt>
          <dd className={cancelado ? "font-metric text-h3 text-fg-tertiary line-through" : "font-metric text-h3 text-fg"}>{formatoSoles(total)}</dd>
        </div>
        <p className="text-caption text-fg-secondary">
          {cancelado ? "Pedido cancelado: no se cobró." : `Pago con ${METODO_PAGO[pedido.pago.metodo]}${pedido.pago.estado === "pagado" ? " · cobrado." : " · pendiente."}`}
        </p>
      </dl>
    </TarjetaSeccion>
  );
}
