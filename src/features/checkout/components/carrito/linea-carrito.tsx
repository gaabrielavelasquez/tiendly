import { ImageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { descuento } from "@/features/productos/lib/ofertas";
import { textoVarianteLargo } from "@/features/productos/lib/variantes";
import { PrecioTienda } from "@/features/vitrina/components/precio-tienda";
import { cn } from "@/lib/cn";
import type { Linea } from "../../types";
import { SelectorCantidad } from "./selector-cantidad";

type Props = { linea: Linea; tienda: string; prioridad?: boolean; resaltada?: boolean; onCantidad: (n: number) => void; onQuitar: () => void; onIr?: () => void };

/**
 * Una línea del carrito (Figma; drawer 0036): foto, nombre, sus opciones ("Plata · Talla 36"), precio con su oferta
 * (0034), cantidad y "Quitar". Va dentro de UN contenedor con divisores (0031). `resaltada`: recién agregada, con un
 * fondo suave que se apaga solo. `onIr`: en el drawer, ir al producto también lo cierra.
 */
export function LineaCarrito({ linea: l, tienda, prioridad, resaltada, onCantidad, onQuitar, onIr }: Props) {
  const agotada = l.maximo === 0;
  const href = `/${tienda}/${l.slug}`;
  return (
    <li className={cn("flex gap-4 p-4 transition-colors duration-700", resaltada ? "bg-sunken" : "bg-surface")}>
      <Link href={href} onClick={onIr} className="relative aspect-4/5 w-20 shrink-0 overflow-hidden rounded-theme bg-sunken" tabIndex={-1} aria-hidden>
        {l.foto ? <Image src={l.foto} alt="" fill sizes="5rem" priority={prioridad} className="object-cover" /> : <ImageIcon strokeWidth={1.4} className="m-auto size-6 h-full text-icon" />}
      </Link>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <Link href={href} onClick={onIr} className="truncate text-body-sm font-medium text-fg hover:underline">
          {l.nombre}
        </Link>
        {l.detalle.length > 0 && <p className="truncate text-caption text-fg-secondary">{textoVarianteLargo(l.detalle)}</p>}
        <PrecioTienda precio={l.precio * l.cantidad} precioAntes={l.precioAntes && l.precioAntes * l.cantidad} descuento={descuento(l.precio, l.precioAntes)} conEtiqueta={false} />
        {agotada && <p className="text-caption text-error">Se agotó esta opción. Quítala para seguir con tu compra.</p>}
        <div className="flex items-center justify-between gap-2 pt-1">
          {agotada ? <span /> : <SelectorCantidad nombre={l.nombre} cantidad={l.cantidad} maximo={l.maximo} onCambio={onCantidad} />}
          <button type="button" onClick={onQuitar} className="-mr-2 h-11 shrink-0 px-2 text-body-sm text-fg-secondary underline-offset-4 hover:text-fg hover:underline">
            Quitar<span className="sr-only"> {l.nombre}</span>
          </button>
        </div>
      </div>
    </li>
  );
}
