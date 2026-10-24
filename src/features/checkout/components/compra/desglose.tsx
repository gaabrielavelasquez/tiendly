import { Miniatura } from "@/features/productos/components/miniatura";
import { MontoPedido as Monto } from "@/features/pedidos/components/monto-pedido";
import { textoVarianteLargo } from "@/features/productos/lib/variantes";
import { formatoSoles } from "@/lib/formato";
import { cn } from "@/lib/cn";
import type { Entrega, Linea, Totales } from "../../types";

const fila = "flex min-w-0 items-baseline justify-between gap-3 text-body-sm";

/** "Gratis", "S/ 15" o "Se calcula en Entrega" (Figma K0 y D2). */
export function textoEnvio(t: Totales) {
  if (t.envioPorCoordinar) return "Por coordinar";
  if (t.envio === null) return t.envioGratis ? "Gratis" : "Se calcula en Entrega";
  return t.envio === 0 ? "Gratis" : formatoSoles(t.envio);
}

/** Productos con foto, opciones y cantidad (Figma K0 y D2). */
export function ListaLineas({ lineas }: { lineas: Linea[] }) {
  return (
    <ul className="divide-y divide-line-subtle">
      {lineas.map((l) => (
        <li key={`${l.id}-${l.variante}`} className="flex min-w-0 items-center gap-3 py-4 first:pt-0 last:pb-0">
          <Miniatura imagen={l.foto} />
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="break-words text-body-sm font-medium text-fg">{l.nombre}</span>
            <span className="text-caption text-fg-secondary">
              {[textoVarianteLargo(l.detalle), `${l.cantidad} ${l.cantidad === 1 ? "unidad" : "unidades"}`].filter(Boolean).join(" · ")}
            </span>
          </span>
          <Monto valor={l.precio * l.cantidad} className="shrink-0 text-body-sm font-normal text-fg" />
        </li>
      ))}
    </ul>
  );
}

/** Productos, cupón, envío y total. */
export function Desglose({ totales: t, cupon, entrega, className }: { totales: Totales; cupon?: string; entrega: Entrega | null; className?: string }) {
  const envio = entrega?.tipo === "delivery" ? `Delivery a ${entrega.distrito.nombre}` : entrega?.tipo === "recojo" ? "Recojo en tienda" : entrega?.tipo === "coordinar" ? "Entrega por WhatsApp" : "Envío";
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <p className={fila}>
        <span className="text-fg-secondary">Productos ({t.unidades})</span>
        <Monto valor={t.productos} className="font-normal text-fg" />
      </p>
      {t.descuento > 0 && (
        <p className={fila}>
          <span className="text-fg-secondary">Cupón {cupon}</span>
          <span className="flex items-baseline text-success">−<Monto valor={t.descuento} className="font-normal" /></span>
        </p>
      )}
      <p className={fila}>
        <span className="text-fg-secondary">{envio}</span>
        <span className="shrink-0 text-fg tabular-nums">{t.envio !== null && t.envio > 0 ? <Monto valor={t.envio} /> : textoEnvio(t)}</span>
      </p>
      <p className="flex items-baseline justify-between border-t border-line-subtle pt-3">
        <span className="text-body font-semibold text-fg">Total</span>
        <Monto valor={t.total} className="text-h3 font-semibold text-fg" />
      </p>
    </div>
  );
}
