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
 * "Esta semana" (decisión 0031): encabezado con una acción silenciosa, total que sube al entrar,
 * comparación como ícono + texto de color (sin badge) y barras finas por día.
 */
export function SemanaCard({ total, pedidos, comparacion, dias, hoy, className }: SemanaCardProps) {
  const Tendencia = comparacion ? TENDENCIA[comparacion.direccion] : null;
  return (
    <Card as="section" aria-labelledby="semana-titulo" className={cn("flex flex-col gap-6 lg:p-10", className)}>
      <EncabezadoSeccion
        id="semana-titulo"
        titulo="Esta semana"
        accion={
          <Link href="/panel/pedidos" className={cn(buttonVariants({ variant: "quiet", size: "sm" }), "rounded-full active:scale-98")}>
            Ver pedidos
          </Link>
        }
      />
      {/* Desktop: resumen a la izquierda y gráfico acotado a la derecha, para que el ancho completo no quede vacío. */}
      <div className="flex flex-col gap-6 lg:grid lg:grid-cols-5 lg:items-end lg:gap-10">
        <div className="flex flex-col gap-2 lg:col-span-2 lg:self-start">
          <p className="flex items-baseline gap-2">
            <span className="sr-only">{formatoSoles(total)}</span>
            <Monto valor={total} tamano="h2" className="text-fg" />
            <span className="text-body-sm text-fg-secondary">
              · {pedidos} {pedidos === 1 ? "pedido" : "pedidos"}
            </span>
          </p>
          {comparacion && Tendencia && (
            <p className={cn("flex items-center gap-1.5 text-caption", comparacion.direccion === "sube" ? "text-success" : "text-fg-secondary")}>
              <Tendencia aria-hidden strokeWidth={1.8} className="size-4" />
              {comparacion.texto}
            </p>
          )}
        </div>
        <SemanaGrafico className="lg:col-span-3" dias={dias} hoy={hoy} />
      </div>
    </Card>
  );
}
