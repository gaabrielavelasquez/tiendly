"use client";

import { motion } from "motion/react";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";
import { cn } from "@/lib/cn";
import type { Paso, PasoId } from "../types";
import { crecer, ESCALON } from "../lib/motion";

const CORTO: Record<PasoId, string> = { producto: "Producto", pagos: "Pagos", entregas: "Entregas", compartir: "Compartir" };

type ProgresoLinealProps = { pasos: Paso[]; siguiente?: PasoId; etiquetaId: string };

/**
 * Seguimiento lineal de la configuración: un segmento por paso. Hechos en indicator/fill (DESIGN.md §4),
 * el siguiente con un tinte suave y todo en verde al completar. Los segmentos se llenan escalonados.
 */
export function ProgresoLineal({ pasos, siguiente, etiquetaId }: ProgresoLinealProps) {
  const reduce = useReducedMotion();
  const hechos = pasos.filter((p) => p.hecho).length;
  const completo = hechos === pasos.length;
  const pct = Math.round((hechos / pasos.length) * 100);

  return (
    <div className="flex flex-col gap-2">
      <div
        role="progressbar"
        aria-labelledby={etiquetaId}
        aria-valuemin={0}
        aria-valuemax={pasos.length}
        aria-valuenow={hechos}
        aria-valuetext={`${hechos} de ${pasos.length} listos, ${pct} %`}
        className="flex items-center gap-4"
      >
        <div className="grid flex-1 grid-cols-4 gap-1.5">
          {pasos.map((p, i) => (
            <div key={p.id} className="h-2 overflow-hidden rounded-full bg-sunken">
              {(p.hecho || p.id === siguiente) && (
                <motion.div
                  className={cn("h-full rounded-full", completo ? "bg-success" : p.hecho ? "bg-indicator" : "bg-indicator/20")}
                  style={{ originX: 0 }}
                  initial={reduce ? false : { scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ ...crecer, delay: i * ESCALON }}
                />
              )}
            </div>
          ))}
        </div>
        <span className="w-10 text-right text-body-sm font-bold text-fg tabular-nums">{pct} %</span>
      </div>
      <ol aria-hidden className="grid grid-cols-4 gap-1.5 pr-14">
        {pasos.map((p) => (
          <li
            key={p.id}
            className={cn(
              "truncate text-label",
              p.hecho ? "text-fg" : p.id === siguiente ? "font-bold text-fg" : "text-fg-secondary",
            )}
          >
            {CORTO[p.id]}
          </li>
        ))}
      </ol>
    </div>
  );
}
