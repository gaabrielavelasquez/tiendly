"use client";

import { Check } from "lucide-react";
import { Chip } from "@/components/ui";

type ChipsProps = { legend: string; opciones: string[]; elegidas: string[]; onAlternar: (v: string) => void; children?: React.ReactNode };

/**
 * Grupo de chips de selección múltiple. Elegido = negro carbón con texto blanco y check
 * (selection/*, decisión 0019), nunca cobalto. Cada chip es un botón de alternar (aria-pressed).
 */
export function ChipsOpciones({ legend, opciones, elegidas, onAlternar, children }: ChipsProps) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="pb-2 text-caption font-semibold text-fg-secondary">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {opciones.map((o) => {
          const elegida = elegidas.includes(o);
          return (
            <Chip key={o} selected={elegida} onClick={() => onAlternar(o)}>
              {elegida && <Check aria-hidden strokeWidth={2.4} className="size-3.5" />}
              {o}
            </Chip>
          );
        })}
        {children}
      </div>
    </fieldset>
  );
}
