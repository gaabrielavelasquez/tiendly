"use client";

import { CircleAlert, Search } from "lucide-react";
import { useId, useMemo, useState } from "react";
import { formatoSoles } from "@/lib/formato";
import { cn } from "@/lib/cn";
import type { Distrito } from "../../types";
import { DISTRITOS } from "../../lib/config";
import { normalizar } from "../../lib/reglas";

type Props = { valor: Distrito | null; onCambio: (d: Distrito) => void; error?: string };

/** Distrito con búsqueda (Figma E3): escribe "cay" y elige; cada resultado muestra su zona y su envío. */
export function BuscadorDistrito({ valor, onCambio, error }: Props) {
  const [texto, setTexto] = useState(valor?.nombre ?? "");
  const [abierto, setAbierto] = useState(false);
  const id = useId();
  const resultados = useMemo(() => {
    const q = normalizar(texto);
    return q ? DISTRITOS.filter((d) => normalizar(`${d.nombre} ${d.zona}`).includes(q)).slice(0, 6) : [];
  }, [texto]);

  return (
    <div className="relative flex flex-col gap-1.5">
      <label htmlFor={id} className="text-body-sm font-semibold text-fg">
        Distrito, provincia o departamento
      </label>
      <div className={cn("flex h-10 items-center gap-2 rounded-button border bg-surface px-3 outline-2 outline-offset-2 outline-transparent transition focus-within:outline-focus", error ? "border-error" : "border-line-strong")}>
        <Search aria-hidden strokeWidth={1.6} className="size-4 shrink-0 text-icon" />
        <input
          id={id}
          role="combobox"
          aria-expanded={abierto && resultados.length > 0}
          aria-controls={`${id}-lista`}
          aria-autocomplete="list"
          aria-invalid={error ? true : undefined}
          aria-describedby={`${id}-msg`}
          autoComplete="off"
          placeholder="Elige tu distrito"
          value={texto}
          onChange={(e) => (setTexto(e.target.value), setAbierto(true))}
          onFocus={() => setAbierto(true)}
          className="h-full w-full bg-transparent text-body text-fg outline-none placeholder:text-fg-tertiary"
        />
      </div>
      {abierto && resultados.length > 0 && (
        <ul id={`${id}-lista`} role="listbox" className="absolute inset-x-0 top-full z-10 mt-1 border border-line-subtle bg-surface shadow-overlay">
          {resultados.map((d) => (
            <li key={d.nombre} role="option" aria-selected={valor?.nombre === d.nombre}>
              <button type="button" onClick={() => (onCambio(d), setTexto(d.nombre), setAbierto(false))} className="flex min-h-12 w-full items-center justify-between gap-3 px-3 py-2 text-left hover:bg-sunken">
                <span className="flex flex-col">
                  <span className="text-body-sm font-semibold text-fg">{d.nombre}</span>
                  <span className="text-caption text-fg-secondary">{d.zona}</span>
                </span>
                <span className="text-caption text-fg-secondary tabular-nums">Envío {formatoSoles(d.costo)}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      <p id={`${id}-msg`} className={cn("flex items-start gap-1 text-caption", error ? "text-error" : "text-fg-secondary")}>
        {error && <CircleAlert aria-hidden className="mt-px size-4 shrink-0" />}
        {error ?? (valor ? `${valor.zona} · envío ${formatoSoles(valor.costo)} · llega en ${valor.plazo}.` : "Escribe para buscar. Enviamos a Lima y a provincias.")}
      </p>
    </div>
  );
}
