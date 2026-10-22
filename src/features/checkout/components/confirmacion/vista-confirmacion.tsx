"use client";

import { CircleCheck, Clock3, Download, MessageCircle, SearchX } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button, buttonVariants, EmptyState, Skeleton } from "@/components/ui";
import { formatoSoles } from "@/lib/formato";
import { cn } from "@/lib/cn";
import { leerPedido, textoReserva } from "../../lib/pedido";
import { formatoCelular } from "../../lib/reglas";
import { linkWhatsApp, mensajePedido } from "../../lib/whatsapp";
import type { PedidoCreado } from "../../types";
import { DetallePedido } from "./detalle-pedido";

type Props = { tienda: { nombre: string; slug: string; celular: string }; numero: string };

/**
 * Confirmación (Figma 3a / 3b): pagado ("¡Listo, Andrea!") o registrado por WhatsApp, con la reserva
 * de 24 h. El pedido se lee de este navegador después de montar (hasta tener backend).
 */
export function VistaConfirmacion({ tienda, numero }: Props) {
  const [pedido, setPedido] = useState<PedidoCreado | null | undefined>(undefined);
  useEffect(() => setPedido(leerPedido(tienda.slug, numero)), [tienda.slug, numero]);
  const inicio = `/${tienda.slug}`;

  if (pedido === undefined) {
    return (
      <div aria-busy className="w-full max-w-xl">
        <span className="sr-only">Cargando tu pedido</span>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }
  if (!pedido) {
    return <EmptyState icon={SearchX} title="No encontramos este pedido" description="Si lo hiciste en otro celular o navegador, revisa tu WhatsApp: ahí te llegó la confirmación." action={<Link href={inicio} className={buttonVariants()}>Volver a la tienda</Link>} />;
  }

  const pagado = pedido.pago.metodo !== "whatsapp";
  const nombre = pedido.datos.nombre.trim().split(/\s+/)[0];
  const recojo = pedido.entrega.tipo === "recojo";
  const coordinar = pedido.entrega.tipo === "coordinar";
  const whatsapp = linkWhatsApp(tienda.celular, pagado ? `Hola ${tienda.nombre}, tengo una consulta sobre mi pedido #${numero}.` : mensajePedido({ ...pedido, tienda: tienda.nombre }));
  const enlace = cn(buttonVariants({ variant: "ghost" }), "h-12 text-fg");

  return (
    <div className="flex w-full max-w-xl flex-col gap-6">
      <div className="flex flex-col items-start gap-3">
        <span className={cn("flex items-center gap-2 text-label font-semibold tracking-widest uppercase", pagado ? "text-success" : "text-warning")}>
          {pagado ? <CircleCheck aria-hidden strokeWidth={1.8} className="size-5" /> : <Clock3 aria-hidden strokeWidth={1.8} className="size-5" />}
          {pagado ? "Pedido confirmado" : "Pedido registrado"}
        </span>
        <h1 className="font-display-hero text-h1 text-fg">{pagado ? `¡Listo, ${nombre}! Tu pedido está pagado` : "Tu pedido quedó registrado en la tienda"}</h1>
        {!pagado && <p className="text-body text-fg-secondary">Para confirmarlo, envía el mensaje por WhatsApp.</p>}
        <p className="text-body font-semibold text-fg tabular-nums">
          Pedido #{numero} · {formatoSoles(pedido.totales.total)}
        </p>
      </div>
      {pedido.pago.metodo === "whatsapp" && (
        <p className="border border-warning-border bg-warning-surface p-4 text-body-sm text-fg">
          Tus productos están reservados hasta {textoReserva(pedido.pago.reservadoHasta, pedido.creadoEl)} {tienda.nombre} te escribirá por WhatsApp con los datos para pagar{recojo ? " y coordinar el recojo" : coordinar ? " y coordinar la entrega" : ""}.
        </p>
      )}
      <DetallePedido p={pedido} />
      {pagado && (
        <p className="text-body-sm text-fg-secondary">
          Te enviamos la confirmación por WhatsApp al <span className="whitespace-nowrap">{formatoCelular(pedido.datos.celular)}</span>. Ahí te avisamos cuando {recojo ? "esté listo para recoger" : "tu pedido salga"}.
        </p>
      )}
      <div className="flex flex-col gap-2 print:hidden">
        {!pagado && (
          <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={cn(buttonVariants(), "h-12")}>
            <MessageCircle aria-hidden strokeWidth={1.6} className="size-5" /> Enviar por WhatsApp
          </a>
        )}
        {pagado && <Link href={inicio} className={cn(buttonVariants(), "h-12")}>Seguir comprando</Link>}
        <Button variant="secondary" onClick={() => window.print()} className="h-12">
          <span className="flex items-center gap-2"><Download aria-hidden strokeWidth={1.6} className="size-4" /> Descargar resumen (PDF)</span>
        </Button>
        {pagado ? <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={enlace}>Escribir a la tienda</a> : <Link href={inicio} className={enlace}>Seguir comprando</Link>}
      </div>
    </div>
  );
}
