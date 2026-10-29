"use client";

import { AnimatedNumber } from "@/components/motion/animated-number";
import { cn } from "@/lib/cn";

// Tamaños del monto: la cifra manda; "S/" y los decimales van un escalón más chicos.
const TAMANO = {
  display: { cifra: "text-display", resto: "text-h3" },
  h2: { cifra: "text-h2", resto: "text-body" },
} as const;

type MontoProps = {
  valor: number;
  tamano?: keyof typeof TAMANO;
  /** `total`: SemiBold (font-metric), solo para totales. Por defecto, Medium: montos serenos al estilo Stripe. */
  total?: boolean;
  className?: string;
};

/**
 * Monto en soles (decisión 0031, ronda 4): peso Medium (SemiBold solo en totales), cifras tabulares,
 * "S/" más chico y atenuado, decimales atenuados. La parte entera sube al entrar (AnimatedNumber, respeta
 * "reducir movimiento"). Es solo visual: quien lo usa pone el texto completo para lectores de pantalla.
 */
export function Monto({ valor, tamano = "display", total = false, className }: MontoProps) {
  const centimos = Math.round(valor * 100);
  const entero = Math.trunc(centimos / 100);
  const decimales = String(Math.abs(centimos % 100)).padStart(2, "0");
  const t = TAMANO[tamano];
  return (
    <span
      aria-hidden
      className={cn("inline-flex items-baseline leading-none tracking-tight tabular-nums", total ? "font-metric" : "font-display-light", className)}
    >
      <span className={cn("mr-1.5 opacity-60", t.resto)}>S/</span>
      <AnimatedNumber value={entero} className={t.cifra} />
      {centimos % 100 !== 0 && <span className={cn("opacity-50", t.resto)}>.{decimales}</span>}
    </span>
  );
}
