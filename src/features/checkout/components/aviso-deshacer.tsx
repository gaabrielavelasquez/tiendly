"use client";

import { AnimatePresence, motion } from "motion/react";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";
import { motionTokens } from "@/styles/tokens";

const ease = [...motionTokens.easing] as [number, number, number, number];

/** Aviso con "Deshacer" (Figma C2). role="status": el lector lo anuncia. */
export function AvisoDeshacer({ texto, onDeshacer }: { texto: string | null; onDeshacer: () => void }) {
  const reduce = useReducedMotion();
  return (
    <div role="status" className="pointer-events-none fixed inset-x-4 bottom-40 z-30 flex justify-center lg:inset-x-auto lg:right-8 lg:bottom-8">
      <AnimatePresence>
        {texto && (
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: 12 }}
            transition={{ duration: motionTokens.durationFast, ease }}
            className="pointer-events-auto flex w-full max-w-sm items-center justify-between gap-4 bg-inverse py-2 pr-2 pl-4 text-body-sm text-fg-inverse shadow-overlay"
          >
            <span>{texto}</span>
            <button type="button" onClick={onDeshacer} className="h-9 shrink-0 px-3 font-semibold text-fg-inverse underline-offset-4 hover:underline">
              Deshacer
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
