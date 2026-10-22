"use client";

import { Clock3 } from "lucide-react";
import { motion } from "motion/react";
import { AnimatedNumber } from "@/components/motion/animated-number";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";
import { EncabezadoSeccion } from "@/components/panel";
import { Card } from "@/components/ui";
import { cn } from "@/lib/cn";
import { formatoSoles } from "../lib/format";
import { suave } from "../lib/motion";
import { Monto } from "./monto";

type HoyCardProps = { ventas: number; pedidos: number; corte: string; className?: string };

/**
 * "Hoy": la tarjeta protagonista del panel (decisiones 0020 y 0026). Ronda 4 de 0031, término medio:
 * degradado corto de cobalto a un cobalto apenas más hondo (`bg-hero-suave`, sin marino) y profundidad en capas
 * al estilo Polaris (`shadow-capas`: filo superior blanco, anillo de 1 px y sombras cortas apiladas), sin halo azul.
 * Título fuera de la tarjeta (como las otras secciones) y etiqueta chica arriba de cada cifra. Variante lisa (A, ronda 5).
 * Halo cálido solo detrás de la tarjeta, asomando por sus bordes (`bg-halo-hoy`, ronda 6): aparece suave al cargar;
 * con "reducir movimiento", ya está.
 */
export function HoyCard({ ventas, pedidos, corte, className }: HoyCardProps) {
  const reduce = useReducedMotion();
  return (
    <section aria-labelledby="hoy-titulo" className={cn("flex flex-col gap-4", className)}>
      <EncabezadoSeccion
        id="hoy-titulo"
        titulo="Hoy"
        accion={
          <span className="flex items-center gap-1.5 text-caption text-fg-secondary">
            <Clock3 aria-hidden strokeWidth={1.5} className="size-3.5" />
            Hasta las {corte}
          </span>
        }
      />
      <div className="relative isolate">
        {/* En móvil asoma 12 px a los lados (menos que el margen de 16 px: nunca genera scroll horizontal). */}
        <motion.span
          aria-hidden
          className="pointer-events-none absolute -inset-x-3 -top-4 -bottom-10 -z-10 bg-halo-hoy lg:-inset-x-10 lg:-top-6 lg:-bottom-14"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={suave}
        />
        <Card className="flex flex-col gap-8 border-0 bg-hero-suave text-fg-inverse shadow-capas lg:p-8">
          <p className="sr-only">
            {formatoSoles(ventas)} vendidos en {pedidos} {pedidos === 1 ? "pedido" : "pedidos"}.
          </p>
          <div aria-hidden className="flex items-end gap-6">
            <div className="flex flex-1 flex-col gap-2">
              <span className="text-caption text-fg-inverse/70">Ventas</span>
              <Monto valor={ventas} />
            </div>
            <div className="flex flex-col gap-2 border-l border-fg-inverse/15 pl-6">
              <span className="text-caption text-fg-inverse/70">Pedidos</span>
              <AnimatedNumber value={pedidos} className="font-display-light text-h3 leading-none" />
            </div>
          </div>
          <p className="text-caption text-fg-inverse/70">Solo cuenta pedidos pagados.</p>
        </Card>
      </div>
    </section>
  );
}
