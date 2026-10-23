"use client";

import { cn } from "@/lib/cn";
import { combinaciones, type OpcionProto } from "../../lib/datos";

export const CANTIDAD = "h-10 w-20 rounded-button border border-line-strong bg-surface px-3 text-right text-body tabular-nums text-fg outline-2 outline-offset-2 outline-transparent placeholder:text-fg-tertiary focus:outline-focus";

type CeldaProps = { clave: string; etiqueta: string; stock: Record<string, number>; onStock: (k: string, n: number) => void };

/** Una cantidad con su estado: en 0, "Agotada" debajo (texto de color, sin píldora; 0031). */
export function CeldaStock({ clave, etiqueta, stock, onStock }: CeldaProps) {
  const n = stock[clave] ?? 0;
  return (
    <span className="inline-flex flex-col items-end gap-0.5">
      <input inputMode="numeric" aria-label={`Cantidad de ${etiqueta}`} placeholder="0" className={CANTIDAD} value={n || ""} onChange={(e) => onStock(clave, Number(e.target.value.replace(/\D/g, "")) || 0)} />
      <span className={cn("text-caption", n === 0 ? "text-error" : "invisible")} aria-hidden={n !== 0}>Agotada</span>
    </span>
  );
}

type Props = { opciones: OpcionProto[]; stock: Record<string, number>; onStock: (k: string, n: number) => void };

/**
 * Desktop (ronda 2): stock como planilla. Filas: los valores de la opción 1 (con 3 opciones, las combinaciones de
 * las dos primeras); columnas: los valores de la última. Con una sola opción, una columna "Cantidad".
 */
export function TablaStock({ opciones, stock, onStock }: Props) {
  const usadas = opciones.filter((o) => o.valores.length);
  const ultima = usadas.length > 1 ? usadas[usadas.length - 1] : null;
  const filas = ultima ? combinaciones(usadas.slice(0, -1)) : usadas[0].valores.map((v) => [v]);
  const columnas = ultima ? ultima.valores : ["Cantidad"];
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-body-sm">
        <thead>
          <tr className="border-b border-line-subtle text-caption text-fg-secondary">
            <th className="py-2 pr-4 font-medium">{usadas.slice(0, ultima ? -1 : 1).map((o) => o.nombre).join(" · ")}</th>
            {columnas.map((c) => <th key={c} className="px-2 py-2 text-right font-medium">{ultima ? `${ultima.nombre} ${c}` : c}</th>)}
          </tr>
        </thead>
        <tbody className="divide-y divide-line-subtle">
          {filas.map((f) => (
            <tr key={f.join("|")}>
              <th scope="row" className="py-3 pr-4 font-semibold text-fg">{f.join(" · ")}</th>
              {columnas.map((c) => {
                const valores = ultima ? [...f, c] : f;
                return (
                  <td key={c} className="px-2 pt-3 text-right align-top">
                    <CeldaStock clave={valores.join("|")} etiqueta={valores.join(" · ")} stock={stock} onStock={onStock} />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
