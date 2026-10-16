"use client";

import { Check } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Chip } from "@/components/ui";
import { motionTokens } from "@/styles/tokens";
import { alternarRubro, RUBROS, type RubroId } from "../lib/rubros";

type RubroChipsProps = { value: RubroId[]; onChange: (r: RubroId[]) => void; error?: string };

const transicion = { duration: motionTokens.durationFast, ease: [...motionTokens.easing] as [number, number, number, number] };

/** "¿Qué vendes?": selección múltiple. Cada chip es un botón de alternar (aria-pressed) con check al elegirlo. */
export function RubroChips({ value, onChange, error }: RubroChipsProps) {
  const reduce = useReducedMotion();
  return (
    <fieldset className="flex flex-col gap-2" aria-describedby="rubros-ayuda">
      <legend className="text-body-sm font-semibold text-fg">¿Qué vendes?</legend>
      <p id="rubros-ayuda" className="text-caption text-fg-secondary">
        Elige todas las que apliquen.
      </p>
      <div className="flex flex-wrap gap-2 pt-1">
        {RUBROS.map((r) => {
          const elegido = value.includes(r.id);
          return (
            <Chip key={r.id} selected={elegido} onClick={() => onChange(alternarRubro(value, r.id))}>
              <AnimatePresence initial={false}>
                {elegido && (
                  <motion.span
                    className="flex overflow-hidden"
                    initial={reduce ? false : { width: 0, opacity: 0 }}
                    animate={{ width: "auto", opacity: 1 }}
                    exit={reduce ? undefined : { width: 0, opacity: 0 }}
                    transition={transicion}
                  >
                    <Check aria-hidden strokeWidth={2.4} className="size-4" />
                  </motion.span>
                )}
              </AnimatePresence>
              {r.label}
            </Chip>
          );
        })}
      </div>
      {error && <p className="text-caption text-error">{error}</p>}
    </fieldset>
  );
}
