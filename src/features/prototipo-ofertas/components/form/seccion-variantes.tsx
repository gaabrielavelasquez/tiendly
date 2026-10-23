"use client";

import { plural } from "@/lib/formato";
import { combinaciones, type OpcionProto } from "../../lib/datos";
import { Seccion } from "../comunes";
import { CANTIDAD, CeldaStock, TablaStock } from "./tabla-stock";

type Props = { opciones: OpcionProto[]; stock: Record<string, number>; onStock: (clave: string, n: number) => void };

/**
 * Stock por variante. Desktop: planilla (opción 1 en filas, opción 2 en columnas). Móvil: agrupado por la primera
 * opción, un grupo por valor, sin tarjetas por fila. En 0, "Agotada". Precio y SKU por variante: fuera de esta propuesta.
 */
export function SeccionVariantes({ opciones, stock, onStock }: Props) {
  const combos = combinaciones(opciones);
  const conValores = opciones.filter((o) => o.valores.length);

  if (!conValores.length) {
    return (
      <Seccion id="sec-stock" titulo="Stock">
        <label className="flex items-center justify-between gap-4">
          <span className="text-body-sm font-semibold text-fg">Cantidad disponible</span>
          <input inputMode="numeric" placeholder="Ej.: 10" className={CANTIDAD} value={stock[""] || ""} onChange={(e) => onStock("", Number(e.target.value.replace(/\D/g, "")) || 0)} />
        </label>
      </Seccion>
    );
  }

  const total = combos.reduce((s, c) => s + (stock[c.join("|")] ?? 0), 0);
  const agotadas = combos.filter((c) => !(stock[c.join("|")] ?? 0)).length;
  const grupos = conValores[0].valores.map((v) => ({ v, filas: combos.filter((c) => c[0] === v) }));
  const resumen = `${plural(combos.length, "variante", "variantes")} · ${plural(total, "unidad", "unidades")}${agotadas ? ` · ${plural(agotadas, "agotada", "agotadas")}` : ""}.`;

  return (
    <Seccion id="sec-stock" titulo="Stock por variante" descripcion={resumen}>
      <div className="hidden lg:block">
        <TablaStock opciones={opciones} stock={stock} onStock={onStock} />
      </div>
      <div className="flex flex-col divide-y divide-line-subtle lg:hidden">
        {grupos.map(({ v, filas }) => (
          <div key={v} className="flex flex-col gap-1 py-4 first:pt-0 last:pb-0">
            <p className="flex items-baseline justify-between text-body-sm">
              <span className="font-semibold text-fg">{v}</span>
              <span className="text-fg-secondary tabular-nums">{plural(filas.reduce((s, c) => s + (stock[c.join("|")] ?? 0), 0), "unidad", "unidades")}</span>
            </p>
            <ul className="flex flex-col">
              {filas.map((c) => (
                <li key={c.join("|")} className="flex min-h-11 items-start justify-between gap-3 pt-1">
                  <span className="pt-2.5 text-body-sm text-fg-secondary">{conValores.length > 1 ? c.slice(1).join(" · ") : "Cantidad"}</span>
                  <CeldaStock clave={c.join("|")} etiqueta={c.join(" · ")} stock={stock} onStock={onStock} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Seccion>
  );
}
