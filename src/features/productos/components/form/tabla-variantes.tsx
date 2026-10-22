import { plural } from "@/lib/formato";
import { cn } from "@/lib/cn";
import { filasVariantes, precioVarianteInvalido, skuSugerido, stockTotal, VARIANTE_VACIA, type FormProducto, type VarianteForm } from "../../lib/formulario";

type TablaProps = { form: FormProducto; error?: string; onCambio: (clave: string, campo: keyof VarianteForm, v: string) => void };

const th = "px-3 py-2.5 text-left encabezado-columna text-fg-secondary";
const input =
  "h-9 w-full rounded-button border border-line-strong bg-surface px-2.5 text-body text-fg tabular-nums outline-none transition placeholder:text-fg-tertiary focus:outline-2 focus:outline-offset-2 focus:outline-focus";
/** Etiqueta visible solo en móvil (en desktop la da el encabezado de la columna). */
const etiquetaMovil = "pb-1 text-caption text-fg-secondary sm:hidden";

/**
 * Mini planilla de variantes: una fila por combinación color × talla con SKU (opcional),
 * precio (opcional; vacío = precio base) y cantidad. En móvil, cada fila se apila como tarjeta.
 */
export function TablaVariantes({ form, error, onCambio }: TablaProps) {
  const filas = filasVariantes(form.colores, form.tallas);
  const base = form.precio || "0.00";
  return (
    <div className="flex flex-col gap-2">
      <div className="overflow-hidden rounded-theme border border-line-subtle">
        <table className="w-full border-collapse">
          <caption className="sr-only">Variantes del producto</caption>
          <thead className="sr-only bg-sunken/60 sm:not-sr-only sm:table-header-group">
            <tr className="border-b border-line-subtle">
              <th scope="col" className={th}>Variante</th>
              <th scope="col" className={th}>SKU</th>
              <th scope="col" className={cn(th, "w-36")}>Precio</th>
              <th scope="col" className={cn(th, "w-28 text-right")}>Cantidad</th>
            </tr>
          </thead>
          <tbody>
            {filas.map(({ color, talla, clave }, i) => {
              const v = form.variantes[clave] ?? VARIANTE_VACIA;
              const nombre = `${color} · ${talla}`;
              const precioMal = Boolean(error) && precioVarianteInvalido(v); // solo se marca el que está mal
              return (
                <tr key={clave} className="grid grid-cols-2 gap-x-2 gap-y-2 border-b border-line-subtle px-3 py-3 last:border-b-0 sm:table-row sm:px-0 sm:py-0">
                  <th scope="row" className="col-span-2 text-left text-body-sm font-semibold text-fg sm:py-2 sm:pr-3 sm:pl-3 sm:whitespace-nowrap">
                    {nombre}
                  </th>
                  {/* Móvil: SKU a todo el ancho (el sugerido es largo); precio y cantidad lado a lado. */}
                  <td className="col-span-2 sm:px-3 sm:py-2">
                    <div className={etiquetaMovil}>SKU</div>
                    <input
                      aria-label={`SKU de ${nombre}`}
                      value={v.sku}
                      onChange={(e) => onCambio(clave, "sku", e.target.value)}
                      placeholder={skuSugerido(form.nombre, color, talla)}
                      className={input}
                    />
                  </td>
                  <td className="sm:px-3 sm:py-2">
                    <div className={etiquetaMovil}>Precio</div>
                    <div className="relative">
                      <span aria-hidden className="pointer-events-none absolute inset-y-0 left-2.5 flex items-center text-body-sm text-fg-secondary">
                        S/
                      </span>
                      <input
                        id={i === 0 ? "campo-variantes" : undefined}
                        aria-label={`Precio de ${nombre} (vacío usa el precio base)`}
                        inputMode="decimal"
                        value={v.precio}
                        onChange={(e) => onCambio(clave, "precio", e.target.value)}
                        placeholder={base}
                        aria-invalid={precioMal || undefined}
                        data-error-variante={precioMal || undefined}
                        className={cn(input, "pl-8", precioMal && "border-error")}
                      />
                    </div>
                  </td>
                  <td className="sm:px-3 sm:py-2">
                    <div className={etiquetaMovil}>Cantidad</div>
                    <input
                      aria-label={`Cantidad de ${nombre}`}
                      inputMode="numeric"
                      value={v.stock}
                      onChange={(e) => onCambio(clave, "stock", e.target.value)}
                      placeholder="0"
                      className={cn(input, "sm:text-right")}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="border-t border-line-subtle bg-sunken/60">
            <tr className="flex justify-between px-3 py-2.5 sm:table-row sm:p-0">
              <th scope="row" colSpan={3} className="text-left text-caption font-semibold text-fg-secondary sm:px-3 sm:py-2.5">
                Total · {plural(filas.length, "variante", "variantes")}
              </th>
              <td className="text-right text-body-sm font-semibold text-fg tabular-nums sm:px-3 sm:py-2.5">
                {plural(stockTotal(form), "unidad", "unidades")}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      {error ? (
        <p className="text-caption text-error">{error}</p>
      ) : (
        <p className="text-caption text-fg-secondary">Si dejas el precio vacío, se usa el precio base.</p>
      )}
    </div>
  );
}
