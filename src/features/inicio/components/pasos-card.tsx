"use client";

import { motion, useReducedMotion } from "motion/react";
import { Card } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { Paso } from "../types";
import { crecer } from "../lib/motion";
import { progresoPasos } from "../lib/reglas";
import { PasoFila } from "./paso-fila";

type PasosCardProps = { pasos: Paso[]; className?: string };

/** "Pasos para arrancar tu tienda": progreso en indicator/fill (DESIGN.md §4) y los 4 pasos. */
export function PasosCard({ pasos, className }: PasosCardProps) {
  const reduce = useReducedMotion();
  const { hechos, total, mensaje, siguiente } = progresoPasos(pasos);
  const completo = hechos === total;

  return (
    <Card as="section" aria-labelledby="pasos-titulo" className={cn("flex flex-col", className)}>
      <div className="flex flex-col gap-2 pb-3">
        <h2 id="pasos-titulo" className="text-body font-bold text-fg">
          Pasos para arrancar tu tienda
        </h2>
        <p className="text-caption text-fg-secondary">
          <strong className="font-bold text-fg">
            {hechos} de {total} listos
          </strong>{" "}
          · {mensaje}
        </p>
        <div
          role="progressbar"
          aria-labelledby="pasos-titulo"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={hechos}
          aria-valuetext={`${hechos} de ${total} listos`}
          className="h-2 overflow-hidden rounded-full bg-line"
        >
          <motion.div
            className={cn("h-full rounded-full", completo ? "bg-success" : "bg-indicator")}
            style={{ width: `${(hechos / total) * 100}%`, originX: 0 }}
            initial={reduce ? false : { scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={crecer}
          />
        </div>
      </div>
      <ul className="flex flex-col">
        {pasos.map((p, i) => (
          <PasoFila
            key={p.id}
            paso={p}
            destacado={p.id === siguiente}
            separador={p.id !== siguiente && pasos[i - 1]?.id !== siguiente}
          />
        ))}
      </ul>
    </Card>
  );
}
