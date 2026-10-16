"use client";

import { Card } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { Paso } from "../types";
import { progresoPasos } from "../lib/reglas";
import { PasoFila } from "./paso-fila";
import { ProgresoLineal } from "./progreso-lineal";

type PasosCardProps = { pasos: Paso[]; className?: string };

/** "Pasos para arrancar tu tienda": seguimiento lineal por segmentos y los 4 pasos. */
export function PasosCard({ pasos, className }: PasosCardProps) {
  const { hechos, total, mensaje, siguiente } = progresoPasos(pasos);

  return (
    <Card as="section" aria-labelledby="pasos-titulo" className={cn("flex flex-col", className)}>
      <div className="flex flex-col gap-3 pb-4">
        <h2 id="pasos-titulo" className="text-body font-bold text-fg">
          Pasos para arrancar tu tienda
        </h2>
        <p className="text-caption text-fg-secondary">
          <strong className="font-bold text-fg">
            {hechos} de {total} listos
          </strong>{" "}
          · {mensaje}
        </p>
        <ProgresoLineal pasos={pasos} siguiente={siguiente} etiquetaId="pasos-titulo" />
      </div>
      <ul className="flex flex-col">
        {pasos.map((p, i) => (
          <PasoFila
            key={p.id}
            paso={p}
            destacado={p.id === siguiente}
            separador={p.id !== siguiente && pasos[i - 1]?.id !== siguiente}
          />
        ))}
      </ul>
    </Card>
  );
}
