"use client";

import { CircleAlert, CircleCheck } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";
import { motionTokens } from "@/styles/tokens";

export type TextoAviso = { texto: string; tono: "ok" | "error" } | null;

/** Aviso flotante del panel (el mismo del detalle de pedido): arriba de la barra inferior en móvil. role="status". */
export function Aviso({ aviso }: { aviso: TextoAviso }) {
  const reduce = useReducedMotion();
  const Icono = aviso?.tono === "error" ? CircleAlert : CircleCheck;
  return (
    <div role="status" className="pointer-events-none fixed inset-x-4 bottom-24 z-30 flex justify-center lg:inset-x-auto lg:right-8 lg:bottom-8">
      <AnimatePresence>
        {aviso && (
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: 12 }}
            transition={{ duration: motionTokens.durationFast, ease: [...motionTokens.easing] as [number, number, number, number] }}
            className="pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-card bg-inverse px-4 py-3 text-body-sm text-fg-inverse shadow-overlay"
          >
            <Icono aria-hidden strokeWidth={1.8} className="size-4 shrink-0" />
            <span className="flex-1">{aviso.texto}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
