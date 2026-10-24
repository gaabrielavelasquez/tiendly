"use client";

import { ChevronRight, CreditCard } from "lucide-react";
import Link from "next/link";
import { buttonVariants, Collapsible, Switch } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { Cobros } from "../../types";
import { CabeceraMetodo } from "../estado-metodo";
import { ComoFunciona, CuentaYComisiones } from "./detalle-cobros";

type Props = { cobros: Cobros; onCambio: (c: Cobros) => void; onUltimo: () => void; esUltimo: (c: Cobros) => boolean };

/**
 * Cobros automáticos en la web (tarjeta y Yape, decisión 0007 "pagar ahora"). Sin activar: qué se
 * necesita y "Solicitar" (lleva a Afiliación, módulo 4). En revisión: cuándo se recibió y el detalle
 * (Figma A7). Activos: un interruptor por método.
 */
export function TarjetaCobros({ cobros, onCambio, onUltimo, esUltimo }: Props) {
  const icono = <CreditCard strokeWidth={1.5} className="size-5" />;

  if (cobros.estado === "en-revision") {
    return (
      <div className="flex min-w-0 flex-col gap-4 p-5 lg:p-6">
        <CabeceraMetodo icono={icono} titulo="Cobros automáticos en tu web" estado="En revisión" />
        <p className="text-body-sm text-fg-secondary">
          Recibimos tu solicitud{cobros.solicitud ? ` el ${diaMes(cobros.solicitud.enviada)}` : ""}. Te avisamos por correo y WhatsApp cuando tus cobros automáticos estén activos.
        </p>
        <Link href="/panel/configuracion/afiliacion" className="group -mx-1 flex min-h-12 items-center justify-between gap-3 rounded-theme border-t border-line-subtle px-1 pt-3 text-body-sm font-semibold text-fg">
          Ver detalle de solicitud
          <ChevronRight aria-hidden strokeWidth={1.5} className="size-5 text-icon transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    );
  }

  if (cobros.estado === "sin-activar") {
    return (
      <div className="flex min-w-0 flex-col gap-4 p-5 lg:p-6">
        <CabeceraMetodo icono={icono} titulo="Cobros automáticos en tu web" estado="Sin activar" />
        <p className="text-body-sm text-fg-secondary">Tu cliente paga con tarjeta o Yape sin salir de tu tienda, y la venta se confirma sola. Ya no revisas capturas de pago.</p>
        <div className="flex flex-col gap-1 border-t border-line-subtle pt-4 text-body-sm">
          <span className="font-semibold text-fg">Qué necesitas</span>
          <span className="text-fg-secondary">RUC y una cuenta bancaria a nombre de tu RUC. La aprobación tarda de 3 a 10 días hábiles.</span>
        </div>
        <Link href="/panel/configuracion/afiliacion" className={cn(buttonVariants({ block: true }), "active:scale-[0.98]")}>
          Solicitar cobros automáticos
        </Link>
        <Collapsible resumen={<span className="text-body-sm font-semibold text-fg">Ver cómo funciona</span>} claseContenido="pt-2">
          <ComoFunciona />
        </Collapsible>
      </div>
    );
  }

  const cambiar = (c: Cobros) => (esUltimo(c) ? onUltimo() : onCambio(c));
  return (
    <div className="flex min-w-0 flex-col gap-4 p-5 lg:p-6">
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
    </div>
  );
}

const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
/** "13 de octubre" en hora de Lima, sin Intl (mismo texto en servidor y navegador). */
function diaMes(iso: string) {
  const d = new Date(new Date(iso).getTime() - 5 * 3600000);
  return `${d.getUTCDate()} de ${MESES[d.getUTCMonth()]}`;
}
