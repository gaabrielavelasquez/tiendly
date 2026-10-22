"use client";

import { ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";
import type { Categoria } from "@/features/productos/types";
import { useCantidadCarrito } from "../hooks/use-carrito";

type CabeceraProps = {
  nombre: string;
  /** Logo de la tienda (si tiene). Si no, el nombre en serif. */
  logo?: string;
  slug: string;
  categorias: { id: Categoria; label: string }[];
  /** En el catálogo: la categoría activa y cómo cambiarla sin recargar. En el producto, los links navegan. */
  activa?: Categoria | "todos";
  onCategoria?: (c: Categoria) => void;
};

/**
 * Cabecera de la vitrina (Figma, tema Editorial): logo a la izquierda en serif, categorías al centro
 * en desktop y carrito a la derecha con punto spark si hay productos (regla del 1 %, decisión 0022).
 */
export function CabeceraTienda({ nombre, logo, slug, categorias, activa, onCategoria }: CabeceraProps) {
  const cantidad = useCantidadCarrito(slug);
  return (
    <header className="sticky top-0 z-20 border-b border-line-subtle bg-page/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4 lg:grid lg:grid-cols-[1fr_auto_1fr]">
        <Link href={`/${slug}`} aria-label={`${nombre}, inicio de la tienda`} className="font-display-hero text-h2 tracking-wide text-fg uppercase">
          {logo ? (
            // El archivo tiene aire alrededor del wordmark (la caja ancha y object-cover lo recortan) y fondo
            // blanco opaco: multiply lo funde con el lienzo sin tocar la imagen.
            <span className="relative block h-9 w-36">
              <Image src={logo} alt="" fill priority sizes="9rem" className="object-cover mix-blend-multiply" />
            </span>
          ) : (
            nombre
          )}
        </Link>
        <nav aria-label="Categorías" className="hidden items-center gap-8 lg:flex">
          {categorias.map((c) => {
            const clase = cn("text-body-sm transition-colors hover:text-fg", activa === c.id ? "text-fg underline underline-offset-8" : "text-fg-secondary");
            return onCategoria ? (
              <button key={c.id} type="button" onClick={() => onCategoria(c.id)} aria-pressed={activa === c.id} className={clase}>
                {c.label}
              </button>
            ) : (
              <Link key={c.id} href={`/${slug}?categoria=${c.id}`} className={clase}>
                {c.label}
              </Link>
            );
          })}
        </nav>
        <Link
          href={`/${slug}/carrito`}
          aria-label={cantidad ? `Carrito: ${cantidad} ${cantidad === 1 ? "producto" : "productos"}` : "Carrito vacío"}
          className="relative ml-auto flex size-11 items-center justify-center rounded-theme text-icon transition-colors hover:bg-sunken lg:justify-self-end"
        >
          <ShoppingBag aria-hidden strokeWidth={1.4} className="size-5" />
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
