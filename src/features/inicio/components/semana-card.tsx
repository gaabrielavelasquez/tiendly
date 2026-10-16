import Link from "next/link";
import { buttonVariants, Card } from "@/components/ui";
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

/** "Esta semana": total, pedidos, comparación (flecha + texto) y barras por día. */
export function SemanaCard({ total, pedidos, comparacion, dias, hoy }: SemanaCardProps) {
  return (
    <Card as="section" aria-labelledby="semana-titulo" className="flex flex-col gap-3">
      <h2 id="semana-titulo" className="text-body font-bold text-fg">
        Esta semana
      </h2>
      <p className="flex items-baseline gap-2">
        <span className="font-display-title text-h2 text-fg lg:text-h3">{formatoSoles(total)}</span>
        <span className="text-body-sm text-fg-secondary">
          · {pedidos} {pedidos === 1 ? "pedido" : "pedidos"}
        </span>
      </p>
      {comparacion && (
        <p className={cn("text-caption font-bold", comparacion.direccion === "sube" ? "text-success" : "text-fg-secondary")}>
          {comparacion.texto}
        </p>
      )}
      <SemanaGrafico dias={dias} hoy={hoy} />
      <Link
        href="/panel/pedidos"
        className={cn(buttonVariants({ variant: "ghost" }), "h-14 w-full transition active:scale-98 lg:w-auto lg:self-start")}
      >
        Ver todos los pedidos
      </Link>
    </Card>
  );
}
