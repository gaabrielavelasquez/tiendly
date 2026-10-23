import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui";
import { cn } from "@/lib/cn";
import { formatoSoles } from "@/lib/formato";
import type { ProductoProto } from "../../lib/datos";
import { descuento, estadoOferta, precioVigente } from "../../lib/oferta";

export const slugDe = (nombre: string) => nombre.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().replace(/[^a-z0-9]+/g, "-");

/**
 * Tarjeta de la vitrina con oferta (0034): la etiqueta "−22 %" va sobre la foto, arriba a la izquierda (donde hoy va
 * "Agotado"), y debajo del nombre el precio nuevo y el de antes tachado. Fuera de fechas: precio normal, sin etiqueta.
 */
export function TarjetaOferta({ p, hoy, prioridad = false }: { p: ProductoProto; hoy: string; prioridad?: boolean }) {
  const activa = estadoOferta(p, hoy) === "activa";
  return (
    <Link href={`/prototipo/tienda/${slugDe(p.nombre)}`} className="group flex flex-col gap-3 outline-offset-4">
      <div className="relative aspect-4/5 overflow-hidden rounded-theme bg-surface">
        {p.foto && <Image src={p.foto} alt={p.nombre} fill sizes="(min-width: 64rem) 25vw, 50vw" priority={prioridad} className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />}
        {activa && (
          <Badge tone="selected" className="absolute top-2 left-2 tabular-nums">
            <span className="sr-only">Descuento de </span>−{descuento(p.precio, p.precioAntes)} %
          </Badge>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <span className="truncate font-display-hero text-body-lg leading-tight text-fg">{p.nombre}</span>
        <span className="flex items-baseline gap-1.5 tabular-nums">
          <span className={cn("font-body text-body-sm text-fg", activa && "font-medium")}>{formatoSoles(precioVigente(p, hoy))}</span>
          {activa && (
            <span className="text-caption text-fg-tertiary line-through">
              <span className="sr-only">Precio anterior: </span>
              {formatoSoles(p.precioAntes!)}
            </span>
          )}
        </span>
      </div>
    </Link>
  );
}
