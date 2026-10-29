"use client";

import { Check, CloudOff, Clock3, Download, MessageCircle, SearchX } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button, buttonVariants, EmptyState, Skeleton } from "@/components/ui";
import { MontoPedido as Monto } from "@/features/pedidos/components/monto-pedido";
import { estiloCompra } from "../../lib/presentacion";
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
  const [error, setError] = useState(false);
  function cargar() {
    setError(false);
    try {
      const guardado = JSON.parse(localStorage.getItem(`tiendly:pedidos:${tienda.slug}`) ?? "{}");
      if (!guardado || typeof guardado !== "object") throw new Error("Pedido no válido.");
      const p = leerPedido(tienda.slug, numero);
      if (p && (!p.datos?.nombre || !p.totales || !p.pago?.metodo || !p.entrega?.tipo)) throw new Error("Pedido incompleto.");
      setPedido(p);
    } catch { setError(true); }
  }
  useEffect(() => { cargar(); }, [tienda.slug, numero]); // eslint-disable-line react-hooks/exhaustive-deps
  const inicio = `/${tienda.slug}`;

  if (error) return <EmptyState simple icon={CloudOff} title="No pudimos cargar tu pedido" description="Revisa tu conexión o los datos guardados e inténtalo de nuevo." action={<Button onClick={cargar}>Reintentar</Button>} />;
  if (pedido === undefined) {
    return (
      <div aria-busy className="w-full max-w-xl">
        <span className="sr-only">Cargando tu pedido</span>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }
  if (!pedido) {
    return <EmptyState simple icon={SearchX} title="No encontramos este pedido" description="Si lo hiciste en otro celular o navegador, revisa tu WhatsApp: ahí te llegó la confirmación." action={<Link href={inicio} className={buttonVariants()}>Volver a la tienda</Link>} />;
  }

  const pagado = pedido.pago.metodo !== "whatsapp";
  const recojo = pedido.entrega.tipo === "recojo";
  const coordinar = pedido.entrega.tipo === "coordinar";
  const whatsapp = linkWhatsApp(tienda.celular, pagado ? `Hola ${tienda.nombre}, tengo una consulta sobre mi pedido #${numero}.` : mensajePedido({ ...pedido, tienda: tienda.nombre }));
  const enlace = cn(buttonVariants({ variant: "ghost" }), "h-12 text-fg");

  return (
    <div style={estiloCompra} className="flex w-full min-w-0 max-w-xl flex-col gap-10 pb-32 lg:gap-12 lg:pb-0">
      <div className="flex flex-col items-start gap-3">
        {pagado ? <Check aria-hidden strokeWidth={1.5} className="size-8 text-icon" /> : <Clock3 aria-hidden strokeWidth={1.5} className="size-8 text-icon" />}
        <h1 className="font-display-light text-h1 text-fg">{pagado ? "Pedido confirmado" : "Pedido registrado"}<span className="block text-fg-secondary">{pagado ? "Tu pedido está pagado." : "Coordina el pago por WhatsApp."}</span></h1>
        <p className="break-words text-body-sm text-fg-secondary">Pedido #{numero}</p>
        <Monto valor={pedido.totales.total} className="text-h2 font-semibold text-fg" />
      </div>
      {pedido.pago.metodo === "whatsapp" && <div className="flex flex-col gap-2">
        <p className="text-body-sm text-warning">Tus productos están reservados hasta {textoReserva(pedido.pago.reservadoHasta, pedido.creadoEl)}</p>
        <p className="text-body-sm text-fg-secondary">Para confirmarlo, envía el mensaje por WhatsApp. {tienda.nombre} te escribirá con los datos para pagar{recojo ? " y coordinar el recojo" : coordinar ? " y coordinar la entrega" : ""}.</p>
      </div>}
      <DetallePedido p={pedido} />
      {pagado && (
        <p className="text-body-sm text-fg-secondary">
          Te enviamos la confirmación por WhatsApp al <span className="whitespace-nowrap">{formatoCelular(pedido.datos.celular)}</span>. Ahí te avisamos cuando {recojo ? "esté listo para recoger" : "tu pedido salga"}.
        </p>
      )}
      <div className="flex flex-col gap-3 print:hidden">
        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-line-subtle bg-surface px-4 pt-3 pb-[max(env(safe-area-inset-bottom),--spacing(3))] lg:static lg:border-0 lg:bg-transparent lg:p-0">
        {!pagado && (
          <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={cn(buttonVariants({ block: true }), "h-12")}>
            <MessageCircle aria-hidden strokeWidth={1.6} className="size-5" /> Enviar por WhatsApp
          </a>
        )}
        {pagado && <Link href={inicio} className={cn(buttonVariants({ block: true }), "h-12")}>Seguir comprando</Link>}
        </div>
        <Button variant="secondary" onClick={() => window.print()} className="h-12">
          <span className="flex items-center gap-2"><Download aria-hidden strokeWidth={1.6} className="size-4" /> Descargar resumen (PDF)</span>
        </Button>
        {pagado ? <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={enlace}>Escribir a la tienda</a> : <Link href={inicio} className={enlace}>Seguir comprando</Link>}
      </div>
    </div>
  );
}
