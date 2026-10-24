"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { Seccion } from "@/components/panel";
import { Button, Chip } from "@/components/ui";
import { MAXIMO_OPCIONES, OPCIONES_SUGERIDAS, type FormProducto, type ImagenForm, type OpcionForm } from "../../lib/formulario";
import type { TablaDeOtro } from "../../lib/tabla-tallas";
import { tipoDeNombre } from "../../lib/variantes";
import type { TablaTallas } from "../../types";
import { FotosPorValor } from "./fotos-por-valor";
import { CAMPO, OpcionFila } from "./opcion-fila";
import { TablaTallasCampos } from "./tabla-tallas-campos";

type Props = {
  form: FormProducto;
  error?: string;
  errorTabla?: string;
  onOpciones: (o: OpcionForm[]) => void;
  onOpcionFotos: (i: number) => void;
  onFotoValor: (valor: string, idImg: string) => void;
  imagenes: ImagenForm[];
  tablas: TablaDeOtro[];
  onTabla: (t: TablaTallas | null) => void;
};

/**
 * Opciones genéricas (0032 y 0034): hasta 3, en UN contenedor con divisores (0031). "Agregar opción" ofrece
 * Color, Talla, Tamaño, Tono, Aroma, Material u "Otra". Debajo: qué opción cambia las fotos (por defecto Color o
 * Tono) y qué fotos van con cada valor. La primera opción Talla lleva la tabla de tallas del producto.
 */
export function SeccionOpciones({ form, error, errorTabla, onOpciones, onOpcionFotos, onFotoValor, imagenes, tablas, onTabla }: Props) {
  const { opciones, opcionFotos } = form;
  const [eligiendo, setEligiendo] = useState(false);
  const usadas = new Set(opciones.map((o) => o.nombre.trim().toLowerCase()));
  const sumar = (nombre: string) => (onOpciones([...opciones, { nombre, valores: [] }]), setEligiendo(false));
  const lleno = opciones.length >= MAXIMO_OPCIONES;
  const iTalla = opciones.findIndex((o) => tipoDeNombre(o.nombre) === "talla");
  const agregar = (
    <Button type="button" variant="quiet" size="sm" className="rounded-full" aria-expanded={eligiendo} disabled={lleno} onClick={() => setEligiendo((e) => !e)}>
      <span className="flex items-center gap-1.5"><Plus aria-hidden strokeWidth={1.5} className="size-4" />Agregar opción</span>
    </Button>
  );

  return (
    <Seccion id="sec-opciones" titulo="Opciones" accion={agregar}
      descripcion={lleno ? "Hasta 3 opciones por producto." : "Si cambia el color, la talla, el tamaño o el aroma, agrégalo aquí: sigue siendo un solo producto."}>
      {opciones.length === 0 && !eligiendo && <p className="text-body-sm text-fg-secondary">Sin opciones: se vende como un solo producto, con un solo stock.</p>}
      {opciones.length > 0 && (
        <ul className="flex flex-col divide-y divide-line-subtle">
          {opciones.map((o, i) => (
            <OpcionFila key={i} o={o} i={i} onCambio={(n) => onOpciones(opciones.map((x, j) => (j === i ? n : x)))} onQuitar={() => onOpciones(opciones.filter((_, j) => j !== i))}>
              {i === iTalla && <TablaTallasCampos error={errorTabla} tallas={o.valores} tabla={form.tabla} tablas={tablas} onCambio={onTabla} />}
            </OpcionFila>
          ))}
        </ul>
      )}
      {error && <p id="campo-opciones" tabIndex={-1} className="text-caption text-error">{error}</p>}
      {eligiendo && (
        <div role="group" aria-labelledby="titulo-agregar-opcion" className="flex flex-col gap-2 border-t border-line-subtle pt-4 first:border-0 first:pt-0">
          <p id="titulo-agregar-opcion" className="text-body-sm font-semibold text-fg">{opciones.length ? "Agregar otra opción" : "Agregar una opción"}</p>
          <div className="flex flex-wrap gap-2">
            {OPCIONES_SUGERIDAS.filter((s) => !usadas.has(s.toLowerCase())).map((s) => <Chip key={s} onClick={() => sumar(s)}>{s}</Chip>)}
            <Chip className="border-dashed text-fg-secondary" onClick={() => sumar("")}>Otra</Chip>
          </div>
        </div>
      )}
      {opciones.length > 0 && (
        <div className="flex flex-col gap-3 border-t border-line-subtle pt-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-body-sm font-semibold text-fg">Las fotos cambian según</span>
            <select value={opcionFotos} onChange={(e) => onOpcionFotos(Number(e.target.value))} className={CAMPO}>
              {opciones.map((o, i) => <option key={i} value={i}>{o.nombre || `Opción ${i + 1}`}</option>)}
              <option value={-1}>Ninguna: las mismas fotos para todo</option>
            </select>
            <span className="text-caption text-fg-secondary">Por defecto, Color o Tono.</span>
          </label>
          {opciones[opcionFotos]?.valores.length > 0 && (
            <FotosPorValor opcion={opciones[opcionFotos]} imagenes={imagenes} fotosPorValor={form.fotosPorValor} onAlternar={onFotoValor} />
          )}
        </div>
      )}
    </Seccion>
  );
}
