"use client";

import { AnimatePresence, motion } from "motion/react";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";
import { motionTokens } from "@/styles/tokens";
import type { Aviso } from "../hooks/use-catalogo";

const ease = [...motionTokens.easing] as [number, number, number, number];

/** Aviso tras una acción en lote (pausar, poner o quitar oferta), con "Deshacer". role="status": el lector lo anuncia. */
export function AvisoDeshacer({ aviso, onDeshacer }: { aviso: Aviso | null; onDeshacer: () => void }) {
  const reduce = useReducedMotion();
  return (
    <div role="status" className="pointer-events-none fixed inset-x-4 bottom-20 z-30 flex justify-center lg:inset-x-auto lg:right-8 lg:bottom-8">
      <AnimatePresence>
        {aviso && (
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: 12 }}
            transition={{ duration: motionTokens.durationFast, ease }}
            className="pointer-events-auto flex w-full max-w-sm items-center justify-between gap-4 rounded-card bg-inverse py-2 pr-2 pl-4 text-body-sm text-fg-inverse shadow-overlay"
          >
            <span>{aviso.texto}</span>
            <button
              type="button"
              onClick={onDeshacer}
              className="h-9 shrink-0 rounded-theme px-3 font-semibold text-fg-inverse transition-colors hover:bg-fg-inverse/10"
            >
              Deshacer
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
