import { cn } from "@/lib/cn";
import type { TablaTallas as Tabla } from "@/features/productos/types";

type Props = { tabla: Tabla; tallas: string[]; elegida: string | null };

/** Mantiene la presentación de #29: cerrada al entrar, una talla por fila y una columna por medida. */
export function TablaTallas({ tabla, tallas, elegida }: Props) {
  return (
    <details className="min-w-0 text-caption text-fg-secondary">
      <summary className="w-fit cursor-pointer underline underline-offset-4 hover:text-fg">Ver tabla de tallas</summary>
      <div className="mt-3 min-w-0 overflow-x-auto">
        <table aria-label="Tabla de tallas" className="w-full text-left tabular-nums">
          <thead>
            <tr className="border-b border-line-strong text-fg">
              <th scope="col" className="px-3 py-2 font-medium">Talla</th>
              {tabla.medidas.map((m, i) => <th key={i} scope="col" className="px-3 py-2 font-medium break-words">{m}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-line-subtle">
            {tallas.map((t) => (
              <tr key={t} aria-current={t === elegida || undefined} className={cn(t === elegida && "bg-sunken text-fg")}>
                <th scope="row" className="px-3 py-2 font-medium text-fg">{t}</th>
                {tabla.medidas.map((_, i) => <td key={i} className="px-3 py-2">{tabla.filas[t]?.[i] ? `${tabla.filas[t][i]} cm` : "—"}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}
