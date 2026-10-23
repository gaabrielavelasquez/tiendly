"use client";

import { cn } from "@/lib/cn";
import { TALLAS_CM } from "../../lib/contenido";

const etiqueta = "text-label font-semibold tracking-widest text-fg-secondary uppercase";

type ColorProps = { colores: { nombre: string; hex?: string }[]; valor: string; onCambio: (c: string) => void };

/** COLOR — NOMBRE y muestras redondas (el color es dato del producto). Grupo de radio accesible. */
export function SelectorColor({ colores, valor, onCambio }: ColorProps) {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className={etiqueta}>
        Color <span aria-hidden>—</span> <span className="text-fg">{valor}</span>
      </legend>
      <div role="radiogroup" aria-label="Color" className="flex flex-wrap gap-2 pt-3">
        {colores.map((c) => (
          <button
            key={c.nombre}
            type="button"
            role="radio"
            aria-checked={valor === c.nombre}
            aria-label={c.nombre}
            title={c.nombre}
            onClick={() => onCambio(c.nombre)}
            className={cn("flex size-10 items-center justify-center rounded-full ring-1 transition", valor === c.nombre ? "ring-fg" : "ring-transparent hover:ring-line-strong")}
          >
            <span className="size-8 rounded-full ring-1 ring-fg/15 ring-inset" style={{ backgroundColor: c.hex }} />
          </button>
        ))}
      </div>
    </fieldset>
  );
}

type TallaProps = { tallas: string[]; valor: string | null; agotadas: Set<string>; error?: string; onCambio: (t: string) => void };

/** TALLA: botones cuadrados (elegido en selection/*), las agotadas deshabilitadas, y tabla de tallas. */
export function SelectorTalla({ tallas, valor, agotadas, error, onCambio }: TallaProps) {
  return (
    <fieldset className="flex flex-col gap-3" aria-describedby={error ? "error-talla" : undefined}>
      <legend className={etiqueta}>Talla</legend>
      <div role="radiogroup" aria-label="Talla" className={cn("grid gap-2 pt-3", tallas.length > 5 ? "grid-cols-6" : "grid-cols-5")}>
        {tallas.map((t, i) => {
          const agotada = agotadas.has(t);
          return (
            <button
              key={t}
              id={i === 0 ? "primera-talla" : undefined}
              type="button"
              role="radio"
              aria-checked={valor === t}
              disabled={agotada}
              onClick={() => onCambio(t)}
              className={cn(
                "h-11 rounded-theme border text-body-sm font-semibold transition-colors",
                valor === t ? "border-selected-border bg-selected text-on-selected" : "border-line-strong bg-surface text-fg hover:border-fg",
                agotada && "cursor-not-allowed border-line-subtle bg-sunken text-fg-tertiary hover:border-line-subtle",
                error && !valor && "border-error",
              )}
            >
              {t}
              {agotada && <span className="sr-only"> (agotada)</span>}
            </button>
          );
        })}
      </div>
      {error && (
        <p id="error-talla" className="text-caption text-error">
          {error}
        </p>
      )}
      {/* Solo con medidas cargadas: sin ellas (p. ej. S, M, L) la tabla sería una lista de guiones. */}
      {tallas.some((t) => TALLAS_CM[t]) && (
      <details className="text-caption text-fg-secondary">
        <summary className="w-fit cursor-pointer underline underline-offset-4 hover:text-fg">Ver tabla de tallas</summary>
        <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1 sm:grid-cols-3">
          {tallas.map((t) => (
            <div key={t} className="flex justify-between gap-3 tabular-nums">
              <dt className="font-semibold text-fg">{t}</dt>
              <dd>{TALLAS_CM[t] ?? "—"}</dd>
            </div>
          ))}
        </dl>
      </details>
      )}
    </fieldset>
  );
}
