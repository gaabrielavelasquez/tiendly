"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { COLORES_SUGERIDOS, TALLAS_CALZADO, TALLAS_ROPA, type Errores, type FormProducto } from "../../lib/formulario";
import { ChipsOpciones } from "./chips-opciones";
import { GrillaStock } from "./grilla-stock";
import { Tarjeta } from "./tarjeta";

type VariantesProps = {
  form: FormProducto;
  errores: Errores;
  onColor: (c: string) => void;
  onTalla: (t: string) => void;
  onStock: (color: string, talla: string, v: string) => void;
};

/** Variantes (1 modelo = 1 producto): colorways y tallas en chips; el stock se pide por combinación. */
export function TarjetaVariantes({ form, errores, onColor, onTalla, onStock }: VariantesProps) {
  const [nuevo, setNuevo] = useState("");
  const colores = [...new Set([...COLORES_SUGERIDOS, ...form.colores])];

  function agregarColor() {
    const c = nuevo.trim().replace(/^\p{L}/u, (l) => l.toUpperCase());
    if (c && !form.colores.includes(c)) onColor(c);
    setNuevo("");
  }

  return (
    <Tarjeta titulo="Variantes" descripcion="Elige los colores y tallas de este modelo. Sin tallas, se vende como talla única.">
      <ChipsOpciones legend="Colores" opciones={colores} elegidas={form.colores} onAlternar={onColor}>
        {/* No es un <form>: la página entera ya es el formulario del producto (no se anidan). */}
        <div
          role="group"
          aria-label="Agregar otro color"
          className="flex h-7 items-center gap-1 rounded-chip border border-dashed border-line-strong pr-1 pl-3 focus-within:border-selected-border"
        >
          <label htmlFor="nuevo-color" className="sr-only">
            Otro color
          </label>
          <input
            id="nuevo-color"
            value={nuevo}
            onChange={(e) => setNuevo(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), agregarColor())}
            placeholder="Otro color"
            className="w-24 bg-transparent text-body-sm text-fg outline-none placeholder:text-fg-tertiary"
          />
          <button type="button" onClick={agregarColor} aria-label="Agregar color" className="flex size-5 items-center justify-center rounded-full text-icon hover:bg-sunken">
            <Plus aria-hidden strokeWidth={2} className="size-3.5" />
          </button>
        </div>
      </ChipsOpciones>
      <ChipsOpciones legend="Tallas de ropa" opciones={TALLAS_ROPA} elegidas={form.tallas} onAlternar={onTalla} />
      <ChipsOpciones legend="Tallas de calzado" opciones={TALLAS_CALZADO} elegidas={form.tallas} onAlternar={onTalla} />
      <GrillaStock form={form} error={errores.stock} onCambio={onStock} />
    </Tarjeta>
  );
}
