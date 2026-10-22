"use client";

import { Menu, ShoppingBag, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
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
 * Cabecera de la vitrina (Figma, Home; decisión 0027). Móvil: menú a la izquierda, logo al centro y
 * carrito a la derecha. Desktop: logo a la izquierda, categorías al centro y carrito a la derecha.
 * El carrito lleva punto spark si hay productos (regla del 1 %, decisión 0022).
 */
export function CabeceraTienda({ nombre, logo, slug, categorias, activa, onCategoria }: CabeceraProps) {
  const cantidad = useCantidadCarrito(slug);
  const [menu, setMenu] = useState(false);
  const enlaces = (clase: (activo: boolean) => string) =>
    categorias.map((c) =>
      onCategoria ? (
        <button key={c.id} type="button" onClick={() => (onCategoria(c.id), setMenu(false))} aria-pressed={activa === c.id} className={clase(activa === c.id)}>
          {c.label}
        </button>
      ) : (
        <Link key={c.id} href={`/${slug}?categoria=${c.id}`} className={clase(activa === c.id)}>
          {c.label}
        </Link>
      ),
    );
  return (
    <header className="sticky top-0 z-20 border-b border-line-subtle bg-page/90 backdrop-blur-md">
      <div className="mx-auto grid h-16 max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-6 px-2 lg:px-4">
        <button
          type="button"
          aria-label={menu ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menu}
          aria-controls="menu-tienda"
          onClick={() => setMenu((v) => !v)}
          className="flex size-11 items-center justify-center rounded-theme text-icon transition-colors hover:bg-sunken lg:hidden"
        >
          {menu ? <X aria-hidden strokeWidth={1.4} className="size-5" /> : <Menu aria-hidden strokeWidth={1.4} className="size-5" />}
        </button>
        <Link href={`/${slug}`} aria-label={`${nombre}, inicio de la tienda`} className="justify-self-center font-display-hero text-h2 tracking-wide text-fg uppercase lg:col-start-1 lg:row-start-1 lg:justify-self-start">
          {logo ? (
            // El logo se muestra tal cual en todos los temas: sin filtros, mezcla, recorte ni radio.
            <span className="relative block h-9 w-36">
              <Image src={logo} alt="" fill priority sizes="9rem" className="object-contain" />
            </span>
          ) : (
            // Logo de texto: los nombres largos bajan de tamaño y se cortan con "…" en dos líneas, sin salirse de la barra (0031).
            <span className={cn("block max-w-52 text-center lg:max-w-xs lg:text-left", nombre.length > 14 && "line-clamp-2 text-body leading-tight")}>{nombre}</span>
          )}
        </Link>
        <nav aria-label="Categorías" className="hidden items-center gap-8 lg:flex">
          {enlaces((a) => cn("text-body-sm transition-colors hover:text-fg", a ? "text-fg underline underline-offset-8" : "text-fg-secondary"))}
        </nav>
        <Link
          href={`/${slug}/carrito`}
          aria-label={cantidad ? `Carrito: ${cantidad} ${cantidad === 1 ? "producto" : "productos"}` : "Carrito vacío"}
          className="relative flex size-11 items-center justify-center justify-self-end rounded-theme text-icon transition-colors hover:bg-sunken"
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
      {menu && (
        <nav id="menu-tienda" aria-label="Menú de la tienda" className="flex flex-col border-t border-line-subtle px-4 py-2 lg:hidden">
          {enlaces((a) => cn("flex min-h-12 items-center text-body text-left", a ? "font-semibold text-fg" : "text-fg-secondary"))}
        </nav>
      )}
    </header>
  );
}
