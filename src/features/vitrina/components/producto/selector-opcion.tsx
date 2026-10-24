"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";
import type { Opcion, TablaTallas as Tabla } from "@/features/productos/types";
import { HEX_COLOR } from "../../lib/contenido";

import { TablaTallas } from "./tabla-tallas";

const etiqueta = "text-label font-semibold tracking-widest text-fg-secondary uppercase";

type Props = {
  opcion: Opcion;
  i: number;
  valor: string | null;
  /** Valores sin stock con lo que ya se eligió en las otras opciones: se ven pero no se pueden elegir. */
  agotados: Set<string>;
  fotos?: Record<string, string[]>;
  error?: string;
  tabla?: Tabla;
  onCambio: (v: string) => void;
};

/**
 * Un selector por opción (0032). Color: miniaturas si hay fotos; si no, muestras o botones.
 * Talla, Tono, Tamaño y el resto: botones (elegido en selection/*). Talla con tabla propia o heredada: "Ver tabla de tallas". Grupo de radio accesible.
 */
export function SelectorOpcion({ opcion, i, valor, agotados, fotos, error, tabla, onCambio }: Props) {
  const muestras = opcion.tipo === "color" && opcion.valores.every((v) => HEX_COLOR[v]);
  const idError = `error-opcion-${i}`;
  return (
    <fieldset className="flex min-w-0 flex-col gap-3" aria-describedby={error ? idError : undefined}>
      <legend className={etiqueta}>
        {opcion.nombre}
        {valor && <> <span aria-hidden>—</span> <span className="text-fg">{valor}</span></>}
      </legend>
      <div role="radiogroup" aria-label={opcion.nombre} className="flex flex-wrap gap-2 pt-3">
        {opcion.valores.map((v, n) => {
          const agotado = agotados.has(v);
          const comun = { id: n === 0 ? `opcion-${i}` : undefined, type: "button" as const, role: "radio", "aria-checked": valor === v, disabled: agotado, onClick: () => onCambio(v) };
          const foto = opcion.tipo === "color" ? fotos?.[v]?.[0] : undefined;
          return foto ? (
            <button key={v} {...comun} aria-label={`${v}${agotado ? " (agotado)" : ""}`} title={v}
              className={cn("relative size-16 overflow-hidden rounded-theme border bg-surface transition-colors", valor === v ? "border-selected-border ring-1 ring-selected-border" : "border-line-strong hover:border-fg", agotado && "cursor-not-allowed", error && !valor && "border-error")}>
              <Image src={foto} alt="" fill sizes="64px" className={cn("object-cover", agotado && "opacity-40")} />
              {agotado && <X aria-hidden strokeWidth={1} className="absolute inset-0 size-full text-fg" />}
            </button>
          ) : muestras ? (
            <button key={v} {...comun} aria-label={`${v}${agotado ? " (agotado)" : ""}`} title={v}
              className={cn("flex size-10 items-center justify-center rounded-full ring-1 transition", valor === v ? "ring-fg" : "ring-transparent hover:ring-line-strong", agotado && "cursor-not-allowed opacity-40")}>
              <span className="size-8 rounded-full ring-1 ring-fg/15 ring-inset" style={{ backgroundColor: HEX_COLOR[v] }} />
            </button>
          ) : (
            <button key={v} {...comun}
              className={cn(
                "h-11 min-w-12 rounded-theme border px-4 text-body-sm font-semibold transition-colors",
                valor === v ? "border-selected-border bg-selected text-on-selected" : "border-line-strong bg-surface text-fg hover:border-fg",
                agotado && "cursor-not-allowed border-line-subtle bg-sunken text-fg-tertiary line-through hover:border-line-subtle",
                error && !valor && "border-error",
              )}>
              {v}
              {agotado && <span className="sr-only"> (agotado)</span>}
            </button>
          );
        })}
      </div>
      {error && <p id={idError} className="text-caption text-error">{error}</p>}
      {opcion.tipo === "talla" && tabla && <TablaTallas tabla={tabla} tallas={opcion.valores} elegida={valor} />}
    </fieldset>
  );
}
