"use client";

import { Chip } from "@/components/ui";
import { cn } from "@/lib/cn";

export type OpcionFiltro<T extends string> = { id: T; label: string };

type FiltrosProps<T extends string> = {
  etiqueta: string;
  opciones: OpcionFiltro<T>[];
  valor: T;
  conteos: Record<T, number>;
  onCambio: (f: T) => void;
};

/** Filtros rápidos a la vista (no en un menú), con conteo. Seleccionado en selection/* (negro carbón, 0019). */
export function FiltrosRapidos<T extends string>({ etiqueta, opciones, valor, conteos, onCambio }: FiltrosProps<T>) {
  return (
    <div role="group" aria-label={etiqueta} className="-mx-4 flex gap-2 overflow-x-auto px-4 py-2 lg:mx-0 lg:px-0">
      {opciones.map((o) => {
        const activo = valor === o.id;
        return (
          <Chip key={o.id} selected={activo} onClick={() => onCambio(o.id)} className="shrink-0">
            {o.label}
            <span className={cn("tabular-nums", activo ? "text-on-selected/70" : "text-fg-secondary")}>{conteos[o.id]}</span>
          </Chip>
        );
      })}
    </div>
  );
}
