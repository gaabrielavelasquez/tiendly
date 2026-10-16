"use client";

import { AnimatedNumber } from "@/components/motion/animated-number";
import { Badge, Card } from "@/components/ui";
import { cn } from "@/lib/cn";
import { formatoSoles } from "../lib/format";

type HoyCardProps = { ventas: number; pedidos: number; corte: string; className?: string };

/**
 * "Hoy": la tarjeta protagonista del panel. Degradado gradient/hero (cobalto → marino → carbón),
 * filo interior de 1 px y radio de tarjeta (12 px). Es la única excepción a 0019 fuera del CTA
 * (decisión 0020). El monto sube hasta su valor (Motion Primitives).
 */
export function HoyCard({ ventas, pedidos, corte, className }: HoyCardProps) {
  return (
    <Card
      as="section"
      aria-labelledby="hoy-titulo"
      className={cn("relative flex flex-col gap-5 border-transparent bg-hero text-fg-inverse shadow-float ring-1 ring-fg-inverse/10 ring-inset", className)}
    >
      <div className="flex items-center justify-between gap-3">
        <h2 id="hoy-titulo" className="text-label font-bold tracking-widest text-fg-inverse/70 uppercase">
          Hoy
        </h2>
        <Badge className="bg-fg-inverse/10 text-fg-inverse">Hasta las {corte}</Badge>
      </div>
      <p className="sr-only">
        {formatoSoles(ventas)} vendidos en {pedidos} {pedidos === 1 ? "pedido" : "pedidos"}.
      </p>
      <div aria-hidden className="flex items-end gap-6">
        <div className="flex flex-1 flex-col gap-1.5">
          <AnimatedNumber value={ventas} format={formatoSoles} className="font-display-hero text-display leading-none tracking-tight lg:text-h1" />
          <span className="text-caption text-fg-inverse/70">vendidos</span>
        </div>
        <div className="flex flex-col gap-1.5 border-l border-fg-inverse/15 pl-6">
          <AnimatedNumber value={pedidos} className="font-display-hero text-h2 leading-none" />
          <span className="text-caption text-fg-inverse/70">{pedidos === 1 ? "pedido" : "pedidos"}</span>
        </div>
      </div>
      {pedidos > 0 && (
        <div className="mt-auto flex items-center justify-between rounded-sm bg-fg-inverse/10 px-4 py-2.5">
          <span className="text-caption text-fg-inverse/70">Ticket promedio</span>
          <span className="text-body-sm font-bold tabular-nums">{formatoSoles(ventas / pedidos)}</span>
        </div>
      )}
      <p className="text-caption text-fg-inverse/70">Solo cuenta pedidos pagados.</p>
    </Card>
  );
}
