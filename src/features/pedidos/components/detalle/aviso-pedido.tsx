"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";
import { motionTokens } from "@/styles/tokens";

/** Ocho segundos de lectura efectiva: hover y foco pausan el tiempo restante por separado. */
export function AvisoPedido({ texto, onCerrar, onDeshacer }: { texto: string; onCerrar: () => void; onDeshacer?: () => void }) {
  const restante = useRef(8000);
  const [hover, setHover] = useState(false);
  const [foco, setFoco] = useState(false);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (hover || foco) return;
    const inicio = performance.now();
    const timer = window.setTimeout(onCerrar, restante.current);
    return () => { window.clearTimeout(timer); restante.current = Math.max(0, restante.current - (performance.now() - inicio)); };
  }, [hover, foco, onCerrar]);
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      exit={reduce ? undefined : { opacity: 0, y: 12 }}
      transition={{ duration: motionTokens.durationFast, ease: [...motionTokens.easing] as [number, number, number, number] }}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      onFocusCapture={() => setFoco(true)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFoco(false); }}
      className="pointer-events-auto flex w-full max-w-sm items-center justify-between gap-4 rounded-card bg-inverse py-2 pr-2 pl-4 text-body-sm text-fg-inverse shadow-overlay"
    >
      <span className="min-w-0 break-words">{texto}</span>
      {onDeshacer && <button type="button" onClick={onDeshacer} className="h-9 shrink-0 rounded-theme px-3 font-semibold hover:bg-fg-inverse/10">Deshacer</button>}
    </motion.div>
  );
}
