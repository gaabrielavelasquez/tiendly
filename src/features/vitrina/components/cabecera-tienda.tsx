"use client";

import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useCantidadCarrito } from "../hooks/use-carrito";

type CabeceraProps = { nombre: string; slug: string };

/**
 * Cabecera mínima y fija: nombre de la tienda al centro (Outfit SemiBold) y carrito a la derecha.
 * El punto spark solo aparece si hay productos en el carrito (regla del 1 %, decisión 0022).
 */
export function CabeceraTienda({ nombre, slug }: CabeceraProps) {
  const cantidad = useCantidadCarrito(slug);
  return (
    <header className="sticky top-0 z-20 border-b border-line-subtle bg-page/85 backdrop-blur-md">
      <div className="mx-auto grid h-14 max-w-6xl grid-cols-[1fr_auto_1fr] items-center px-2">
        <span aria-hidden />
        <Link href={`/${slug}`} className="font-display-title text-h3 tracking-tight text-fg">
          {nombre}
        </Link>
        <Link
          href={`/${slug}/carrito`}
          aria-label={cantidad ? `Carrito: ${cantidad} ${cantidad === 1 ? "producto" : "productos"}` : "Carrito vacío"}
          className="relative flex size-11 items-center justify-center justify-self-end rounded-theme text-icon transition-colors hover:bg-sunken"
        >
          <ShoppingBag aria-hidden strokeWidth={1.6} className="size-6" />
          {cantidad > 0 && (
            <span aria-hidden className="absolute top-2.5 right-2.5 flex size-2">
              <span className="absolute inset-0 rounded-full bg-spark motion-safe:animate-spark" />
              <span className="relative size-2 rounded-full bg-spark ring-2 ring-page" />
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
