import { Footprints, Gem, ShoppingBag, Shirt, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import type { Categoria } from "../types";

const ICONO: Record<Categoria, LucideIcon> = { ropa: Shirt, calzado: Footprints, accesorios: ShoppingBag, joyeria: Gem };

/**
 * Miniatura del producto: radio suave (8 px) y borde de 1 px. Mientras no haya fotos,
 * muestra el ícono de la categoría sobre bg/sunken.
 */
export function Miniatura({ categoria, className }: { categoria: Categoria; className?: string }) {
  const Icono = ICONO[categoria];
  return (
    <span aria-hidden className={cn("flex size-12 shrink-0 items-center justify-center rounded-sm border border-line-subtle bg-sunken", className)}>
      <Icono strokeWidth={1.6} className="size-5 text-icon-subtle" />
    </span>
  );
}
