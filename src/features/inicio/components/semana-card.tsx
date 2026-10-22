"use client";

// Cliente: el total sube con Monto (AnimatedNumber por dentro).
import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import Link from "next/link";
import { EncabezadoSeccion } from "@/components/panel";
import { buttonVariants, Card } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { Comparacion } from "../lib/reglas";
import type { DiaVentas } from "../types";
import { formatoSoles } from "../lib/format";
import { Monto } from "./monto";
import { SemanaGrafico } from "./semana-grafico";

type SemanaCardProps = {
  total: number;
  pedidos: number;
  comparacion: Comparacion;
  dias: DiaVentas[];
  hoy: string;
  className?: string;
};

const TENDENCIA = { sube: TrendingUp, baja: TrendingDown, igual: Minus } as const;

/**
 * "Esta semana" (decisión 0031, ronda 4): título y acción silenciosa fuera del contenedor; dentro, etiqueta chica,
 * total en SemiBold (es un total) que sube al entrar, comparación con solo el delta en color ("+12 %") y el resto
 * en texto secundario, y barras finas por día. Desktop: resumen a la izquierda y el gráfico usa todo el ancho que queda.
 */
export function SemanaCard({ total, pedidos, comparacion, dias, hoy, className }: SemanaCardProps) {
  const Tendencia = comparacion ? TENDENCIA[comparacion.direccion] : null;
  return (
    <section aria-labelledby="semana-titulo" className={cn("flex flex-col gap-4", className)}>
      <EncabezadoSeccion
        id="semana-titulo"
        titulo="Esta semana"
        accion={
          <Link href="/panel/pedidos" className={cn(buttonVariants({ variant: "quiet", size: "sm" }), "rounded-full active:scale-98")}>
            Ver pedidos
          </Link>
        }
      />
      <Card className="flex flex-col gap-6 border-0 shadow-contenedor lg:flex-row lg:items-end lg:gap-16 lg:p-10">
        <div className="flex shrink-0 flex-col gap-2 lg:self-start">
          <span className="text-caption text-fg-secondary">Total de la semana</span>
          <p className="flex items-baseline gap-2">
            <span className="sr-only">{formatoSoles(total)}</span>
            <Monto valor={total} tamano="h2" total className="text-fg" />
            <span className="text-body-sm text-fg-secondary">
              · {pedidos} {pedidos === 1 ? "pedido" : "pedidos"}
            </span>
          </p>
          {comparacion && Tendencia && (
            <p className="flex items-center gap-1.5 text-caption text-fg-secondary">
              <Tendencia aria-hidden strokeWidth={1.5} className="size-4 text-icon" />
              {comparacion.delta && (
                <span className={cn("font-medium", comparacion.direccion === "sube" ? "text-success" : "text-fg")}>{comparacion.delta}</span>
              )}
              {comparacion.resto}
            </p>
          )}
        </div>
        <SemanaGrafico className="lg:flex-1" dias={dias} hoy={hoy} />
      </Card>
    </section>
  );
}
