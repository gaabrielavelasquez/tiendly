import Image from "next/image";
import Link from "next/link";
import { formatoSoles } from "@/lib/formato";
import { cn } from "@/lib/cn";
import type { ProductoVitrina } from "../lib/vitrina";

type TarjetaProps = { p: ProductoVitrina; tienda: string; prioridad?: boolean };

/**
 * Tarjeta de producto sin ruido: foto grande 4:5 (radio de tarjeta y filo de 1 px), nombre en una
 * línea y precio. Toda la tarjeta es el link al producto; sin botón de "agregar" en la grilla.
 */
export function TarjetaProducto({ p, tienda, prioridad = false }: TarjetaProps) {
  return (
    <Link href={`/${tienda}/${p.slug}`} className="group flex flex-col gap-2 rounded-card outline-offset-4 transition active:scale-98">
      <div className="relative aspect-4/5 overflow-hidden rounded-card bg-sunken ring-1 ring-fg/5 ring-inset">
        {p.imagen && (
          <Image
            src={p.imagen}
            alt={p.nombre}
            fill
            sizes="(min-width: 64rem) 25vw, (min-width: 40rem) 33vw, 50vw" // breakpoints lg y sm de Tailwind
            priority={prioridad}
            className={cn("object-cover transition-transform duration-500 group-hover:scale-[1.03]", p.agotado && "opacity-60")}
          />
        )}
        {p.agotado && (
          <span className="absolute top-2 left-2 rounded-chip bg-surface/90 px-2 py-0.5 text-label font-semibold text-fg">Agotado</span>
        )}
      </div>
      <div className="flex flex-col gap-0.5 px-0.5">
        <span className="truncate text-body-sm text-fg">{p.nombre}</span>
        <span className="flex items-baseline gap-1.5 tabular-nums">
          <span className="text-body-sm font-semibold text-fg">{formatoSoles(p.precio)}</span>
          {p.precioAntes && (
            <span className="text-caption text-fg-tertiary line-through">
              <span className="sr-only">Antes: </span>
              {formatoSoles(p.precioAntes)}
            </span>
          )}
        </span>
      </div>
    </Link>
  );
}
