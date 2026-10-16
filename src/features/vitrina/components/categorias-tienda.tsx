"use client";

import { Chip } from "@/components/ui";
import type { Categoria } from "@/features/productos/types";

type CategoriasProps = { categorias: { id: Categoria; label: string }[]; valor: Categoria | "todos"; onCambio: (c: Categoria | "todos") => void };

/**
 * Categorías en una fila que se desplaza con el dedo (sin barra visible y con snap).
 * La activa en negro carbón (selection/*). Sale de borde a borde en móvil.
 */
export function CategoriasTienda({ categorias, valor, onCambio }: CategoriasProps) {
  const opciones = [{ id: "todos" as const, label: "Todos" }, ...categorias];
  return (
    <nav aria-label="Categorías" className="sin-scrollbar -mx-4 flex snap-x scroll-px-4 gap-2 overflow-x-auto px-4 py-3">
      {opciones.map((o) => (
        <Chip key={o.id} selected={valor === o.id} onClick={() => onCambio(o.id)} className="shrink-0 snap-start">
          {o.label}
        </Chip>
      ))}
    </nav>
  );
}
