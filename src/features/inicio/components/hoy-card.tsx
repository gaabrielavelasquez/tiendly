"use client";

import { Clock3 } from "lucide-react";
import { AnimatedNumber } from "@/components/motion/animated-number";
import { Card } from "@/components/ui";
import { cn } from "@/lib/cn";
import { formatoSoles } from "../lib/format";

type HoyCardProps = { ventas: number; pedidos: number; corte: string; className?: string };

/**
 * "Hoy": la tarjeta protagonista del panel. Degradado gradient/hero (cobalto → azul medianoche),
 * filo interior de 1 px al 15 % y radio de tarjeta (decisiones 0020 y 0026). Halo suave elevation/celebration
 * y cifra más grande (0031). El monto sube hasta su valor (Motion Primitives) y respeta "reducir movimiento".
 */
export function HoyCard({ ventas, pedidos, corte, className }: HoyCardProps) {
  return (
    <Card
      as="section"
      aria-labelledby="hoy-titulo"
      className={cn(
        "relative flex flex-col gap-8 border-transparent bg-hero text-fg-inverse shadow-celebration ring-1 ring-fg-inverse/15 ring-inset lg:p-10",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <h2 id="hoy-titulo" className="text-label font-medium tracking-widest text-fg-inverse/70 uppercase">
          Hoy
        </h2>
        <span className="flex items-center gap-1.5 text-caption text-fg-inverse/70">
          <Clock3 aria-hidden strokeWidth={1.6} className="size-3.5" />
          Hasta las {corte}
        </span>
      </div>
      <p className="sr-only">
        {formatoSoles(ventas)} vendidos en {pedidos} {pedidos === 1 ? "pedido" : "pedidos"}.
      </p>
      {/* En desktop la tarjeta toma el alto de "Esta semana": la cifra se centra en ese alto. */}
      <div aria-hidden className="flex items-end gap-6 lg:my-auto">
        <div className="flex flex-1 flex-col gap-2">
          <AnimatedNumber value={ventas} format={formatoSoles} className="font-metric text-display leading-none" />
          <span className="text-caption text-fg-inverse/70">vendidos</span>
        </div>
        <div className="flex flex-col gap-2 border-l border-fg-inverse/15 pl-6">
          <AnimatedNumber value={pedidos} className="font-metric text-h3 leading-none" />
          <span className="text-caption text-fg-inverse/70">{pedidos === 1 ? "pedido" : "pedidos"}</span>
        </div>
      </div>
      <p className="text-caption text-fg-inverse/70">Solo cuenta pedidos pagados.</p>
    </Card>
  );
}
