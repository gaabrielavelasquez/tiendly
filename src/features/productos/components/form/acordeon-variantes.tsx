"use client";

import { Collapsible } from "@/components/ui";
import { formatoSoles, plural } from "@/lib/formato";
import { cn } from "@/lib/cn";
import { clave, combinaciones, precioVarianteInvalido, skuSugerido, VARIANTE_VACIA, type FormProducto, type VarianteForm } from "../../lib/formulario";

type Props = { form: FormProducto; error?: string; onCambio: (clave: string, campo: keyof VarianteForm, v: string) => void; className?: string };

const input =
  "h-10 w-full rounded-button border border-line-strong bg-surface px-3 text-body text-fg tabular-nums outline-none transition placeholder:text-fg-tertiary focus:outline-2 focus:outline-offset-2 focus:outline-focus";
const numero = (s: string) => Number(s.replace(",", "."));

/**
 * Variantes en móvil (390 px): un acordeón por color con su resumen ("Plata · 6 tallas · 16 unidades ·
 * S/ 360"). Adentro, cada talla pide solo la cantidad; el precio distinto y el SKU van en "Más opciones".
 * Precio base + excepciones (decisión 0011): vacío = precio base.
 */
export function AcordeonVariantes({ form, error, onCambio, className }: Props) {
  const base = numero(form.precio) > 0 ? numero(form.precio) : null;
  const dato = (color: string, talla: string) => form.variantes[clave(color, talla)] ?? VARIANTE_VACIA;

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <p className="text-body-sm text-fg-secondary">
        Precio base: <span className="font-semibold text-fg">{base ? formatoSoles(base) : "sin definir"}</span>. Cada talla lo usa, salvo que le pongas otro.
      </p>
      <div className="divide-y divide-line-subtle rounded-theme border border-line-subtle">
        {combinaciones(form.colores, form.tallas).map(({ color, tallas }) => {
          const datos = tallas.map((t) => dato(color, t));
          const unidades = datos.reduce((s, v) => s + Number(v.stock || 0), 0);
          const precios = [...new Set(datos.map((v) => (numero(v.precio) > 0 ? numero(v.precio) : base)).filter((p): p is number => p !== null))].sort((a, b) => a - b);
          const precio = !precios.length ? "" : precios.length === 1 ? ` · ${formatoSoles(precios[0])}` : ` · ${formatoSoles(precios[0])}–${formatoSoles(precios.at(-1)!)}`;
          const conError = Boolean(error) && datos.some(precioVarianteInvalido);
          return (
            <Collapsible
              key={color}
              abiertoInicial={conError}
              claseBoton="px-4 py-3"
              claseContenido="flex flex-col divide-y divide-line-subtle border-t border-line-subtle bg-sunken/40"
              resumen={
                <span className="flex flex-col">
                  <span className={cn("text-body-sm font-semibold", conError ? "text-error" : "text-fg")}>{color}</span>
                  <span className="text-caption text-fg-secondary tabular-nums">
                    {plural(tallas.length, "talla", "tallas")} · {plural(unidades, "unidad", "unidades")}
                    {precio}
                  </span>
                </span>
              }
            >
              {tallas.map((talla) => {
                const v = dato(color, talla);
                const k = clave(color, talla);
                const nombre = `${color} · ${talla}`;
                const mal = Boolean(error) && precioVarianteInvalido(v);
                return (
                  <div key={k} className="flex flex-col gap-1 px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <label htmlFor={`cant-${k}`} className="text-body-sm font-semibold text-fg">
                        {talla === "Única" ? "Talla única" : `Talla ${talla}`}
                      </label>
                      <input id={`cant-${k}`} aria-label={`Cantidad de ${nombre}`} inputMode="numeric" placeholder="0" value={v.stock} onChange={(e) => onCambio(k, "stock", e.target.value)} className={cn(input, "w-24 text-right")} />
                    </div>
                    <Collapsible
                      abiertoInicial={Boolean(v.precio || v.sku) || mal}
                      claseBoton="min-h-9 text-caption font-semibold text-fg-secondary"
                      claseContenido="grid grid-cols-2 gap-2 pb-1"
                      resumen={v.precio && !mal ? `Más opciones · ${formatoSoles(numero(v.precio))}` : "Más opciones"}
                    >
                      <label className="flex flex-col gap-1 text-caption text-fg-secondary">
                        Precio (si es distinto)
                        <input
                          inputMode="decimal"
                          placeholder={base ? String(base) : "0.00"}
                          value={v.precio}
                          onChange={(e) => onCambio(k, "precio", e.target.value)}
                          aria-invalid={mal || undefined}
                          data-error-variante={mal || undefined}
                          className={cn(input, mal && "border-error")}
                        />
                      </label>
                      <label className="flex flex-col gap-1 text-caption text-fg-secondary">
                        SKU (opcional)
                        <input value={v.sku} onChange={(e) => onCambio(k, "sku", e.target.value)} placeholder={skuSugerido(form.nombre, color, talla)} className={input} />
                      </label>
                    </Collapsible>
                  </div>
                );
              })}
            </Collapsible>
          );
        })}
      </div>
      {error ? <p className="text-caption text-error">{error}</p> : <p className="text-caption text-fg-secondary">Si dejas el precio vacío, se usa el precio base.</p>}
    </div>
  );
}
