"use client";

import { Chip } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { Filtro } from "../types";

const OPCIONES: { id: Filtro; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "activos", label: "Activos" },
  { id: "bajo-stock", label: "Bajo stock" },
  { id: "agotados", label: "Agotados" },
];

type FiltrosProps = { valor: Filtro; conteos: Record<Filtro, number>; onCambio: (f: Filtro) => void };

/** Filtros rápidos a la vista (no en un menú). Seleccionado en selection/* (negro carbón, 0019). */
export function Filtros({ valor, conteos, onCambio }: FiltrosProps) {
  return (
    <div role="group" aria-label="Filtrar productos" className="-mx-4 flex gap-2 overflow-x-auto px-4 py-2 lg:mx-0 lg:px-0">
      {OPCIONES.map((o) => {
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
