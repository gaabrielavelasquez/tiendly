"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";
import type { DiaVentas } from "../types";
import { fechaDia, formatoSoles } from "../lib/format";
import { crecer, ESCALON } from "../lib/motion";

const INICIALES = ["L", "M", "M", "J", "V", "S", "D"];
const pedidosTexto = (n: number) => `${n} ${n === 1 ? "pedido" : "pedidos"}`;
// Mínimo visible para que una venta chica siga leyéndose como píldora y no como punto.
const ALTO_MINIMO = 12;

type SemanaGraficoProps = { dias: DiaVentas[]; hoy: string };

/**
 * Barras por día en píldora sobre un riel suave, lunes a domingo, sin ejes ni montos.
 * Degradado del mismo token (chart/bar); hoy en cobalto (accent/base, decisión 0020).
 * Con mouse o teclado se ve el detalle del día.
 */
export function SemanaGrafico({ dias, hoy }: SemanaGraficoProps) {
  const reduce = useReducedMotion();
  const max = Math.max(1, ...dias.map((d) => d.monto ?? 0));

  return (
    <ul aria-label="Ventas por día" className="flex items-end gap-1 pt-4 lg:gap-3">
      {dias.map((d, i) => {
        const esHoy = d.fecha === hoy;
        const alto = d.monto ? Math.max(ALTO_MINIMO, (d.monto / max) * 100) : 0;
        const detalle = d.monto === null ? "todavía no llega" : `${formatoSoles(d.monto)} · ${pedidosTexto(d.pedidos)}`;
        return (
          <li key={d.fecha} className="flex flex-1 flex-col items-center gap-2">
            <div
              tabIndex={0}
              role="img"
              aria-label={`${fechaDia(d.fecha, true)}${esHoy ? " (hoy)" : ""}: ${detalle}.`}
              className="group relative flex h-32 w-full justify-center rounded-theme lg:h-48"
            >
              <div className="relative h-full w-7 overflow-hidden rounded-full bg-sunken lg:w-11">
                {alto > 0 && (
                  <motion.div
                    className={cn("absolute inset-x-0 bottom-0 rounded-full", esHoy ? "bg-bar-today shadow-float" : "bg-bar")}
                    style={{ height: `${alto}%`, originY: 1 }}
                    initial={reduce ? false : { scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ ...crecer, delay: i * ESCALON }}
                  />
                )}
              </div>
              <span
                aria-hidden
                style={{ bottom: `calc(${alto}% + var(--tl-space-2))` }}
                className="pointer-events-none absolute left-1/2 z-10 hidden -translate-x-1/2 rounded-sm bg-inverse px-2.5 py-1.5 text-label font-semibold whitespace-nowrap text-fg-inverse shadow-float group-focus-visible:block lg:group-hover:block"
              >
                {fechaDia(d.fecha)} · {detalle}
              </span>
            </div>
            <span
              aria-hidden
              className={cn(
                "flex h-6 min-w-6 items-center justify-center rounded-chip px-1.5 text-label",
                esHoy ? "bg-accent font-bold text-on-accent" : "text-fg-secondary",
              )}
            >
              {INICIALES[i]}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
