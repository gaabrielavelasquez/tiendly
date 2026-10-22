import { ImageIcon, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { textoVarianteLargo } from "@/features/productos/lib/variantes";
import { formatoSoles } from "@/lib/formato";
import type { Linea } from "../../types";
import { SelectorCantidad } from "./selector-cantidad";

type Props = { linea: Linea; tienda: string; prioridad?: boolean; onCantidad: (n: number) => void; onQuitar: () => void };

/** Una línea del carrito (Figma): foto, nombre, sus opciones ("Plata · Talla 36"), precio, cantidad y "Quitar". */
export function LineaCarrito({ linea: l, tienda, prioridad, onCantidad, onQuitar }: Props) {
  const agotada = l.maximo === 0;
  return (
    <li className="flex gap-4 border border-line-subtle bg-surface p-4">
      <Link href={`/${tienda}/${l.slug}`} className="relative aspect-4/5 w-20 shrink-0 overflow-hidden bg-sunken lg:w-24" tabIndex={-1} aria-hidden>
        {l.foto ? <Image src={l.foto} alt="" fill sizes="6rem" priority={prioridad} className="object-cover" /> : <ImageIcon strokeWidth={1.4} className="m-auto size-6 h-full text-icon" />}
      </Link>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/${tienda}/${l.slug}`} className="truncate font-display-hero text-body-lg text-fg hover:underline">
            {l.nombre}
          </Link>
          <button type="button" onClick={onQuitar} className="-mt-2 -mr-2 flex h-11 shrink-0 items-center gap-1.5 px-2 text-body-sm font-semibold text-fg hover:underline">
            <Trash2 aria-hidden strokeWidth={1.6} className="size-4" />
            Quitar<span className="sr-only"> {l.nombre}</span>
          </button>
        </div>
        {l.detalle.length > 0 && <p className="text-body-sm text-fg-secondary">{textoVarianteLargo(l.detalle)}</p>}
        <p className="text-body font-semibold text-fg tabular-nums">{formatoSoles(l.precio * l.cantidad)}</p>
        {agotada ? (
          <p className="text-caption text-error">Se agotó esta talla. Quítala para seguir con tu compra.</p>
        ) : (
          <div className="pt-1">
            <SelectorCantidad nombre={l.nombre} cantidad={l.cantidad} maximo={l.maximo} onCambio={onCantidad} />
          </div>
        )}
      </div>
    </li>
  );
}
