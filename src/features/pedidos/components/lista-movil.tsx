"use client";

import { ChevronRight } from "lucide-react";
import { CONTENEDOR } from "@/components/panel";
import { MontoPedido } from "./monto-pedido";
import Link from "next/link";
import { Badge, Collapsible } from "@/components/ui";
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
    <div className="relative flex min-h-11 items-center gap-1 pr-2 transition-colors hover:bg-sunken has-[a:active]:bg-sunken">
      <Link href={`/panel/pedidos/${p.id}`} className="flex min-h-11 min-w-0 flex-1 flex-col gap-1.5 py-4 pl-4 outline-offset-2 focus-visible:outline-2 focus-visible:outline-focus after:absolute after:inset-0 after:content-['']">
        <span className="flex items-baseline gap-2 pr-6">
          <span className="font-display-title text-body-sm text-fg">#{p.numero}</span>
          <span className="min-w-0 flex-1 truncate text-body-sm text-fg-secondary">{p.cliente.nombre}</span>
          <span className={cn("text-body-sm tabular-nums", cancelado ? "text-fg-tertiary line-through" : "font-normal text-fg")}><MontoPedido valor={p.total} tachado={cancelado} /></span>
        </span>
        <span className="flex items-center gap-2">
          <Badge tone={tono}>{texto}</Badge>
          {vence && <span className="text-caption font-medium text-warning">{vence}</span>}
        </span>
      <ChevronRight aria-hidden strokeWidth={1.5} className="absolute top-1/2 right-14 size-4 -translate-y-1/2 text-icon" />
      </Link>
      {cancelado ? <span aria-hidden className="size-11 shrink-0" /> : <AccionWhatsApp p={p} className="relative z-10 size-11 shrink-0 after:inset-0" />}
    </div>
  );
}

/** Móvil: pedidos agrupados por día (Hoy, Ayer, Esta semana) en grupos plegables, con tarjetas compactas. */
export function ListaMovilPedidos({ pedidos, ahora }: { pedidos: Pedido[]; ahora: string }) {
  const grupos = ORDEN.map((g) => ({ g, lista: pedidos.filter((p) => grupoDia(p.creadoEl, ahora) === g) })).filter((x) => x.lista.length);
  return (
    <div className="flex flex-col gap-10">
      {grupos.map(({ g, lista }) => (
        <Collapsible
          key={g}
          abiertoInicial
          className="min-w-0"
          claseBoton="mb-3"
          resumen={
            <span className="flex items-baseline gap-2 pr-6">
              <span className="font-titulo-seccion text-h3 tracking-tight text-fg">{g}</span>
              <span className="text-caption text-fg-secondary tabular-nums">{lista.length}</span>
            </span>
          }
        >
          <ul className={`${CONTENEDOR} divide-y divide-line-subtle`}>
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
