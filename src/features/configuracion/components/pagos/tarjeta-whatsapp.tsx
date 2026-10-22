"use client";

import { MessageCircle } from "lucide-react";
import { useState } from "react";
import { Button, Card, Field, Switch } from "@/components/ui";
import { formatoCelular, soloDigitos } from "@/features/checkout/lib/reglas";
import type { ConfigPagos } from "../../types";
import { CabeceraMetodo } from "../estado-metodo";

type Props = { whatsapp: ConfigPagos["whatsapp"]; unico: boolean; onCambio: (w: ConfigPagos["whatsapp"]) => void };

/** Pedidos por WhatsApp (decisión 0007, "pagar después"). Si es el único método, no se puede apagar (Figma E2). */
export function TarjetaWhatsApp({ whatsapp, unico, onCambio }: Props) {
  const [editando, setEditando] = useState(false);
  const [numero, setNumero] = useState(whatsapp.celular);
  const [aviso, setAviso] = useState(false);
  const valido = /^9\d{8}$/.test(soloDigitos(numero));

  function alternar(v: boolean) {
    if (!v && unico) return setAviso(true);
    setAviso(false);
    onCambio({ ...whatsapp, activo: v });
  }

  return (
    <Card className="flex flex-col gap-4 p-5 lg:p-6">
      <Switch checked={whatsapp.activo} onChange={alternar} aria-describedby="wsp-desc">
        <CabeceraMetodo icono={<MessageCircle strokeWidth={1.6} className="size-5" />} titulo="Pedidos por WhatsApp" estado={whatsapp.activo ? "Activo" : "Apagado"} />
      </Switch>
      {aviso && (
        <p role="alert" className="rounded-theme border border-warning-border bg-warning-surface p-3 text-body-sm text-fg">
          Es tu único método de cobro, así que no se puede apagar. Para apagarlo, primero activa los cobros automáticos.
        </p>
      )}
      <p id="wsp-desc" className="text-body-sm text-fg-secondary">
        Tu cliente te manda su pedido ya escrito y acuerdan el pago por chat: Yape a tu número, transferencia o efectivo.
      </p>
      <div className="border-t border-line-subtle pt-4">
        {editando ? (
          <form onSubmit={(e) => (e.preventDefault(), valido && (onCambio({ ...whatsapp, celular: soloDigitos(numero) }), setEditando(false)))} className="flex flex-col gap-3">
            <Field label="Número de WhatsApp" type="tel" inputMode="numeric" value={formatoCelular(numero)} onChange={(e) => setNumero(e.target.value)} error={numero && !valido ? "Son 9 dígitos y empieza con 9." : undefined} hint="Aquí te llegan los pedidos y los mensajes de tus clientes." autoFocus />
            <div className="flex gap-2">
              <Button type="submit" size="sm" disabled={!valido}>Guardar número</Button>
              <Button type="button" size="sm" variant="ghost" onClick={() => (setEditando(false), setNumero(whatsapp.celular))}>Cancelar</Button>
            </div>
          </form>
        ) : (
          <div className="flex items-center justify-between gap-3">
            <p className="flex flex-col text-caption text-fg-secondary">
              {whatsapp.activo ? "Tus pedidos llegan al" : "Cuando lo prendas, tus pedidos llegarán al"}
              <span className="text-body-sm font-semibold text-fg tabular-nums">{formatoCelular(whatsapp.celular)}</span>
            </p>
            <Button variant="ghost" size="sm" onClick={() => setEditando(true)}>Cambiar número</Button>
          </div>
        )}
      </div>
    </Card>
  );
}
