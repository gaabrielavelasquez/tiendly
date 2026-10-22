"use client";

import { Pause } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";
import { Button } from "@/components/ui";
import { plural } from "@/lib/formato";
import { motionTokens } from "@/styles/tokens";

type BarraSeleccionProps = { cantidad: number; onPausar: () => void; onLimpiar: () => void };

/**
 * Acciones masivas (solo desktop, decisión 0027): aparece al marcar productos. Hoy pausa; aquí se suman las próximas
 * (publicar, cambiar precio, ajustar stock) sin rehacer la tabla.
 */
export function BarraSeleccion({ cantidad, onPausar, onLimpiar }: BarraSeleccionProps) {
  const reduce = useReducedMotion();
  return (
    <AnimatePresence initial={false}>
      {cantidad > 0 && (
        <motion.div
          initial={reduce ? false : { height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={reduce ? undefined : { height: 0, opacity: 0 }}
          transition={{ duration: motionTokens.durationFast, ease: [...motionTokens.easing] as [number, number, number, number] }}
          className="overflow-hidden border-b border-line-subtle bg-sunken"
        >
          <div role="region" aria-label="Acciones para los productos seleccionados" className="flex items-center gap-3 px-4 py-2 lg:px-6">
            <p className="flex-1 text-body-sm font-semibold text-fg" aria-live="polite">
              {plural(cantidad, "seleccionado", "seleccionados")}
            </p>
            <Button variant="ghost" size="sm" onClick={onLimpiar}>
              Quitar selección
            </Button>
            <Button variant="secondary" size="sm" onClick={onPausar}>
              <span className="flex items-center gap-1.5">
                <Pause aria-hidden strokeWidth={1.6} className="size-4" />
                Pausar
              </span>
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
