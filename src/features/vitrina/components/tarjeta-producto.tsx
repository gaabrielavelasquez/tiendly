import Image from "next/image";
import Link from "next/link";
import { formatoSoles } from "@/lib/formato";
import { cn } from "@/lib/cn";
import type { ProductoVitrina } from "../lib/vitrina";
import { Muestras } from "./muestras";

type TarjetaProps = { p: ProductoVitrina; tienda: string; prioridad?: boolean };

/**
 * Tarjeta de producto (Figma, tema Editorial): foto sobre blanco con borde de 1 px y esquinas del
 * tema, nombre, precio y muestras de color. Toda la tarjeta es el link; sin botón de agregar.
 */
export function TarjetaProducto({ p, tienda, prioridad = false }: TarjetaProps) {
  return (
    <Link href={`/${tienda}/${p.slug}`} className="group flex flex-col gap-2.5 rounded-card outline-offset-4">
      <div className="relative aspect-4/5 overflow-hidden rounded-card border border-line-subtle bg-surface">
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
          <span className="absolute top-2 left-2 bg-surface px-2 py-0.5 text-label font-semibold tracking-wider text-fg uppercase">Agotado</span>
        )}
      </div>
      <div className="flex flex-col gap-1">
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
        {p.colores.length > 1 && <Muestras colores={p.colores} />}
      </div>
    </Link>
  );
}
