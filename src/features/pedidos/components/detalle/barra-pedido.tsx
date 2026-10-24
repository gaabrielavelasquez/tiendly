"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ZonaUsuario } from "@/components/panel";
import { Badge } from "@/components/ui";
import type { Pedido } from "../../types";
import type { Accion } from "../../lib/detalle";
import { fechaPedido } from "../../lib/format";
import { BADGE_PAGO, badgeEntrega } from "../../lib/reglas";
import { AccionesPedido } from "./acciones-pedido";

type BarraProps = { pedido: Pedido; ahora: string; onAccion: (a: Accion | "cancelar") => void };

const volver = "flex items-center justify-center rounded-theme text-icon transition-colors hover:bg-sunken";

function Estados({ p }: { p: Pedido }) {
  const pago = BADGE_PAGO[p.pago.estado];
  const entrega = badgeEntrega(p.entrega.estado, p.entrega.metodo);
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <Badge tone={pago.tono}>Pago: {pago.texto}</Badge>
      {p.pago.estado !== "cancelado" && <Badge tone={entrega.tono}>Entrega: {entrega.texto}</Badge>}
    </div>
  );
}

/**
 * Cabecera del pedido. Desktop: fija arriba con volver, número, fecha, estados y acciones.
 * Móvil: título arriba (no fijo) y acciones fijas abajo, al alcance del pulgar.
 */
export function BarraPedido({ pedido, ahora, onAccion }: BarraProps) {
  const titulo = <h1 className="truncate font-display-light text-h1 tracking-tight text-fg">#{pedido.numero}</h1>;
  const fecha = <span className="text-caption text-fg-secondary">{fechaPedido(pedido.creadoEl, ahora)}</span>;
  return (
    <>
      <div className="sticky top-0 z-20 -mx-4 hidden items-center gap-4 border-b border-line-subtle bg-surface/80 px-4 py-3 backdrop-blur-md lg:-mx-12 lg:flex lg:px-12">
        <Link href="/panel/pedidos" aria-label="Volver a Pedidos" className={`${volver} size-11 shrink-0`}>
          <ArrowLeft aria-hidden strokeWidth={1.6} className="size-5" />
        </Link>
        <div className="flex min-w-0 flex-1 flex-col">
          {titulo}
          {fecha}
        </div>
        <Estados p={pedido} />
        <AccionesPedido pedido={pedido} onAccion={onAccion} className="ml-auto" />
        <span aria-hidden className="mx-2 h-6 w-px bg-line-subtle" />
        <ZonaUsuario />
      </div>

      <header className="flex flex-col gap-2 lg:hidden">
        <div className="flex items-center gap-2">
          <Link href="/panel/pedidos" aria-label="Volver a Pedidos" className={`${volver} -ml-2 size-11`}>
            <ArrowLeft aria-hidden strokeWidth={1.6} className="size-5" />
          </Link>
          <div className="flex min-w-0 flex-1 flex-col">
            {titulo}
            {fecha}
          </div>
        </div>
        <Estados p={pedido} />
      </header>
      <div role="group" aria-label="Acciones del pedido" className="fixed inset-x-0 bottom-0 z-20 border-t border-line-subtle bg-surface/95 px-4 pt-3 pb-[max(calc(var(--spacing)*3),env(safe-area-inset-bottom))] backdrop-blur-md empty:hidden lg:hidden">
        <AccionesPedido pedido={pedido} onAccion={onAccion} className="w-full justify-end" />
      </div>
    </>
  );
}
