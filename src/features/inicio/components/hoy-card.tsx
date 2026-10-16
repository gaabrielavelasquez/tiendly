"use client";

import { AnimatedNumber } from "@/components/motion/animated-number";
import { Badge, Card } from "@/components/ui";
import { cn } from "@/lib/cn";
import { formatoSoles } from "../lib/format";

type HoyCardProps = { ventas: number; pedidos: number; corte: string; className?: string };

/**
 * "Hoy": la tarjeta protagonista del panel. Fondo bg/inverse (negro carbón) con texto blanco y un
 * halo glow-sky en la esquina: contrasta con las tarjetas blancas sin usar el degradado cobalto,
 * que es solo del CTA (decisión 0019). El monto sube hasta su valor (Motion Primitives).
 */
export function HoyCard({ ventas, pedidos, corte, className }: HoyCardProps) {
  return (
    <Card
      as="section"
      aria-labelledby="hoy-titulo"
      className={cn("relative isolate flex flex-col gap-5 overflow-hidden border-inverse bg-inverse text-fg-inverse shadow-float", className)}
    >
      <div aria-hidden className="pointer-events-none absolute -top-1/2 -right-1/3 -z-10 size-full bg-orb-sky" />
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
        <div className="mt-auto flex items-center justify-between rounded-theme bg-fg-inverse/10 px-4 py-3">
          <span className="text-caption text-fg-inverse/70">Ticket promedio</span>
          <span className="text-body-sm font-bold tabular-nums">{formatoSoles(ventas / pedidos)}</span>
        </div>
      )}
      <p className="text-caption text-fg-inverse/70">Solo cuenta pedidos pagados.</p>
    </Card>
  );
}
