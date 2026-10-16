"use client";

import Link from "next/link";
import { Badge, Collapsible } from "@/components/ui";
import { formatoSoles } from "@/lib/formato";
import { cn } from "@/lib/cn";
import type { Pedido } from "../types";
import { AccionWhatsApp } from "./accion-whatsapp";
import { grupoDia, type GrupoDia } from "../lib/format";
import { BADGE_PAGO, badgeEntrega, tiempoRestante } from "../lib/reglas";

const ORDEN: GrupoDia[] = ["Hoy", "Ayer", "Esta semana", "Antes"];

/** Un solo estado en la tarjeta: lo que pide atención primero (pago pendiente o cancelado), si no, la entrega. */
function estado(p: Pedido) {
  return p.pago.estado === "pagado" ? badgeEntrega(p.entrega.estado, p.entrega.metodo) : BADGE_PAGO[p.pago.estado];
}

/**
 * Tarjeta compacta de 2 líneas: número y cliente con el total; estado y, si es reserva, cuándo vence.
 * Toda la tarjeta abre el detalle; a la derecha, el atajo para escribirle o avisarle al cliente por WhatsApp.
 */
function TarjetaPedido({ p, ahora }: { p: Pedido; ahora: string }) {
  const { tono, texto } = estado(p);
  const vence = tiempoRestante(p, ahora);
  const cancelado = p.pago.estado === "cancelado";
  return (
    <div className="flex items-center gap-1 pr-2 transition-colors hover:bg-sunken has-[a:active]:bg-sunken">
      <Link href={`/panel/pedidos/${p.id}`} className="flex min-w-0 flex-1 flex-col gap-1.5 py-3 pl-4">
        <span className="flex items-baseline gap-2">
          <span className="font-display-title text-body-sm text-fg">#{p.numero}</span>
          <span className="min-w-0 flex-1 truncate text-body-sm text-fg-secondary">{p.cliente.nombre}</span>
          <span className={cn("text-body-sm tabular-nums", cancelado ? "text-fg-tertiary line-through" : "font-semibold text-fg")}>{formatoSoles(p.total)}</span>
        </span>
        <span className="flex items-center gap-2">
          <Badge tone={tono}>{texto}</Badge>
          {vence && <span className="text-caption font-medium text-warning">{vence}</span>}
        </span>
      </Link>
      {cancelado ? <span aria-hidden className="size-11 shrink-0" /> : <AccionWhatsApp p={p} className="size-11 shrink-0 after:inset-0" />}
    </div>
  );
}

/** Móvil: pedidos agrupados por día (Hoy, Ayer, Esta semana) en grupos plegables, con tarjetas compactas. */
export function ListaMovilPedidos({ pedidos, ahora }: { pedidos: Pedido[]; ahora: string }) {
  const grupos = ORDEN.map((g) => ({ g, lista: pedidos.filter((p) => grupoDia(p.creadoEl, ahora) === g) })).filter((x) => x.lista.length);
  return (
    <div className="flex flex-col">
      {grupos.map(({ g, lista }) => (
        <Collapsible
          key={g}
          abiertoInicial
          className="border-b border-line-subtle last:border-b-0"
          claseBoton="bg-sunken/60 px-4 py-2"
          resumen={
            <span className="flex items-baseline gap-2">
              <span className="text-body-sm font-semibold text-fg">{g}</span>
              <span className="text-caption text-fg-secondary tabular-nums">{lista.length}</span>
            </span>
          }
        >
          <ul className="divide-y divide-line-subtle">
            {lista.map((p) => (
              <li key={p.id}>
                <TarjetaPedido p={p} ahora={ahora} />
              </li>
            ))}
          </ul>
        </Collapsible>
      ))}
    </div>
  );
}
