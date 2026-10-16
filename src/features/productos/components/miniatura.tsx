"use client";

import { Footprints, Gem, ShoppingBag, Shirt, type LucideIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/cn";
import type { Categoria } from "../types";

const ICONO: Record<Categoria, LucideIcon> = { ropa: Shirt, calzado: Footprints, accesorios: ShoppingBag, joyeria: Gem };

type MiniaturaProps = { categoria: Categoria; imagen?: string; className?: string };

/**
 * Miniatura del producto: foto con object-cover, radio suave (8 px) y borde nítido de 1 px.
 * Sin foto (o si no carga), el ícono de la categoría sobre bg/sunken. Es decorativa: el nombre va al lado.
 */
export function Miniatura({ categoria, imagen, className }: MiniaturaProps) {
  const [fallo, setFallo] = useState(false);
  const Icono = ICONO[categoria];
  return (
    <span
      aria-hidden
      className={cn("relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-sm border border-line-subtle bg-sunken", className)}
    >
      {imagen && !fallo ? (
        <Image src={imagen} alt="" fill sizes="48px" className="object-cover" onError={() => setFallo(true)} />
      ) : (
        <Icono strokeWidth={1.6} className="size-5 text-icon-subtle" />
      )}
    </span>
  );
}
