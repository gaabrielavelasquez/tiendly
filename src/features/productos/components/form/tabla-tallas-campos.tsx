"use client";

import { Plus, Ruler, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui";
import { copiarTabla, FILA_UNICA, filaDe, MAXIMO_MEDIDAS, tablaNueva, type TablaDeOtro } from "../../lib/tabla-tallas";
import { esMedida, normalizarMedida, quitarUnidades } from "../../lib/medidas";
import type { TablaTallas } from "../../types";
import { CAMPO } from "./opcion-fila";

type Props = { sinTallas?: boolean; error?: string; tallas: string[]; tabla: TablaTallas | null; tablas: TablaDeOtro[]; onCambio: (t: TablaTallas | null) => void };

// 16 px: con menos, el iPhone hace zoom al tocar la celda.
const CELDA = "h-10 w-full min-w-0 rounded-button border border-line-strong bg-surface px-2 text-body text-fg tabular-nums outline-2 outline-offset-1 outline-transparent placeholder:text-fg-tertiary focus:outline-focus";

/**
 * Tabla de tallas del producto (parte 4 de 0034), dentro de la opción Talla: sin tabla, una propia o "Usar la de…"
 * otro producto (se copia: cambiarla aquí no cambia allá). Primero las medidas (hasta 4, con nombre editable); debajo,
 * la tabla: una fila por talla y una columna por medida. Celdas en cm, con rangos ("86–90"); vacío: no aplica.
 */
export function TablaTallasCampos({ tallas: valores, sinTallas = false, error, tabla, tablas, onCambio }: Props) {
  const tallas = sinTallas ? [FILA_UNICA] : valores;
  const [copiada, setCopiada] = useState("");
  const elegir = (v: string) => {
    const otra = tablas.find((t) => t.id === v);
    setCopiada(otra?.nombre ?? "");
    onCambio(v === "" ? null : otra ? copiarTabla(otra.tabla, tallas) : tablaNueva(tallas));
  };
  const medidas = (m: string[], filas = tabla!.filas) => onCambio({ medidas: m, filas });
  const celda = (talla: string, i: number, v: string) => {
    const fila = filaDe(tabla!, talla);
    fila[i] = quitarUnidades(v);
    onCambio({ ...tabla!, filas: { ...tabla!.filas, [talla]: fila } });
  };
  const quitarMedida = (i: number) =>
    medidas(tabla!.medidas.filter((_, j) => j !== i), Object.fromEntries(tallas.map((t) => [t, filaDe(tabla!, t).filter((_, j) => j !== i)])));

  return (
    <div className="flex flex-col gap-3 rounded-theme bg-sunken p-3 sm:p-4">
      <label htmlFor="tabla-tallas" className="flex items-center gap-2 text-body-sm font-semibold text-fg">
        <Ruler aria-hidden strokeWidth={1.5} className="size-4 text-icon" />
        {sinTallas ? "Medidas del producto" : "Tabla de tallas"}
      </label>
      <select id="tabla-tallas" value={tabla ? "propia" : ""} disabled={!tallas.length} onChange={(e) => elegir(e.target.value)} className={CAMPO}>
        <option value="">{sinTallas ? "Sin medidas" : "Sin tabla"}</option>
        <option value="propia">{tabla ? "La de este producto" : sinTallas ? "Agregar medidas" : "Crear una para este producto"}</option>
        {tablas.map((t) => <option key={t.id} value={t.id}>Usar la de {t.nombre}</option>)}
      </select>
      <p className="text-caption text-fg-secondary">
        {!tallas.length ? "Agrega las tallas primero." : !tabla ? sinTallas ? "Agrega las medidas sin crear una opción de talla." : "Sin tabla, tu tienda no muestra el link a la tabla de tallas." : copiada ? `Copiamos la tabla de ${copiada}. Si la cambias aquí, no cambia allá.` : "Escribe un número o un rango, como 30 o 86–90. Las medidas están en cm; quitamos las unidades que escribas."}
      </p>
      {error && <p id="campo-tabla" tabIndex={-1} role="alert" className="text-caption text-error">{error}</p>}
      {tabla && tallas.length > 0 && (
        <>
          <fieldset className="flex min-w-0 flex-col gap-2">
            <legend className="pb-2 text-body-sm font-semibold text-fg">Medidas</legend>
            {tabla.medidas.map((m, i) => (
              <div key={i} className="flex items-center gap-2">
                <input value={m} aria-label={`Nombre de la medida ${i + 1}`} placeholder={sinTallas ? "Ej.: Alto" : "Ej.: Cintura"} maxLength={20}
                  onChange={(e) => medidas(tabla.medidas.map((x, j) => (j === i ? e.target.value : x)))} className={CAMPO} />
                {tabla.medidas.length > 1 && (
                  <button type="button" onClick={() => quitarMedida(i)} aria-label={`Quitar la medida ${m || i + 1}`} className="flex size-10 shrink-0 items-center justify-center rounded-button text-icon transition-colors hover:bg-surface hover:text-fg">
                    <Trash2 aria-hidden strokeWidth={1.5} className="size-4" />
                  </button>
                )}
              </div>
            ))}
            {tabla.medidas.length < MAXIMO_MEDIDAS && (
              <Button type="button" variant="quiet" size="sm" className="w-fit rounded-full" onClick={() => medidas([...tabla.medidas, ""])}>
                <span className="flex items-center gap-1.5"><Plus aria-hidden strokeWidth={1.5} className="size-4" />Agregar medida</span>
              </Button>
            )}
          </fieldset>
          <table className="w-full table-fixed border-separate border-spacing-1">
            <caption className="pb-1 text-left text-body-sm font-semibold text-fg">{sinTallas ? "Medidas (cm)" : "Medidas por talla (cm)"}</caption>
            <thead>
              <tr>
                {!sinTallas && <th scope="col" className="w-10 text-left align-bottom text-caption font-semibold text-fg-secondary">Talla</th>}
                {tabla.medidas.map((m, i) => (
                  <th key={i} scope="col" className="text-left align-bottom text-caption font-semibold break-words text-fg-secondary">{m || `Medida ${i + 1}`}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tallas.map((t) => (
                <tr key={t}>
                  {!sinTallas && <th scope="row" className="truncate text-left text-body-sm font-semibold text-fg">{t}</th>}
                  {filaDe(tabla, t).map((v, i) => (
                    <td key={i}>
                      <input value={v} inputMode="text" placeholder="—" maxLength={40} aria-label={`${tabla.medidas[i] || `Medida ${i + 1}`}${sinTallas ? "" : `, talla ${t}`}, en cm`} onChange={(e) => celda(t, i, e.target.value)} onBlur={() => { if (esMedida(v)) celda(t, i, normalizarMedida(v)); }} aria-invalid={!!error && !!v.trim() && !esMedida(v) || undefined} aria-describedby={error ? "campo-tabla" : undefined} className={CELDA} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
