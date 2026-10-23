"use client";

import { plural } from "@/lib/formato";
import { combinaciones, type OpcionProto } from "../../lib/datos";
import { Seccion } from "../comunes";

type Props = { opciones: OpcionProto[]; stock: Record<string, number>; onStock: (clave: string, n: number) => void };

const cantidad = "h-10 w-20 rounded-button border border-line-strong bg-surface px-3 text-right text-body tabular-nums text-fg outline-2 outline-offset-2 outline-transparent focus:outline-focus";

/**
 * Stock por variante, agrupado por la primera opción (en móvil y desktop: un grupo por valor, sin tarjetas por fila).
 * Precio y SKU por variante siguen en "Más opciones" de cada fila (como hoy), fuera de esta propuesta.
 */
export function SeccionVariantes({ opciones, stock, onStock }: Props) {
  const combos = combinaciones(opciones);
  const conValores = opciones.filter((o) => o.valores.length);

  if (!conValores.length) {
    return (
      <Seccion id="sec-stock" titulo="Stock">
        <label className="flex items-center justify-between gap-4">
          <span className="text-body-sm font-semibold text-fg">Cantidad disponible</span>
          <input inputMode="numeric" className={cantidad} value={stock[""] ?? 0} onChange={(e) => onStock("", Number(e.target.value.replace(/\D/g, "")) || 0)} />
        </label>
      </Seccion>
    );
  }

  const grupos = conValores[0].valores.map((v) => ({ v, filas: combos.filter((c) => c[0] === v) }));
  const total = combos.reduce((s, c) => s + (stock[c.join("|")] ?? 0), 0);

  return (
    <Seccion id="sec-stock" titulo="Stock por variante" descripcion={`${plural(combos.length, "variante", "variantes")} · ${plural(total, "unidad", "unidades")} en total.`}>
      <div className="flex flex-col divide-y divide-line-subtle">
        {grupos.map(({ v, filas }) => {
          const suma = filas.reduce((s, c) => s + (stock[c.join("|")] ?? 0), 0);
          return (
            <div key={v} className="flex flex-col gap-1 py-4 first:pt-0 last:pb-0">
              <p className="flex items-baseline justify-between text-body-sm">
                <span className="font-semibold text-fg">{v}</span>
                <span className="text-fg-secondary tabular-nums">{plural(suma, "unidad", "unidades")}</span>
              </p>
              {conValores.length > 1 ? (
                <ul className="grid grid-cols-2 gap-x-6 gap-y-1 sm:grid-cols-3">
                  {filas.map((c) => {
                    const k = c.join("|");
                    return (
                      <li key={k}>
                        <label className="flex min-h-11 items-center justify-between gap-3">
                          <span className="text-body-sm text-fg-secondary">{c.slice(1).join(" · ")}</span>
                          <input inputMode="numeric" aria-label={`Cantidad de ${c.join(" · ")}`} className={cantidad} value={stock[k] ?? 0} onChange={(e) => onStock(k, Number(e.target.value.replace(/\D/g, "")) || 0)} />
                        </label>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <label className="flex min-h-11 items-center justify-between gap-3">
                  <span className="text-body-sm text-fg-secondary">Cantidad</span>
                  <input inputMode="numeric" aria-label={`Cantidad de ${v}`} className={cantidad} value={stock[v] ?? 0} onChange={(e) => onStock(v, Number(e.target.value.replace(/\D/g, "")) || 0)} />
                </label>
              )}
            </div>
          );
        })}
      </div>
    </Seccion>
  );
}
