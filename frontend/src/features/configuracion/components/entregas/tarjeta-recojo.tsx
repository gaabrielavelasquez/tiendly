"use client";

import { Store } from "lucide-react";
import { Field, Switch } from "@/components/ui";
import type { ConfigEntregas } from "../../types";
import type { ErroresEntregas } from "../../lib/reglas";
import { CabeceraMetodo } from "../estado-metodo";

type Recojo = ConfigEntregas["recojo"];
type Props = { recojo: Recojo; errores: ErroresEntregas; onCambio: (r: Recojo) => void };

/** Recojo en tienda: dirección, distrito, horario y una nota que ve el cliente (Figma, Entregas). */
export function TarjetaRecojo({ recojo, errores, onCambio }: Props) {
  const set = (k: keyof Recojo) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onCambio({ ...recojo, [k]: e.target.value });
  return (
    <div className="flex min-w-0 flex-col gap-4 p-5 lg:p-6">
      <Switch checked={recojo.activo} onChange={(v) => onCambio({ ...recojo, activo: v })} aria-describedby="recojo-desc">
        <CabeceraMetodo icono={<Store strokeWidth={1.5} className="size-5" />} titulo="Recojo en tienda" estado={recojo.activo ? "Activo" : "Inactivo"} />
      </Switch>
      <p id="recojo-desc" className="text-body-sm text-fg-secondary">Tu cliente pasa a recoger su pedido y no paga envío. Coordinan el día por WhatsApp.</p>
      {recojo.activo && (
        <div className="flex flex-col gap-4 border-t border-line-subtle pt-4">
          <Field label="Dirección de recojo" value={recojo.direccion} onChange={set("direccion")} error={errores.direccion} placeholder="Ej.: Calle Los Pinos 245" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Distrito" value={recojo.distrito} onChange={set("distrito")} error={errores.distrito} placeholder="Ej.: Santiago de Surco" />
            <Field label="Horario de atención" value={recojo.horario} onChange={set("horario")} error={errores.horario} placeholder="Ej.: Lunes a sábado, 10 a. m. a 7 p. m." />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="nota-recojo" className="text-body-sm font-semibold text-fg">Nota para tu cliente (opcional)</label>
            <textarea
              id="nota-recojo"
              rows={3}
              value={recojo.nota}
              onChange={set("nota")}
              aria-describedby="nota-recojo-ayuda"
              className="block w-full resize-y rounded-button border border-line-strong bg-surface px-3 py-2.5 text-body text-fg transition outline-2 outline-offset-2 outline-transparent placeholder:text-fg-tertiary focus:outline-focus"
            />
            <p id="nota-recojo-ayuda" className="text-caption text-fg-secondary">Se muestra en el checkout y en la confirmación del pedido.</p>
          </div>
        </div>
      )}
    </div>
  );
}
