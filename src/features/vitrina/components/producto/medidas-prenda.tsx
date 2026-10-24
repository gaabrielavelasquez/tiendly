import type { TablaTallas } from "@/features/productos/types";
import { FILA_UNICA } from "@/features/productos/lib/tabla-tallas";

/** Medidas de la pieza, sin inventar una opción Talla ni pedir una selección. */
export function MedidasPrenda({ tabla }: { tabla: TablaTallas }) {
  return (
    <details className="min-w-0 text-caption text-fg-secondary">
      <summary className="w-fit cursor-pointer underline underline-offset-4 hover:text-fg">Medidas de la prenda</summary>
      <table aria-label="Medidas de la prenda" className="mt-3 w-full text-left tabular-nums">
        <thead><tr className="border-b border-line-strong text-fg">
          <th scope="col" className="px-3 py-2 font-medium">Medida</th>
          <th scope="col" className="px-3 py-2 font-medium">Valor (cm)</th>
        </tr></thead>
        <tbody className="divide-y divide-line-subtle">
          {tabla.medidas.map((m, i) => (
            <tr key={i}>
              <th scope="row" className="px-3 py-2 font-medium break-words text-fg">{m}</th>
              <td className="px-3 py-2">{tabla.filas[FILA_UNICA]?.[i] || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </details>
  );
}
