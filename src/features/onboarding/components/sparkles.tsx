"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";

// Posiciones relativas (en %) y tamaños tipográficos: decorativo, sin valores en px.
const DESTELLOS = [
  { top: "4%", left: "6%", size: "text-h2" },
  { top: "14%", left: "88%", size: "text-body-lg" },
  { top: "62%", left: "2%", size: "text-body" },
  { top: "78%", left: "92%", size: "text-h3" },
  { top: "40%", left: "96%", size: "text-caption" },
  { top: "90%", left: "14%", size: "text-label" },
] as const;

/** Destellos ✦ de celebración. Color de indicador (negro carbón en Tiendly, decisión 0019). */
export function Sparkles({ count = 6, className }: { count?: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0", className)}>
      {DESTELLOS.slice(0, count).map((d, i) => (
        <motion.span
          key={i}
          className={cn("absolute text-indicator", d.size)}
          style={{ top: d.top, left: d.left }}
          initial={reduce ? false : { opacity: 0, scale: 0.4 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 + i * 0.07, type: "spring", stiffness: 260, damping: 18 }}
        >
          ✦
        </motion.span>
      ))}
    </div>
  );
}
