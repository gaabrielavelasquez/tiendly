"use client";

import { ChevronRight, Copy } from "lucide-react";
import Link from "next/link";
import { Card, Switch } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { Cupon, EstadoCupon } from "../types";
import { textoCondicion, textoUso } from "../lib/reglas";

const ETIQUETA: Record<EstadoCupon, string> = { activo: "Activo", programado: "Programado", pausado: "Pausado", agotado: "Agotado", vencido: "Vencido" };

type Props = { c: Cupon; estado: EstadoCupon; onAlternar: (activo: boolean) => void; onCopiar: () => void };

/**
 * Un cupón (Figma, Cupones · lista): código con "copiar", descuento y condición, estado y usos.
 * Activos, programados y pausados llevan interruptor; agotados y vencidos, chevron para editarlos.
 * Toda la tarjeta abre la edición; el interruptor y "copiar" quedan por encima.
 */
export function TarjetaCupon({ c, estado, onAlternar, onCopiar }: Props) {
  const conInterruptor = estado === "activo" || estado === "programado" || estado === "pausado";
  const encendido = estado !== "pausado";
  return (
    <li>
      <Card as="article" className="relative flex items-center gap-3 p-4 lg:p-5">
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <span className="flex items-center gap-1">
            <Link href={`/panel/cupones/${c.id}`} className="font-display-title text-body text-fg after:absolute after:inset-0 after:content-['']">
              {c.codigo}
            </Link>
            {conInterruptor && (
              <button type="button" onClick={onCopiar} aria-label={`Copiar el código ${c.codigo}`} className="relative z-10 flex size-11 items-center justify-center rounded-theme text-icon hover:bg-sunken">
                <Copy aria-hidden strokeWidth={1.6} className="size-4" />
              </button>
            )}
          </span>
          <span className="text-body-sm text-fg-secondary">{textoCondicion(c)}</span>
          <span className="flex items-center gap-1.5 text-caption">
            <span aria-hidden className={cn("size-1.5 rounded-full", estado === "activo" || estado === "programado" ? "bg-success" : "bg-fg-tertiary")} />
            <span className={estado === "activo" || estado === "programado" ? "font-semibold text-success" : "text-fg-secondary"}>{ETIQUETA[estado]}</span>
            <span className="text-fg-secondary">· {textoUso(c, estado)}</span>
          </span>
        </div>
        {conInterruptor ? (
          <div className="relative z-10 w-11 shrink-0">
            <Switch checked={encendido} onChange={onAlternar}>
              <span className="sr-only">{c.codigo} activo</span>
            </Switch>
          </div>
        ) : (
          <ChevronRight aria-hidden strokeWidth={1.6} className="size-6 shrink-0 text-icon" />
        )}
      </Card>
    </li>
  );
}
