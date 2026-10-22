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

// Un solo contenedor sereno (0031, ronda 4): sin borde de tarjeta ni sombra difusa, solo shadow-contenedor.
const CONTENEDOR = "overflow-hidden rounded-card bg-surface shadow-contenedor";

/**
 * "Para atender hoy" (decisión 0031, ronda 4): título fuera, y UN contenedor con divisores finos, en móvil y
 * desktop. Atajos a las listas ya filtradas. Entrada escalonada (fade + y) que respeta "reducir movimiento".
 */
export function ParaAtender({ filas, className }: ParaAtenderProps) {
  const reduce = useReducedMotion();
  return (
    <section aria-labelledby="atender-titulo" className={cn("flex flex-col gap-4", className)}>
      <EncabezadoSeccion id="atender-titulo" titulo="Para atender hoy" />
      {filas.length === 0 ? (
        <p className={cn(CONTENEDOR, "flex items-center gap-4 px-5 py-4 text-body-sm text-fg-secondary lg:px-6")}>
          <Check aria-hidden strokeWidth={1.5} className="size-5 shrink-0 text-icon" />
          <span>
            <span className="font-medium text-fg">Todo al día.</span> No tienes pendientes.
          </span>
        </p>
      ) : (
        <ul className={cn(CONTENEDOR, "flex flex-col divide-y divide-line-subtle")}>
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
