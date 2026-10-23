"use client";

import { Plus, Ruler } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui";
import { tipoDe, type OpcionProto } from "../../lib/datos";
import { Seccion } from "../comunes";
import { CAMPO, OpcionFila } from "./opcion-fila";

const MAXIMO = 3;

type Props = { opciones: OpcionProto[]; onCambio: (o: OpcionProto[]) => void; otrosConTabla: string[] };

/**
 * Opciones genéricas (0032): hasta 3 (color, talla, tono, tamaño, material, aroma u otra), en UN contenedor con
 * divisores (0031). Debajo: qué opción cambia las fotos (por defecto Color o Tono) y, si hay talla, su tabla.
 */
export function SeccionOpciones({ opciones, onCambio, otrosConTabla }: Props) {
  const conFotos = opciones.findIndex((o) => ["color", "tono"].includes(o.nombre.trim().toLowerCase()));
  const [fotosSegun, setFotosSegun] = useState(conFotos);
  const [tabla, setTabla] = useState<"ninguna" | "propia" | string>("ninguna");
  const cambiar = (i: number, o: OpcionProto) => onCambio(opciones.map((x, j) => (j === i ? o : x)));
  const agregar = (
    <Button type="button" variant="quiet" size="sm" className="rounded-full" disabled={opciones.length >= MAXIMO} onClick={() => onCambio([...opciones, { nombre: "", valores: [] }])}>
      <span className="flex items-center gap-1.5">
        <Plus aria-hidden strokeWidth={1.5} className="size-4" />
        Agregar opción
      </span>
    </Button>
  );

  return (
    <Seccion id="sec-opciones" titulo="Opciones" accion={agregar}
      descripcion={opciones.length >= MAXIMO ? "Hasta 3 opciones por producto." : "Si cambia el color, la talla, el tamaño o el aroma, agrégalo aquí: sigue siendo un solo producto."}>
      {opciones.length === 0 ? (
        <p className="text-body-sm text-fg-secondary">Sin opciones: se vende como un solo producto, con un solo stock.</p>
      ) : (
        <ul className="flex flex-col divide-y divide-line-subtle">
          {opciones.map((o, i) => (
            <OpcionFila key={i} o={o} i={i} onCambio={(n) => cambiar(i, n)} onQuitar={() => onCambio(opciones.filter((_, j) => j !== i))}>
              {tipoDe(o.nombre) === "talla" && (
                <div className="flex flex-col gap-1.5 rounded-theme bg-sunken p-3">
                  <label htmlFor={`tabla-${i}`} className="flex items-center gap-2 text-body-sm font-semibold text-fg">
                    <Ruler aria-hidden strokeWidth={1.5} className="size-4 text-icon" />
                    Tabla de tallas
                  </label>
                  <select id={`tabla-${i}`} value={tabla} onChange={(e) => setTabla(e.target.value)} className={CAMPO}>
                    <option value="ninguna">Sin tabla</option>
                    <option value="propia">Crear una para este producto</option>
                    {otrosConTabla.map((n) => <option key={n} value={n}>Usar la de {n}</option>)}
                  </select>
                  <p className="text-caption text-fg-secondary">
                    {tabla === "ninguna" ? "Sin tabla, la tienda no muestra el link a la tabla de tallas." : tabla === "propia" ? "Medidas por talla (cm). Se edita en una hoja aparte." : `Se copia la tabla de ${tabla}; si la cambias aquí, no cambia allá.`}
                  </p>
                </div>
              )}
            </OpcionFila>
          ))}
        </ul>
      )}
      {opciones.length > 0 && (
        <label className="flex flex-col gap-1.5 border-t border-line-subtle pt-4">
          <span className="text-body-sm font-semibold text-fg">Las fotos cambian según</span>
          <select value={fotosSegun} onChange={(e) => setFotosSegun(Number(e.target.value))} className={CAMPO}>
            {opciones.map((o, i) => <option key={i} value={i}>{o.nombre || `Opción ${i + 1}`}</option>)}
            <option value={-1}>Ninguna: las mismas fotos para todo</option>
          </select>
          <span className="text-caption text-fg-secondary">Por defecto, Color o Tono. Cada valor tendrá sus propias fotos.</span>
        </label>
      )}
    </Seccion>
  );
}
