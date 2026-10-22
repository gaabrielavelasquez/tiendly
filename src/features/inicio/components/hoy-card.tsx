"use client";

import { Clock3 } from "lucide-react";
import { AnimatedNumber } from "@/components/motion/animated-number";
import { Card } from "@/components/ui";
import { cn } from "@/lib/cn";
import { formatoSoles } from "../lib/format";
import { Monto } from "./monto";

type HoyCardProps = { ventas: number; pedidos: number; corte: string; grano?: boolean; className?: string };

/**
 * "Hoy": la tarjeta protagonista del panel (decisiones 0020 y 0026). Ronda 4 de 0031, término medio:
 * degradado corto de cobalto a un cobalto apenas más hondo (`bg-hero-suave`, sin marino), filo superior de 1 px
 * en blanco al 25 % y sombra neutra corta (elevation/card), sin halo azul. Variante opcional con grano muy sutil.
 */
export function HoyCard({ ventas, pedidos, corte, grano = false, className }: HoyCardProps) {
  return (
    <Card
      as="section"
      aria-labelledby="hoy-titulo"
      className={cn("relative isolate flex flex-col gap-8 overflow-hidden border-0 bg-hero-suave text-fg-inverse shadow-card lg:p-8", className)}
    >
      <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-fg-inverse/25" />
      {grano && <span aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-grano opacity-40 mix-blend-overlay" />}
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
      <div aria-hidden className="flex items-end gap-6">
        <div className="flex flex-1 flex-col gap-2">
          <Monto valor={ventas} />
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
