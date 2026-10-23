"use client";

import { Badge, Checkbox } from "@/components/ui";
import { cn } from "@/lib/cn";
import { plural } from "@/lib/formato";
import { contarOpcion, stockTotal, type ProductoProto } from "../../lib/datos";
import { PrecioOferta } from "../comunes";
import { Miniatura, TextoOferta } from "./fila-producto";

type Props = { productos: ProductoProto[]; hoy: string; seleccion: Set<string>; onAlternar: (id: string) => void; onTodos: () => void };

/** Desktop: tabla en un solo contenedor con divisores (0031), casillas como hoy (0027). Precio con su oferta y vigencia. */
export function TablaProto({ productos, hoy, seleccion, onAlternar, onTodos }: Props) {
  const todos = productos.length > 0 && productos.every((p) => seleccion.has(p.id));
  const algunos = !todos && productos.some((p) => seleccion.has(p.id));
  return (
    <table className="w-full text-left">
      <thead>
        <tr className="border-b border-line-subtle text-caption text-fg-secondary">
          <th className="w-14 py-2 pl-4"><Checkbox aria-label="Seleccionar todos" checked={todos} indeterminate={algunos} onChange={onTodos} /></th>
          <th className="py-2 font-medium">Producto</th>
          <th className="py-2 font-medium">Inventario</th>
          <th className="py-2 pr-6 text-right font-medium">Precio</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-line-subtle">
        {productos.map((p) => {
          const stock = stockTotal(p);
          return (
            <tr key={p.id} className={cn("transition-colors", seleccion.has(p.id) ? "bg-sunken" : "hover:bg-sunken/50")}>
              <td className="py-3 pl-4"><Checkbox aria-label={`Seleccionar ${p.nombre}`} checked={seleccion.has(p.id)} onChange={() => onAlternar(p.id)} /></td>
              <td className="py-3">
                <span className="flex items-center gap-3">
                  <Miniatura p={p} />
                  <span className="flex flex-col">
                    <span className="flex items-center gap-2 text-body-sm font-semibold text-fg">{p.nombre}{p.estado === "pausado" && <Badge>Pausado</Badge>}</span>
                    <span className="text-caption text-fg-secondary">{p.opciones.length ? p.opciones.map(contarOpcion).join(" · ") : "Sin opciones"}</span>
                  </span>
                </span>
              </td>
              <td className={cn("py-3 text-body-sm tabular-nums", stock === 0 ? "text-error" : "text-fg")}>{stock === 0 ? "Agotado" : plural(stock, "unidad", "unidades")}</td>
              <td className="py-3 pr-6">
                <span className="flex flex-col items-end gap-0.5">
                  <PrecioOferta p={p} hoy={hoy} className="items-end" />
                  <TextoOferta p={p} hoy={hoy} />
                </span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
