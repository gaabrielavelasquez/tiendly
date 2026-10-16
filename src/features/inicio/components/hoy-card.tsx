"use client";

import { AnimatedNumber } from "@/components/motion/animated-number";
import { Badge, Card } from "@/components/ui";
import { cn } from "@/lib/cn";
import { formatoSoles } from "../lib/format";

type HoyCardProps = { ventas: number; pedidos: number; corte: string; className?: string };

/**
 * "Hoy": la cifra principal del panel. Tarjeta blanca elevada con halo glow-sky (en vez de un
 * fondo plano) y el monto que sube hasta su valor (Motion Primitives · animated-number).
 */
export function HoyCard({ ventas, pedidos, corte, className }: HoyCardProps) {
  return (
    <Card as="section" aria-labelledby="hoy-titulo" className={cn("relative isolate flex flex-col gap-4 overflow-hidden", className)}>
      <div aria-hidden className="pointer-events-none absolute -top-1/2 -right-1/3 -z-10 size-full bg-orb-sky" />
      <div className="flex items-center justify-between gap-3">
        <h2 id="hoy-titulo" className="text-label font-bold tracking-widest text-fg-secondary uppercase">
          Hoy
        </h2>
        <Badge>Hasta las {corte}</Badge>
      </div>
      <p className="sr-only">
        {formatoSoles(ventas)} vendidos en {pedidos} {pedidos === 1 ? "pedido" : "pedidos"}.
      </p>
      <div aria-hidden className="flex items-end gap-6">
        <div className="flex flex-1 flex-col gap-1">
          <AnimatedNumber value={ventas} format={formatoSoles} className="font-display-hero text-display leading-none tracking-tight text-fg lg:text-h1" />
          <span className="text-caption text-fg-secondary">vendidos</span>
        </div>
        <div className="flex flex-col gap-1 border-l border-line-subtle pl-6">
          <AnimatedNumber value={pedidos} className="font-display-hero text-h2 leading-none text-fg" />
          <span className="text-caption text-fg-secondary">{pedidos === 1 ? "pedido" : "pedidos"}</span>
        </div>
      </div>
      {pedidos > 0 && (
        <div className="mt-auto flex items-center justify-between rounded-theme bg-sunken px-3 py-2.5">
          <span className="text-caption text-fg-secondary">Ticket promedio</span>
          <span className="text-body-sm font-bold text-fg tabular-nums">{formatoSoles(ventas / pedidos)}</span>
        </div>
      )}
      <p className="text-caption text-fg-secondary">Solo cuenta pedidos pagados.</p>
    </Card>
  );
}
