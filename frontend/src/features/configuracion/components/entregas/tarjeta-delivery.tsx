"use client";

import { Truck } from "lucide-react";
import { Checkbox, Field, Switch } from "@/components/ui";
import { NOMBRE_ZONA, type ConfigEntregas, type Zona } from "../../types";
import type { ErroresEntregas } from "../../lib/reglas";
import { CabeceraMetodo } from "../estado-metodo";

type Delivery = ConfigEntregas["delivery"];
type Props = { delivery: Delivery; errores: ErroresEntregas; onCambio: (d: Delivery) => void };
const limpio = (v: string) => v.replace(/[^\d.,]/g, "");

/** Delivery con tarifa por zona y envío gratis desde un monto (decisión 0009; Figma, Entregas). */
export function TarjetaDelivery({ delivery, errores, onCambio }: Props) {
  const zona = (z: Zona) => (cambio: Partial<Zona>) => onCambio({ ...delivery, zonas: delivery.zonas.map((x) => (x.id === z.id ? { ...x, ...cambio } : x)) });
  const desde = delivery.envioGratis.desde || "…";
  return (
    <div className="flex min-w-0 flex-col gap-4 p-5 lg:p-6">
      <Switch checked={delivery.activo} onChange={(v) => onCambio({ ...delivery, activo: v })} aria-describedby="delivery-desc">
        <CabeceraMetodo icono={<Truck strokeWidth={1.5} className="size-5" />} titulo="Delivery" estado={delivery.activo ? "Activo" : "Inactivo"} />
      </Switch>
      <p id="delivery-desc" className="text-body-sm text-fg-secondary">Tú llevas o envías el pedido a la dirección de tu cliente. Pones un costo por zona.</p>
      {delivery.activo && (
        <div className="flex flex-col gap-4 border-t border-line-subtle pt-4">
          <fieldset aria-describedby={errores.zonas ? "error-zonas" : undefined} className="flex min-w-0 flex-col divide-y divide-line-subtle">
            <legend className="pb-2 text-body-sm font-semibold text-fg">Tarifas por zona</legend>
            {errores.zonas && <p id="error-zonas" role="alert" className="pb-3 text-body-sm text-error">{errores.zonas}</p>}
            {delivery.zonas.map((z) => (
              <div key={z.id} className="flex min-w-0 flex-col gap-3 py-3">
                <div className="flex items-center gap-1">
                  <Checkbox aria-label={NOMBRE_ZONA[z.id]} checked={z.activa} onChange={(e) => zona(z)({ activa: e.target.checked })} />
                  <span className="text-body-sm font-semibold text-fg">{NOMBRE_ZONA[z.id]}</span>
                </div>
                {z.id === "provincias" && !z.activa && <p className="pl-10 text-caption text-fg-secondary">Actívala para vender a todo el Perú. Tus clientes buscarán su distrito, provincia o departamento al comprar.</p>}
                {z.activa && (
                  <div className="grid gap-3 pl-10 sm:grid-cols-2">
                    <Field label="Costo de envío" prefix="S/" inputMode="decimal" value={z.costo} onChange={(e) => zona(z)({ costo: limpio(e.target.value) })} error={errores[`costo-${z.id}`]} />
                    <Field label="Llega en" placeholder="Ej.: 2 a 3 días hábiles" value={z.plazo} onChange={(e) => zona(z)({ plazo: e.target.value })} error={errores[`plazo-${z.id}`]} />
                  </div>
                )}
              </div>
            ))}
          </fieldset>
          <div className="flex flex-col gap-3 border-t border-line-subtle pt-4">
            <div className="flex items-center gap-1">
              <Checkbox aria-label="Ofrecer envío gratis a partir de un monto" checked={delivery.envioGratis.activo} onChange={(e) => onCambio({ ...delivery, envioGratis: { ...delivery.envioGratis, activo: e.target.checked } })} />
              <span className="text-body-sm font-semibold text-fg">Ofrecer envío gratis a partir de un monto</span>
            </div>
            {delivery.envioGratis.activo && (
              <Field
                className="pl-10"
                label="Monto mínimo de compra"
                prefix="S/"
                inputMode="decimal"
                value={delivery.envioGratis.desde}
                onChange={(e) => onCambio({ ...delivery, envioGratis: { ...delivery.envioGratis, desde: limpio(e.target.value) } })}
                hint={`Tus clientes verán: «Envío gratis en compras desde S/ ${desde}».`}
                error={errores.envioGratis}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
