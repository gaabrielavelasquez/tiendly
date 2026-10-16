"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";
import type { DiaVentas } from "../types";
import { fechaDia, formatoSoles } from "../lib/format";
import { crecer, ESCALON } from "../lib/motion";

const INICIALES = ["L", "M", "M", "J", "V", "S", "D"];
const pedidosTexto = (n: number) => `${n} ${n === 1 ? "pedido" : "pedidos"}`;

type SemanaGraficoProps = { dias: DiaVentas[]; hoy: string };

/**
 * Barras por día, lunes a domingo, sin ejes ni montos (no recarga el celular).
 * Hoy va en indicator/fill (negro carbón), nunca en cobalto. Con mouse o teclado se ve el detalle.
 */
export function SemanaGrafico({ dias, hoy }: SemanaGraficoProps) {
  const reduce = useReducedMotion();
  const max = Math.max(1, ...dias.map((d) => d.monto ?? 0));

  return (
    <ul aria-label="Ventas por día" className="flex items-end gap-2 pt-2">
      {dias.map((d, i) => {
        const esHoy = d.fecha === hoy;
        const sinVentas = !d.monto;
        const alto = sinVentas ? 0 : Math.max(4, (d.monto! / max) * 100);
        const detalle = d.monto === null ? "todavía no llega" : `${formatoSoles(d.monto)} · ${pedidosTexto(d.pedidos)}`;
        return (
          <li key={d.fecha} className="flex h-27.5 flex-1 flex-col items-center gap-1.5 lg:h-40">
            <div
              tabIndex={0}
              role="img"
              aria-label={`${fechaDia(d.fecha, true)}${esHoy ? " (hoy)" : ""}: ${detalle}.`}
              className="group relative flex w-full flex-1 items-end justify-center rounded-sm"
            >
              {sinVentas ? (
                <div className="h-1 w-6 rounded-t-sm bg-line-subtle lg:h-1.5 lg:w-12" />
              ) : (
                <motion.div
                  className={cn("w-6 rounded-t-sm lg:w-12", esHoy ? "bg-indicator" : "bg-chart")}
                  style={{ height: `${alto}%`, originY: 1 }}
                  initial={reduce ? false : { scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ ...crecer, delay: i * ESCALON }}
                />
              )}
              <span
                aria-hidden
                style={{ bottom: `calc(${alto}% + var(--tl-space-2))` }}
                className="pointer-events-none absolute left-1/2 z-10 hidden -translate-x-1/2 whitespace-nowrap rounded-sm bg-inverse px-2 py-1 text-label text-fg-inverse shadow-float group-focus-visible:block lg:group-hover:block"
              >
                {fechaDia(d.fecha)} · {detalle}
              </span>
            </div>
            <span aria-hidden className={cn("text-label", esHoy ? "font-bold text-fg" : "text-fg-secondary")}>
              {INICIALES[i]}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
