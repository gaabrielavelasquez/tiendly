"use client";

import { cn } from "@/lib/cn";
import type { Categoria } from "@/features/productos/types";

type CategoriasProps = { categorias: { id: Categoria; label: string }[]; valor: Categoria | "todos"; onCambio: (c: Categoria | "todos") => void };

/**
 * Categorías en móvil (en desktop van en la cabecera): pestañas de texto con subrayado, como el
 * resto del tema Editorial. Fila que se desplaza con el dedo, sin barra visible y con snap.
 */
export function CategoriasTienda({ categorias, valor, onCambio }: CategoriasProps) {
  const opciones = [{ id: "todos" as const, label: "Todos" }, ...categorias];
  return (
    <div role="group" aria-label="Categorías" className="sin-scrollbar -mx-4 flex snap-x scroll-px-4 gap-6 overflow-x-auto border-b border-line-subtle px-4 lg:hidden">
      {opciones.map((o) => {
        const activa = valor === o.id;
        return (
          <button
            key={o.id}
            type="button"
            aria-pressed={activa}
            onClick={() => onCambio(o.id)}
            className={cn(
              "-mb-px flex h-11 shrink-0 snap-start items-center border-b-2 text-body-sm transition-colors",
              activa ? "border-fg text-fg" : "border-transparent text-fg-secondary",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
