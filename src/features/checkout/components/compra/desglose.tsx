import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { textoVarianteLargo } from "@/features/productos/lib/variantes";
import { formatoSoles } from "@/lib/formato";
import { cn } from "@/lib/cn";
import type { Entrega, Linea, Totales } from "../../types";

const fila = "flex items-baseline justify-between gap-3 text-body-sm";

/** "Gratis", "S/ 15" o "Se calcula en Entrega" (Figma K0 y D2). */
export function textoEnvio(t: Totales) {
  if (t.envioPorCoordinar) return "Por coordinar";
  if (t.envio === null) return t.envioGratis ? "Gratis" : "Se calcula en Entrega";
  return t.envio === 0 ? "Gratis" : formatoSoles(t.envio);
}

/** Productos con foto, opciones y cantidad (Figma K0 y D2). */
export function ListaLineas({ lineas }: { lineas: Linea[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {lineas.map((l) => (
        <li key={`${l.id}-${l.variante}`} className="flex items-center gap-3">
          <span className="relative aspect-4/5 w-12 shrink-0 overflow-hidden bg-sunken">
            {l.foto ? <Image src={l.foto} alt="" fill sizes="3rem" className="object-cover" /> : <ImageIcon aria-hidden strokeWidth={1.4} className="m-auto h-full size-5 text-icon" />}
          </span>
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-body-sm font-semibold text-fg">{l.nombre}</span>
            <span className="text-caption text-fg-secondary">
              {[textoVarianteLargo(l.detalle), `${l.cantidad} ${l.cantidad === 1 ? "unidad" : "unidades"}`].filter(Boolean).join(" · ")}
            </span>
          </span>
          <span className="text-body-sm font-semibold text-fg tabular-nums">{formatoSoles(l.precio * l.cantidad)}</span>
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
        <span className="text-fg tabular-nums">{formatoSoles(t.productos)}</span>
      </p>
      {t.descuento > 0 && (
        <p className={fila}>
          <span className="text-fg-secondary">Cupón {cupon}</span>
          <span className="text-success tabular-nums">−{formatoSoles(t.descuento)}</span>
        </p>
      )}
      <p className={fila}>
        <span className="text-fg-secondary">{envio}</span>
        <span className="text-fg tabular-nums">{textoEnvio(t)}</span>
      </p>
      <p className="flex items-baseline justify-between border-t border-line-subtle pt-3">
        <span className="text-body font-semibold text-fg">Total</span>
        <span className="text-h3 font-semibold text-fg tabular-nums">{formatoSoles(t.total)}</span>
      </p>
    </div>
  );
}
