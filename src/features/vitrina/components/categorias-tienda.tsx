"use client";

import { cn } from "@/lib/cn";
import type { Categoria } from "@/features/productos/types";

type CategoriasProps = { categorias: { id: Categoria; label: string }[]; valor: Categoria | "todos"; onCambio: (c: Categoria | "todos") => void };

/**
 * Categorías en pills que se desplazan con el dedo (sin barra y con snap), en todas las pantallas.
 * Activa en negro carbón (selection/*); el resto en blanco con borde de 1 px (border/subtle).
 * Pills aunque el tema Editorial sea de esquinas rectas: es un control, no una tarjeta.
 */
export function CategoriasTienda({ categorias, valor, onCambio }: CategoriasProps) {
  const opciones = [{ id: "todos" as const, label: "Todas" }, ...categorias];
  return (
    <div role="group" aria-label="Categorías" className="sin-scrollbar -mx-4 flex snap-x scroll-px-4 gap-2 overflow-x-auto px-4 py-1 lg:mx-0 lg:justify-center lg:px-0">
      {opciones.map((o) => {
        const activa = valor === o.id;
        return (
          <button
            key={o.id}
            type="button"
            aria-pressed={activa}
            onClick={() => onCambio(o.id)}
            className={cn(
              "relative flex h-9 shrink-0 snap-start items-center rounded-full border px-4 font-body text-body-sm transition-colors after:absolute after:inset-x-0 after:-inset-y-1 after:content-['']",
              activa ? "border-selected-border bg-selected text-on-selected" : "border-line-subtle bg-surface text-fg hover:border-line-strong",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
