"use client";

import { Clock3 } from "lucide-react";
import { motion } from "motion/react";
import { AnimatedNumber } from "@/components/motion/animated-number";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";
import { EncabezadoSeccion } from "@/components/panel";
import { Card } from "@/components/ui";
import { cn } from "@/lib/cn";
import { conArticulo } from "@/lib/formato";
import { formatoSoles } from "../lib/format";
import { suave } from "../lib/motion";
import { CompartirWhatsApp } from "./compartir-whatsapp";
import { Monto } from "./monto";

type HoyCardProps = { ventas: number; pedidos: number; corte: string; link: string; className?: string };

// Con ventas: protagonista cobalto. Sin ventas: versión serena, blanca y sin halo (los halos son para logros).
const TONO = {
  protagonista: {
    tarjeta: "bg-hero-suave text-fg-inverse shadow-capas",
    etiqueta: "text-fg-inverse/70",
    divisor: "border-fg-inverse/15",
  },
  sereno: {
    tarjeta: "bg-surface text-fg shadow-contenedor",
    etiqueta: "text-fg-secondary",
    divisor: "border-line-subtle",
  },
} as const;

/**
 * "Hoy": la tarjeta protagonista del panel (decisiones 0020, 0026 y 0031). Con ventas: degradado corto de cobalto
 * (`bg-hero-suave`), profundidad en capas (`shadow-capas`) y un halo cálido solo detrás (`bg-halo-hoy`), que aparece
 * suave al cargar y respeta "reducir movimiento". Sin ventas: misma estructura en un contenedor sereno, sin halo, con
 * una línea de siguiente paso y la acción de compartir la tienda. Título fuera y etiqueta chica arriba de cada cifra.
 */
export function HoyCard({ ventas, pedidos, corte, link, className }: HoyCardProps) {
  const reduce = useReducedMotion();
  const sinVentas = ventas === 0;
  const t = TONO[sinVentas ? "sereno" : "protagonista"];
  return (
    <section aria-labelledby="hoy-titulo" className={cn("flex flex-col gap-4", className)}>
      <EncabezadoSeccion
        id="hoy-titulo"
        titulo="Hoy"
        accion={
          <span className="flex items-center gap-1.5 text-caption text-fg-secondary">
            <Clock3 aria-hidden strokeWidth={1.5} className="size-3.5" />
            Hasta {conArticulo(corte)}
          </span>
        }
      />
      <div className="relative isolate">
        {!sinVentas && (
          // En móvil asoma 12 px a los lados (menos que el margen de 16 px: nunca genera scroll horizontal).
          <motion.span
            aria-hidden
            className="pointer-events-none absolute -inset-x-3 -top-4 -bottom-10 -z-10 bg-halo-hoy lg:-inset-x-10 lg:-top-6 lg:-bottom-14"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={suave}
          />
        )}
        <Card className={cn("flex flex-col gap-8 border-0 lg:p-8", t.tarjeta)}>
          <p className="sr-only">
            {formatoSoles(ventas)} vendidos en {pedidos} {pedidos === 1 ? "pedido" : "pedidos"}.
          </p>
          <div aria-hidden className="flex items-end gap-6">
            <div className="flex flex-1 flex-col gap-2">
              <span className={cn("text-caption", t.etiqueta)}>Ventas</span>
              <Monto valor={ventas} />
            </div>
            <div className={cn("flex flex-col gap-2 border-l pl-6", t.divisor)}>
              <span className={cn("text-caption", t.etiqueta)}>Pedidos</span>
              <AnimatedNumber value={pedidos} className="font-display-light text-h3 leading-none" />
            </div>
          </div>
          {sinVentas ? (
            <div className="flex flex-col items-start gap-4">
              <p className="text-body-sm text-fg-secondary">Aún no hay ventas hoy. Comparte tu tienda para recibir la primera.</p>
              <CompartirWhatsApp link={link} texto="Compartir por WhatsApp" className="w-full lg:w-auto" />
            </div>
          ) : (
            <p className={cn("text-caption", t.etiqueta)}>Solo cuenta pedidos pagados.</p>
          )}
        </Card>
      </div>
    </section>
  );
}
