"use client";

import { Check, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button, buttonVariants } from "@/components/ui";
import { cn } from "@/lib/cn";
import { PrecioTienda } from "../precio-tienda";

type Props = {
  foto?: string;
  nombre: string;
  /** Lo elegido, "Plata · Talla M"; vacío si el producto no tiene opciones. */
  variante: string;
  precio: number;
  precioAntes?: number;
  descuento: number;
  carrito: string;
  onCerrar: () => void;
};

/**
 * "Agregado al carrito" (PR #26): hoja desde abajo en el celular y panel chico arriba a la derecha en desktop, debajo
 * del carrito. Muestra lo que se agregó y dos salidas: "Ver carrito" (CTA) y "Seguir comprando". El foco va a
 * "Ver carrito"; Escape o tocar fuera la cierran. Los primeros 400 ms no recibe toques: el segundo toque de un doble
 * toque en "Agregar" caería sobre la hoja recién abierta (el fondo o, en tablet, "Seguir comprando") y la cerraría.
 */
export function HojaAgregado({ foto, nombre, variante, precio, precioAntes, descuento, carrito, onCerrar }: Props) {
  const ver = useRef<HTMLAnchorElement>(null);
  const [activa, setActiva] = useState(false);
  useEffect(() => {
    ver.current?.focus();
    const t = window.setTimeout(() => setActiva(true), 400);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onCerrar();
    window.addEventListener("keydown", esc);
    return () => (window.clearTimeout(t), window.removeEventListener("keydown", esc));
  }, [onCerrar]);

  return (
    <div className={cn("fixed inset-0 z-50 flex items-end bg-fg/40 md:items-start md:justify-end md:bg-transparent md:px-4 md:pt-20", !activa && "pointer-events-none")} onClick={onCerrar}>
      <div role="dialog" aria-modal aria-labelledby="agregado-titulo" onClick={(e) => e.stopPropagation()}
        className="flex w-full flex-col gap-4 rounded-t-card bg-surface px-5 pt-4 pb-[max(calc(var(--spacing)*4),env(safe-area-inset-bottom))] shadow-overlay motion-safe:animate-hoja md:max-w-sm md:rounded-card md:border md:border-line-subtle md:pb-5">
        <header className="flex items-center justify-between gap-3">
          <h2 id="agregado-titulo" className="flex items-center gap-2 text-body font-semibold text-fg">
            <Check aria-hidden strokeWidth={2} className="size-4 text-success" />
            Agregado al carrito
          </h2>
          <button type="button" onClick={onCerrar} aria-label="Cerrar" className="-mr-2 flex size-11 shrink-0 items-center justify-center rounded-theme text-icon hover:bg-sunken">
            <X aria-hidden strokeWidth={1.5} className="size-5" />
          </button>
        </header>
        <div className="flex items-center gap-3">
          <div className="relative aspect-4/5 w-16 shrink-0 overflow-hidden rounded-theme border border-line-subtle bg-sunken">
            {foto && <Image src={foto} alt="" fill sizes="4rem" className="object-cover" />}
          </div>
          <div className="flex min-w-0 flex-col gap-1">
            <p className="truncate text-body-sm font-medium text-fg">{nombre}</p>
            {variante && <p className="truncate text-caption text-fg-secondary">{variante}</p>}
            <PrecioTienda precio={precio} precioAntes={precioAntes} descuento={descuento} conEtiqueta={false} />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Link ref={ver} href={carrito} className={cn(buttonVariants({ block: true }), "transition active:scale-98")}>Ver carrito</Link>
          <Button variant="secondary" block onClick={onCerrar}>Seguir comprando</Button>
        </div>
      </div>
    </div>
  );
}
