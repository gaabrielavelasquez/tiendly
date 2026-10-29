"use client";

import { Percent, Tag, Truck } from "lucide-react";
import { Card, Checkbox, Field, Opcion } from "@/components/ui";
import { Seccion } from "@/components/panel";
import type { ErroresCupon, FormCupon } from "../lib/reglas";

type Props = { f: FormCupon; e: ErroresCupon; set: <K extends keyof FormCupon>(k: K, v: FormCupon[K]) => void };
const num = (v: string) => v.replace(/[^\d.,]/g, "");

/** Código y tipo de descuento (Figma, Crear cupón): porcentaje, monto fijo o envío gratis. */
export function CamposDescuento({ f, e, set }: Props) {
  return (
    <Seccion id="descuento-cupon" titulo="Código y descuento">
      <Field id="campo-codigo" label="Código del cupón" value={f.codigo} onChange={(ev) => set("codigo", ev.target.value.toUpperCase().replace(/\s/g, ""))} hint="Solo letras y números, sin espacios. Tus clientes lo escriben en el carrito." error={e.codigo} autoCapitalize="characters" autoComplete="off" />
      <fieldset className="flex flex-col gap-3">
        <legend className="pb-3 text-body-sm font-semibold text-fg">Tipo de descuento</legend>
        <div className="divide-y divide-line-subtle [&>div]:rounded-none [&>div]:border-0">
        <Opcion nombre="tipo" valor="porcentaje" icono={Percent} elegida={f.tipo === "porcentaje"} onElegir={() => set("tipo", "porcentaje")} titulo="Porcentaje" detalle="Ej.: 10% menos" />
        <Opcion nombre="tipo" valor="monto" icono={Tag} elegida={f.tipo === "monto"} onElegir={() => set("tipo", "monto")} titulo="Monto fijo" detalle="Ej.: S/ 30 menos" />
        <Opcion nombre="tipo" valor="envio" icono={Truck} elegida={f.tipo === "envio"} onElegir={() => set("tipo", "envio")} titulo="Envío gratis" detalle="No paga el envío" />
        </div>
      </fieldset>
      {f.tipo !== "envio" && (
        <Field
          id="campo-valor"
          label={f.tipo === "porcentaje" ? "Porcentaje de descuento (%)" : "Monto de descuento"}
          prefix={f.tipo === "monto" ? "S/" : undefined}
          inputMode="decimal"
          placeholder={f.tipo === "porcentaje" ? "10" : "30"}
          value={f.valor}
          onChange={(ev) => set("valor", num(ev.target.value))}
          hint="Se aplica solo a los productos, no al envío."
          error={e.valor}
        />
      )}
    </Seccion>
  );
}

/** Condiciones opcionales: compra mínima, fechas de vigencia y límite de usos. */
export function CamposCondiciones({ f, e, set }: Props) {
  const fila = (k: "conMinimo" | "conFechas" | "conLimite", texto: string) => (
    <div className="flex items-center gap-1">
      <Checkbox aria-label={texto} checked={f[k]} onChange={(ev) => set(k, ev.target.checked)} />
      <span className="text-body-sm font-semibold text-fg">{texto}</span>
    </div>
  );
  return (
    <Seccion id="condiciones-cupon" titulo="Condiciones (opcionales)"><div className="flex flex-col gap-5 divide-y divide-line-subtle [&>div]:pt-4 [&>div:first-child]:pt-0">
      {fila("conMinimo", "Compra mínima")}
      {f.conMinimo && <Field id="campo-minimo" className="pl-10" label="Monto mínimo de compra" prefix="S/" inputMode="decimal" value={f.minimo} onChange={(ev) => set("minimo", num(ev.target.value))} hint="El cupón funciona desde este subtotal de productos." error={e.minimo} />}
      {fila("conFechas", "Fechas de vigencia")}
      {f.conFechas && (
        <div className="grid gap-3 pl-10 sm:grid-cols-2">
          <Field label="Desde" type="date" value={f.desde} onChange={(ev) => set("desde", ev.target.value)} />
          <Field id="campo-hasta" label="Hasta" type="date" value={f.hasta} onChange={(ev) => set("hasta", ev.target.value)} error={e.hasta} />
        </div>
      )}
      {fila("conLimite", "Límite de usos")}
      {f.conLimite ? (
        <Field id="campo-limite" className="pl-10" label="Usos disponibles en total" inputMode="numeric" value={f.limite} onChange={(ev) => set("limite", ev.target.value.replace(/\D/g, ""))} hint={f.limite ? `Cuando se completen los ${f.limite} usos, el cupón pasa a «Agotado».` : "Cuando se completen, el cupón pasa a «Agotado»."} error={e.limite} />
      ) : (
        <p className="pl-10 text-caption text-fg-secondary">Sin límite: tus clientes lo pueden usar las veces que quieran.</p>
      )}
    </div>
    </Seccion>
  );
}
