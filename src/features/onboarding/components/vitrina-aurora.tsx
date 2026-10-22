import { Link2, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { AURORA, MODELOS_AURORA } from "@/lib/datos/aurora";
import { formatoSoles } from "@/lib/formato";

/** Cabecera de la tienda: nombre a la izquierda, bolsa a la derecha (como en la vitrina). */
function Cabecera({ link }: { link?: string }) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3 lg:px-5">
      <div className="flex min-w-0 flex-col">
        <span className="truncate font-display-title text-body text-fg lg:text-body-lg">{AURORA.nombre}</span>
        {link && <span className="truncate text-caption text-fg-secondary">{link}</span>}
      </div>
      <ShoppingBag aria-hidden strokeWidth={1.5} className="size-5 shrink-0 text-icon" />
    </div>
  );
}

/** Fila de los 4 modelos: foto 4:5 al ras, nombre y precio. */
function Productos({ conNombre }: { conNombre: boolean }) {
  return (
    <ul className="grid grid-cols-4 gap-2 lg:gap-3">
      {MODELOS_AURORA.map((m) => (
        <li key={m.id} className="flex min-w-0 flex-col gap-1.5">
          <div className="relative aspect-4/5 overflow-hidden bg-sunken">
            <Image src={m.foto} alt={m.alt} fill sizes="(min-width: 64rem) 8rem, 25vw" className="object-cover" />
          </div>
          {conNombre && <span className="truncate text-caption text-fg">{m.nombre}</span>}
          <span className="text-caption text-fg-secondary tabular-nums">{formatoSoles(m.precio)}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * Desktop: la vista previa es la protagonista del registro. Una tienda de verdad (Aurora Calzado, la demo pública)
 * con su portada y sus modelos, y el link con el formato real. Halo cálido solo detrás de ella (decisión 0031).
 */
export function VitrinaAurora({ link }: { link: string }) {
  return (
    <figure className="relative isolate w-full max-w-lg">
      <span aria-hidden className="pointer-events-none absolute -inset-x-12 -top-10 -bottom-16 -z-10 bg-halo-hoy" />
      <div className="overflow-hidden rounded-card bg-surface shadow-capas">
        <Cabecera />
        <div className="relative aspect-video">
          <Image src={AURORA.portada.src} alt={AURORA.portada.alt} fill priority sizes="32rem" className="object-cover" />
        </div>
        <div className="p-5">
          <Productos conNombre />
        </div>
        <p className="flex items-center gap-2 border-t border-line-subtle px-5 py-3 text-caption text-fg-secondary">
          <Link2 aria-hidden strokeWidth={1.5} className="size-4 shrink-0 text-icon" />
          <span className="truncate">{link}</span>
        </p>
      </div>
      <figcaption className="sr-only">Ejemplo de una tienda en Tiendly: {AURORA.nombre}.</figcaption>
    </figure>
  );
}

/** Móvil: versión compacta (cabecera con el link y los 4 modelos), para ver qué se obtiene sin empujar el formulario. */
export function VitrinaAuroraCompacta({ link }: { link: string }) {
  return (
    <figure className="overflow-hidden rounded-card bg-surface shadow-contenedor">
      <Cabecera link={link} />
      <div className="px-4 pb-4">
        <Productos conNombre={false} />
      </div>
      <figcaption className="sr-only">Ejemplo de una tienda en Tiendly: {AURORA.nombre}.</figcaption>
    </figure>
  );
}
