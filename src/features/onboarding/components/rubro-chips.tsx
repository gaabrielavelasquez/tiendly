"use client";

import { Chip } from "@/components/ui";
import { RUBROS, type RubroId } from "../lib/rubros";

type RubroChipsProps = { value: RubroId | null; onChange: (r: RubroId) => void; error?: string };

/** "¿Qué vendes?": define el tema por defecto de la tienda. */
export function RubroChips({ value, onChange, error }: RubroChipsProps) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-2 text-body-sm font-semibold text-fg">¿Qué vendes?</legend>
      <div className="flex flex-wrap gap-2">
        {RUBROS.map((r) => (
          <Chip key={r.id} selected={value === r.id} onClick={() => onChange(r.id)}>
            {r.label}
          </Chip>
        ))}
      </div>
      {error && <p className="text-caption text-error">{error}</p>}
    </fieldset>
  );
}
