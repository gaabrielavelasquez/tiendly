"use client";

import { Trash2, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui";
import { cn } from "@/lib/cn";
import { SUGERIDAS, TALLAS_RAPIDAS, tipoDe, type OpcionProto } from "../../lib/datos";

export const CAMPO = "h-10 w-full rounded-button border border-line-strong bg-surface px-3 text-body text-fg outline-2 outline-offset-2 outline-transparent focus:outline-focus";

type Props = { o: OpcionProto; i: number; onCambio: (o: OpcionProto) => void; onQuitar: () => void; children?: React.ReactNode };

/**
 * Una opción del producto: nombre (con sugerencias; el tipo sale del nombre) y sus valores como fichas que se
 * quitan con ×. Escribir y Enter agrega; pegar "S, M, L" agrega los tres. Talla vacía: atajos de tallas comunes.
 */
export function OpcionFila({ o, i, onCambio, onQuitar, children }: Props) {
  const [nuevo, setNuevo] = useState("");
  const tipo = tipoDe(o.nombre);
  const agregar = (texto: string) => {
    const vals = texto.split(",").map((v) => v.trim()).filter((v) => v && !o.valores.includes(v));
    if (vals.length) onCambio({ ...o, valores: [...o.valores, ...vals] });
    setNuevo("");
  };
  return (
    <li className="flex flex-col gap-3 py-5 first:pt-0 last:pb-0">
      <div className="flex items-end gap-2">
        <label className="flex flex-1 flex-col gap-1.5">
          <span className="text-body-sm font-semibold text-fg">Opción {i + 1}</span>
          <input list="sugeridas" autoFocus={!o.nombre} value={o.nombre} placeholder="Ej. Color, Talla, Tamaño" onChange={(e) => onCambio({ ...o, nombre: e.target.value })} className={CAMPO} />
        </label>
        <button type="button" onClick={onQuitar} aria-label={`Quitar la opción ${o.nombre || i + 1}`} className="flex size-10 items-center justify-center rounded-button text-icon transition-colors hover:bg-sunken hover:text-fg">
          <Trash2 aria-hidden strokeWidth={1.5} className="size-4" />
        </button>
      </div>
      <datalist id="sugeridas">{SUGERIDAS.map((s) => <option key={s} value={s} />)}</datalist>
      <div className="flex flex-wrap items-center gap-2">
        {o.valores.map((v) => (
          <span key={v} className="inline-flex h-7 items-center gap-1 rounded-chip border border-line bg-surface pr-1 pl-3 text-body-sm text-fg">
            {v}
            <button type="button" aria-label={`Quitar ${v}`} onClick={() => onCambio({ ...o, valores: o.valores.filter((x) => x !== v) })} className="relative flex size-5 items-center justify-center rounded-full text-icon hover:bg-sunken after:absolute after:-inset-2 after:content-['']">
              <X aria-hidden strokeWidth={1.5} className="size-3.5" />
            </button>
          </span>
        ))}
        <input
          value={nuevo}
          aria-label={`Agregar un valor a ${o.nombre || "la opción"}`}
          placeholder={o.valores.length ? "Agregar otro" : tipo === "color" ? "Ej. Negro" : tipo === "talla" ? "Ej. M o 38" : "Ej. 30 ml"}
          onChange={(e) => (e.target.value.includes(",") ? agregar(e.target.value) : setNuevo(e.target.value))}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), agregar(nuevo))}
          onBlur={() => nuevo && agregar(nuevo)}
          className={cn("h-7 min-w-28 flex-1 rounded-chip border border-dashed border-line-strong bg-transparent px-3 text-body-sm outline-none focus:border-solid")}
        />
      </div>
      {tipo === "talla" && !o.valores.length && (
        <div className="flex flex-wrap items-center gap-2 text-caption text-fg-secondary">
          Tallas comunes:
          {Object.entries(TALLAS_RAPIDAS).map(([k, vals]) => (
            <Button key={k} type="button" variant="quiet" size="sm" className="h-7 rounded-full" onClick={() => onCambio({ ...o, valores: vals })}>{k}</Button>
          ))}
        </div>
      )}
      {children}
    </li>
  );
}
