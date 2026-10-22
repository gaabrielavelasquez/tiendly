"use client";

import { Check } from "lucide-react";
import { motion } from "motion/react";
import { EncabezadoSeccion } from "@/components/panel";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";
import { Card } from "@/components/ui";
import { cn } from "@/lib/cn";
import { ESCALON, rapido } from "../lib/motion";
import type { Pendiente } from "../lib/reglas";
import { AccionCard } from "./accion-card";

type ParaAtenderProps = { filas: Pendiente[]; className?: string };

/**
 * "Para atender hoy" (decisión 0031): encabezado de sección y una fila de tarjetas de acción chicas
 * (apiladas en móvil). Atajos a las listas ya filtradas. Entrada escalonada (fade + y) que respeta "reducir movimiento".
 */
export function ParaAtender({ filas, className }: ParaAtenderProps) {
  const reduce = useReducedMotion();
  return (
    <section aria-labelledby="atender-titulo" className={cn("flex flex-col gap-4", className)}>
      <EncabezadoSeccion id="atender-titulo" titulo="Para atender hoy" />
      {filas.length === 0 ? (
        <Card className="flex items-center gap-4 p-5 lg:p-5">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-sunken">
            <Check aria-hidden strokeWidth={1.8} className="size-5 text-success" />
          </span>
          <p className="text-body-sm text-fg-secondary">
            <span className="font-medium text-fg">Todo al día.</span> No tienes pendientes.
          </p>
        </Card>
      ) : (
        <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {filas.map((f, i) => (
            <motion.li
              key={f.id}
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...rapido, delay: i * ESCALON }}
            >
              <AccionCard fila={f} />
            </motion.li>
          ))}
        </ul>
      )}
    </section>
  );
}
