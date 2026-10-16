import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Badge, buttonVariants, Card } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { Comparacion } from "../lib/reglas";
import type { DiaVentas } from "../types";
import { formatoSoles } from "../lib/format";
import { SemanaGrafico } from "./semana-grafico";

type SemanaCardProps = {
  total: number;
  pedidos: number;
  comparacion: Comparacion;
  dias: DiaVentas[];
  hoy: string;
};

const TENDENCIA = { sube: TrendingUp, baja: TrendingDown, igual: Minus } as const;

/** "Esta semana": total y pedidos, comparación en badge (ícono + texto, no solo color) y barras por día. */
export function SemanaCard({ total, pedidos, comparacion, dias, hoy }: SemanaCardProps) {
  const Tendencia = comparacion ? TENDENCIA[comparacion.direccion] : null;
  return (
    <Card as="section" aria-labelledby="semana-titulo" className="flex flex-col gap-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2 id="semana-titulo" className="text-body font-bold text-fg">
            Esta semana
          </h2>
          <p className="flex items-baseline gap-2">
            <span className="font-display-hero text-h2 tracking-tight text-fg">{formatoSoles(total)}</span>
            <span className="text-body-sm text-fg-secondary">
              · {pedidos} {pedidos === 1 ? "pedido" : "pedidos"}
            </span>
          </p>
        </div>
        {comparacion && Tendencia && (
          <Badge tone={comparacion.direccion === "sube" ? "success" : "neutral"}>
            <Tendencia aria-hidden strokeWidth={2} className="size-3.5" />
            {comparacion.texto}
          </Badge>
        )}
      </div>
      <SemanaGrafico dias={dias} hoy={hoy} />
      <Link
        href="/panel/pedidos"
        className={cn(buttonVariants({ variant: "ghost" }), "w-full transition active:scale-98 lg:w-auto lg:self-start")}
      >
        Ver todos los pedidos
      </Link>
    </Card>
  );
}
