import { ShoppingBag } from "lucide-react";
import { cn } from "@/lib/cn";
import type { Tema } from "../lib/rubros";

type MiniTiendaProps = { nombre: string; slug: string; tema: Tema; className?: string };

/**
 * Vista previa de la tienda. Usa data-theme, así que toma la tipografía, el radio y el acento
 * del tema elegido sin escribir un solo valor (colección Brand).
 */
export function MiniTienda({ nombre, slug, tema, className }: MiniTiendaProps) {
  return (
    <div
      data-theme={tema}
      className={cn("flex w-44 flex-col gap-2 rounded-card bg-surface p-3 shadow-card lg:w-56", className)}
    >
      <div className="flex aspect-[6/5] items-center justify-center rounded-theme bg-highlight">
        <ShoppingBag aria-hidden className="size-10 text-icon-subtle" />
      </div>
      <p className="truncate font-display-title text-h3 text-fg">{nombre || "Tu tienda"}</p>
      <p className="truncate text-label text-fg-secondary">tiendly.pe/{slug || "tu-tienda"}</p>
    </div>
  );
}
