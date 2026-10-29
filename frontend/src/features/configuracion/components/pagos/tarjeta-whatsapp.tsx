"use client";

import { MessageCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Switch } from "@/components/ui";
import { formatoCelular } from "@/features/checkout/lib/reglas";
import type { ConfigPagos } from "../../types";
import { CabeceraMetodo } from "../estado-metodo";

type Props = { whatsapp: ConfigPagos["whatsapp"]; unico: boolean; onCambio: (w: ConfigPagos["whatsapp"]) => void };

/**
 * Pedidos por WhatsApp (decisión 0007, "pagar después"). Si es el único método, no se puede apagar (Figma E2).
 * El número de ventas se edita solo en Mi tienda › Contacto; aquí se muestra en solo lectura.
 */
export function TarjetaWhatsApp({ whatsapp, unico, onCambio }: Props) {
  const [aviso, setAviso] = useState(false);

  function alternar(v: boolean) {
    if (!v && unico) return setAviso(true);
    setAviso(false);
    onCambio({ ...whatsapp, activo: v });
  }

  return (
    <div className="flex min-w-0 flex-col gap-4 p-5 lg:p-6">
      <Switch checked={whatsapp.activo} onChange={alternar} aria-describedby="wsp-desc">
        <CabeceraMetodo icono={<MessageCircle strokeWidth={1.5} className="size-5" />} titulo="Pedidos por WhatsApp" estado={whatsapp.activo ? "Activo" : "Apagado"} />
      </Switch>
      {aviso && (
        <p role="alert" className="text-body-sm text-warning">
          Es tu único método de cobro, así que no se puede apagar. Para apagarlo, primero activa los cobros automáticos.
        </p>
      )}
      <p id="wsp-desc" className="text-body-sm text-fg-secondary">
        Tu cliente te manda su pedido ya escrito y acuerdan el pago por chat: Yape a tu número, transferencia o efectivo.
      </p>
      <div className="flex items-center justify-between gap-3 border-t border-line-subtle pt-4">
        <p className="flex flex-col text-caption text-fg-secondary">
          {whatsapp.activo ? "Tus pedidos llegan al" : "Cuando lo prendas, tus pedidos llegarán al"}
          <span className="text-body-sm font-semibold text-fg tabular-nums">{formatoCelular(whatsapp.celular)}</span>
        </p>
        <Link href="/panel/mi-tienda" className="link-text flex min-h-11 items-center text-body-sm font-semibold">
          Editar en Mi tienda
        </Link>
      </div>
    </div>
  );
}
