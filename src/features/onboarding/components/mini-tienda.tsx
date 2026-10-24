import { ShoppingBag } from "lucide-react";
import { cn } from "@/lib/cn";
import type { Tema } from "../lib/rubros";

type MiniTiendaProps = { nombre: string; slug: string; tema: Tema; className?: string };

const PRODUCTOS = ["S/ 89", "S/ 120"];

/**
 * Vista previa de la tienda. Usa data-theme, así que toma la tipografía, el radio y el acento
 * del tema elegido sin escribir un solo valor (colección Brand).
 */
export function MiniTienda({ nombre, slug, tema, className }: MiniTiendaProps) {
  return (
    <div data-theme={tema} className={cn("flex w-56 flex-col gap-3 rounded-card bg-surface p-3 text-left shadow-card lg:w-64", className)}>
      <div className="flex items-center justify-between gap-2">
        <p className="truncate font-display-title text-body-lg text-fg">{nombre || "Tu tienda"}</p>
        <ShoppingBag aria-hidden strokeWidth={1.6} className="size-5 shrink-0 text-icon" />
      </div>
      <div className="flex aspect-video items-end rounded-theme bg-highlight p-2.5">
        <span className="rounded-chip bg-surface px-2 py-0.5 text-label font-semibold text-fg shadow-card">Novedades</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {PRODUCTOS.map((precio) => (
          <div key={precio} className="flex flex-col gap-1.5">
            <div className="aspect-square rounded-theme bg-sunken" />
            <span className="h-1.5 w-3/4 rounded-full bg-skeleton" />
            <span className="text-label font-semibold text-fg">{precio}</span>
          </div>
        ))}
      </div>
      <p className="truncate text-label text-fg-secondary">tiendly.pe/{slug || "tu-tienda"}</p>
    </div>
  );
}
