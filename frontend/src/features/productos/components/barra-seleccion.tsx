"use client";

import { Pause, Tag } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";
import { Button } from "@/components/ui";
import { plural } from "@/lib/formato";
import { motionTokens } from "@/styles/tokens";

type BarraSeleccionProps = { cantidad: number; conOferta: number; onPausar: () => void; onQuitarOferta: () => void; onPonerEnOferta: () => void; onLimpiar: () => void };

/**
 * Acciones en lote en desktop (0027 y 0034): aparece al marcar productos. Pausar, Quitar oferta (si alguno tiene) y
 * Poner en oferta. En móvil, la barra fija de abajo (BarraSeleccionMovil).
 */
export function BarraSeleccion({ cantidad, conOferta, onPausar, onQuitarOferta, onPonerEnOferta, onLimpiar }: BarraSeleccionProps) {
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
            <Button variant="secondary" size="sm" onClick={onQuitarOferta} disabled={!conOferta}>
              Quitar oferta
            </Button>
            <Button variant="secondary" size="sm" onClick={onPonerEnOferta}>
              <span className="flex items-center gap-1.5">
                <Tag aria-hidden strokeWidth={1.6} className="size-4" />
                Poner en oferta
              </span>
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
