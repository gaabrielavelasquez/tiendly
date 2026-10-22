"use client";

import { Check } from "lucide-react";
import { motion } from "motion/react";
import { EncabezadoSeccion } from "@/components/panel";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";
import { cn } from "@/lib/cn";
import { ESCALON, rapido } from "../lib/motion";
import type { Pendiente } from "../lib/reglas";
import { FilaPendiente } from "./fila-pendiente";

type ParaAtenderProps = { filas: Pendiente[]; className?: string };

/**
 * "Para atender hoy" (decisión 0031, ronda 4): lista con divisores finos, sin tarjetas ni sombras, en móvil y
 * desktop. Atajos a las listas ya filtradas. Entrada escalonada (fade + y) que respeta "reducir movimiento".
 */
export function ParaAtender({ filas, className }: ParaAtenderProps) {
  const reduce = useReducedMotion();
  return (
    <section aria-labelledby="atender-titulo" className={cn("flex flex-col gap-2", className)}>
      <EncabezadoSeccion id="atender-titulo" titulo="Para atender hoy" />
      {filas.length === 0 ? (
        <p className="flex items-center gap-4 py-4 text-body-sm text-fg-secondary">
          <Check aria-hidden strokeWidth={1.6} className="size-5 shrink-0 text-success" />
          <span>
            <span className="font-medium text-fg">Todo al día.</span> No tienes pendientes.
          </span>
        </p>
      ) : (
        <ul className="flex flex-col divide-y divide-line-subtle">
          {filas.map((f, i) => (
            <motion.li
              key={f.id}
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...rapido, delay: i * ESCALON }}
            >
              <FilaPendiente fila={f} />
            </motion.li>
          ))}
        </ul>
      )}
    </section>
  );
}
