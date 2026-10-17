"use client";

import { CreditCard } from "lucide-react";
import { useState } from "react";
import { Button, Card, Collapsible, Switch } from "@/components/ui";
import type { Cobros } from "../../types";
import { CabeceraMetodo } from "../estado-metodo";
import { ComoFunciona, CuentaYComisiones } from "./detalle-cobros";

type Props = { cobros: Cobros; onCambio: (c: Cobros) => void; onUltimo: () => void; esUltimo: (c: Cobros) => boolean };

/**
 * Cobros automáticos en la web (tarjeta y Yape, decisión 0007 "pagar ahora"). Sin activar: qué se
 * necesita y "Solicitar" (la solicitud es Afiliación, módulo 4). Activos: un interruptor por método.
 */
export function TarjetaCobros({ cobros, onCambio, onUltimo, esUltimo }: Props) {
  const [solicitando, setSolicitando] = useState<"no" | "cargando" | "pronto">("no");
  const icono = <CreditCard strokeWidth={1.6} className="size-5" />;

  if (cobros.estado === "sin-activar") {
    async function solicitar() {
      setSolicitando("cargando");
      await new Promise((r) => setTimeout(r, 1200));
      setSolicitando("pronto");
    }
    return (
      <Card className="flex flex-col gap-4 p-5 lg:p-6">
        <CabeceraMetodo icono={icono} titulo="Cobros automáticos en tu web" estado="Sin activar" />
        <p className="text-body-sm text-fg-secondary">Tu cliente paga con tarjeta o Yape sin salir de tu tienda, y la venta se confirma sola. Ya no revisas capturas de pago.</p>
        <div className="flex flex-col gap-1 rounded-theme bg-sunken p-3 text-body-sm">
          <span className="font-semibold text-fg">Qué necesitas</span>
          <span className="text-fg-secondary">RUC y una cuenta bancaria a nombre de tu RUC. La aprobación tarda de 3 a 10 días hábiles.</span>
        </div>
        <Button block onClick={solicitar} disabled={solicitando !== "no"} aria-busy={solicitando === "cargando" || undefined}>
          {solicitando === "cargando" ? "Preparando tu solicitud…" : "Solicitar cobros automáticos"}
        </Button>
        {solicitando === "pronto" && <p role="status" className="text-caption text-fg-secondary">La solicitud en línea llega muy pronto. Te avisaremos por WhatsApp cuando puedas completarla.</p>}
        <Collapsible resumen={<span className="text-body-sm font-semibold text-fg">Ver cómo funciona</span>} claseContenido="pt-2">
          <ComoFunciona />
        </Collapsible>
      </Card>
    );
  }

  const cambiar = (c: Cobros) => (esUltimo(c) ? onUltimo() : onCambio(c));
  return (
    <Card className="flex flex-col gap-4 p-5 lg:p-6">
      <CabeceraMetodo icono={icono} titulo="Cobros automáticos en tu web" estado="Activo" />
      <p className="text-body-sm text-fg-secondary">El dinero llega a la cuenta de tu negocio. Los plazos dependen de tu proveedor de pagos.</p>
      <div className="flex flex-col divide-y divide-line-subtle border-y border-line-subtle">
        {(
          [
            ["tarjeta", "Tarjeta de débito o crédito", "Visa, Mastercard y más"],
            ["yape", "Yape", "Con código de aprobación desde el celular o QR desde la computadora"],
          ] as const
        ).map(([k, titulo, detalle]) => (
          <div key={k} className="flex flex-col py-2">
            <Switch checked={cobros[k]} onChange={(v) => cambiar({ ...cobros, [k]: v })} aria-describedby={`cobro-${k}`}>
              {titulo}
            </Switch>
            <p id={`cobro-${k}`} className="-mt-1 pb-1 text-caption text-fg-secondary">{detalle}</p>
          </div>
        ))}
      </div>
      {cobros.cuenta && (
        <Collapsible
          resumen={
            <span className="flex flex-col">
              <span className="text-body-sm font-semibold text-fg">Cuenta de depósito y comisiones</span>
              <span className="text-caption text-fg-secondary">{cobros.cuenta.banco} ···· {cobros.cuenta.ultimos4}</span>
            </span>
          }
          claseContenido="pt-3"
        >
          <CuentaYComisiones cuenta={cobros.cuenta} />
        </Collapsible>
      )}
    </Card>
  );
}
