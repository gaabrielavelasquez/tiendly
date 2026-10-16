import { plural } from "@/lib/formato";
import { clave, combinaciones, stockTotal, type FormProducto } from "../../lib/formulario";

type GrillaProps = { form: FormProducto; error?: string; onCambio: (color: string, talla: string, v: string) => void };

/** Stock por combinación color × talla, agrupado por color. Solo números enteros. */
export function GrillaStock({ form, error, onCambio }: GrillaProps) {
  const grupos = combinaciones(form.colores, form.tallas);
  const variantes = grupos.reduce((s, g) => s + g.tallas.length, 0);
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-caption font-semibold text-fg-secondary">Stock por variante</h3>
        <p className="text-caption text-fg-secondary tabular-nums">
          {plural(variantes, "variante", "variantes")} · {plural(stockTotal(form), "unidad", "unidades")}
        </p>
      </div>
      <div className="overflow-hidden rounded-sm border border-line-subtle">
        {grupos.map(({ color, tallas }) => (
          <fieldset key={color} className="flex flex-col gap-2 border-b border-line-subtle px-3 py-3 last:border-b-0">
            <legend className="sr-only">Stock de {color}</legend>
            <p aria-hidden className="text-body-sm font-semibold text-fg">
              {color}
            </p>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
              {tallas.map((t, i) => {
                const id = i === 0 && color === grupos[0].color ? "campo-stock" : undefined;
                return (
                  <label key={t} className="flex flex-col gap-1">
                    <span className="text-caption text-fg-secondary">{t}</span>
                    <input
                      id={id}
                      inputMode="numeric"
                      placeholder="0"
                      aria-label={`Stock de ${color}, talla ${t}`}
                      value={form.stock[clave(color, t)] ?? ""}
                      onChange={(e) => onCambio(color, t, e.target.value)}
                      aria-invalid={error ? true : undefined}
                      className="h-9 w-full rounded-button border border-line-strong bg-surface px-2.5 text-body text-fg tabular-nums outline-none transition placeholder:text-fg-tertiary focus:outline-2 focus:outline-offset-2 focus:outline-focus"
                    />
                  </label>
                );
              })}
            </div>
          </fieldset>
        ))}
      </div>
      {error && <p className="text-caption text-error">{error}</p>}
    </div>
  );
}
