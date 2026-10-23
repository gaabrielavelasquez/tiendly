import { Ruler } from "lucide-react";
import { cn } from "@/lib/cn";
import type { TablaTallas as Tabla } from "@/features/productos/types";

type Props = { tabla: Tabla; tallas: string[]; elegida: string | null };

/**
 * "Ver tabla de tallas" en la ficha (parte 4 de 0034): se despliega debajo de las tallas, con las medidas que cargó la
 * tienda en el producto (cm). La talla elegida se marca. Solo las tallas a la venta, en su orden.
 */
export function TablaTallas({ tabla, tallas, elegida }: Props) {
  return (
    <details className="group text-body-sm">
      <summary className="flex w-fit cursor-pointer list-none items-center gap-1.5 text-caption text-fg-secondary underline underline-offset-4 hover:text-fg [&::-webkit-details-marker]:hidden">
        <Ruler aria-hidden strokeWidth={1.5} className="size-4 text-icon" />
        <span className="group-open:hidden">Ver tabla de tallas</span>
        <span className="hidden group-open:inline">Ocultar tabla de tallas</span>
      </summary>
      <div className="mt-3 overflow-x-auto rounded-theme border border-line-subtle">
        <table className="w-full text-left tabular-nums">
          <caption className="sr-only">Tabla de tallas, medidas en centímetros</caption>
          <thead className="bg-sunken text-caption text-fg-secondary">
            <tr>
              <th scope="col" className="px-3 py-2 font-semibold">Talla</th>
              {tabla.medidas.map((m, i) => <th key={i} scope="col" className="px-3 py-2 font-semibold">{m} <span className="font-normal">(cm)</span></th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-line-subtle">
            {tallas.map((t) => (
              <tr key={t} aria-current={t === elegida || undefined} className={cn(t === elegida ? "bg-sunken font-semibold text-fg" : "text-fg-secondary")}>
                <th scope="row" className="px-3 py-2 font-semibold text-fg">{t}</th>
                {tabla.medidas.map((_, i) => <td key={i} className="px-3 py-2">{tabla.filas[t]?.[i] || "—"}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}
