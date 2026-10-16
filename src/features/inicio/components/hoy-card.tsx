"use client";

import { AnimatedNumber } from "@/components/motion/animated-number";
import { Card } from "@/components/ui";
import { cn } from "@/lib/cn";
import { formatoSoles } from "../lib/format";

type HoyCardProps = { ventas: number; pedidos: number; corte: string; className?: string };

const cifra = "font-display-hero text-h1 leading-tight text-fg lg:text-h2";

/** "Hoy": ventas y pedidos del día. El monto sube hasta su valor (Motion Primitives · animated-number). */
export function HoyCard({ ventas, pedidos, corte, className }: HoyCardProps) {
  return (
    <Card as="section" aria-labelledby="hoy-titulo" className={cn("flex flex-col gap-3 border-accent-subtle bg-accent-subtle", className)}>
      <h2 id="hoy-titulo" className="text-label font-bold uppercase tracking-widest text-fg-secondary">
        Hoy
      </h2>
      <p className="sr-only">
        {formatoSoles(ventas)} vendidos en {pedidos} {pedidos === 1 ? "pedido" : "pedidos"}.
      </p>
      <div aria-hidden className="flex items-start gap-6">
        <div className="flex flex-1 flex-col gap-0.5">
          <AnimatedNumber value={ventas} format={formatoSoles} className={cifra} />
          <span className="text-caption text-fg-secondary">vendidos</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <AnimatedNumber value={pedidos} className={cifra} />
          <span className="text-caption text-fg-secondary">{pedidos === 1 ? "pedido" : "pedidos"}</span>
        </div>
      </div>
      <p className="text-caption text-fg-secondary">Hasta las {corte}{corte.endsWith(".") ? "" : "."} Solo cuenta pedidos pagados.</p>
    </Card>
  );
}
