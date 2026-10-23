"use client";

import { Seccion } from "@/components/panel";
import { Collapsible } from "@/components/ui";
import { plural } from "@/lib/formato";
import { opcionesValidas, variantesDe, type FormProducto } from "../../lib/formulario";
import { claveVariante, combinaciones } from "../../lib/variantes";
import { CANTIDAD, CeldaCantidad, Stepper } from "./stock-campos";

type Props = { form: FormProducto; onStock: (clave: string, v: string) => void };

/** Desktop: planilla. Filas: valores de la opción 1 (con 3 opciones, combinaciones de las dos primeras); columnas: la última. */
function Tabla({ form, onStock }: Props) {
  const usadas = opcionesValidas(form);
  const ultima = usadas.length > 1 ? usadas[usadas.length - 1] : null;
  const filas = ultima ? combinaciones(usadas.slice(0, -1)) : usadas[0].valores.map((v) => [v]);
  const columnas = ultima ? ultima.valores : ["Cantidad"];
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-body-sm">
        <thead>
          <tr className="border-b border-line-subtle text-caption text-fg-secondary">
            <th className="py-2 pr-4 font-medium">{usadas.slice(0, ultima ? -1 : 1).map((o) => o.nombre).join(" · ")}</th>
            {columnas.map((c) => <th key={c} className="px-2 py-2 text-right font-medium">{ultima ? `${ultima.nombre} ${c}` : c}</th>)}
          </tr>
        </thead>
        <tbody className="divide-y divide-line-subtle">
          {filas.map((f) => (
            <tr key={f.join("|")}>
              <th scope="row" className="py-3 pr-4 font-semibold text-fg">{f.join(" · ")}</th>
              {columnas.map((c) => {
                const v = ultima ? [...f, c] : f;
                const k = claveVariante(v);
                return <td key={c} className="px-2 pt-3 text-right align-top"><CeldaCantidad valor={form.stock[k] ?? ""} etiqueta={v.join(" · ")} onCambio={(x) => onStock(k, x)} /></td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Móvil: un bloque plegable por valor de la opción 1 ("Blanco · 12 unidades"); adentro, cada variante con su contador. */
function Bloques({ form, onStock }: Props) {
  const usadas = opcionesValidas(form);
  const suma = (vs: string[][]) => vs.reduce((s, v) => s + (Number(form.stock[claveVariante(v)]) || 0), 0);
  const fila = (v: string[], etiqueta: string) => (
    <li key={claveVariante(v)} className="flex min-h-14 items-start justify-between gap-3 py-1">
      <span className="pt-2.5 text-body-sm text-fg">{etiqueta}</span>
      <Stepper valor={form.stock[claveVariante(v)] ?? ""} etiqueta={v.join(" · ")} onCambio={(x) => onStock(claveVariante(v), x)} />
    </li>
  );
  if (usadas.length === 1) return <ul className="flex flex-col divide-y divide-line-subtle">{usadas[0].valores.map((v) => fila([v], v))}</ul>;
  return (
    <div className="flex flex-col divide-y divide-line-subtle">
      {usadas[0].valores.map((v, i) => {
        const vs = combinaciones([{ valores: [v] }, ...usadas.slice(1)]);
        return (
          <Collapsible key={v} abiertoInicial={i === 0} claseBoton="py-3" claseContenido="pb-3"
            resumen={<span className="text-body-sm"><span className="font-semibold text-fg">{v}</span> <span className="text-fg-secondary">· {plural(suma(vs), "unidad", "unidades")}</span></span>}>
            <ul className="flex flex-col">{vs.map((x) => fila(x, x.slice(1).join(" · ")))}</ul>
          </Collapsible>
        );
      })}
    </div>
  );
}

/** Stock por variante (0034, ronda final): planilla en desktop, bloques plegables con contador en móvil; "Agotada" en 0. */
export function SeccionStock({ form, onStock }: Props) {
  const variantes = variantesDe(form);
  if (!opcionesValidas(form).length) {
    return (
      <Seccion id="sec-stock" titulo="Stock">
        <label className="flex items-center justify-between gap-4">
          <span className="text-body-sm font-semibold text-fg">Cantidad disponible</span>
          <input id="campo-stock" inputMode="numeric" placeholder="Ej.: 10" className={CANTIDAD} value={form.stock[""] ?? ""} onChange={(e) => onStock("", e.target.value)} />
        </label>
      </Seccion>
    );
  }
  const total = variantes.reduce((s, v) => s + (Number(form.stock[claveVariante(v)]) || 0), 0);
  const agotadas = variantes.filter((v) => !(Number(form.stock[claveVariante(v)]) > 0)).length;
  return (
    <Seccion id="sec-stock" titulo="Stock por variante"
      descripcion={`${plural(variantes.length, "variante", "variantes")} · ${plural(total, "unidad", "unidades")}${agotadas ? ` · ${plural(agotadas, "agotada", "agotadas")}` : ""}.`}>
      <div className="hidden lg:block"><Tabla form={form} onStock={onStock} /></div>
      <div className="lg:hidden"><Bloques form={form} onStock={onStock} /></div>
    </Seccion>
  );
}
