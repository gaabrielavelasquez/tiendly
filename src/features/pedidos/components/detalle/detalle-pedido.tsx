"use client";

import { AnimatePresence } from "motion/react";
import { AvisoPedido } from "./aviso-pedido";
import type { DetallePedido, Pedido } from "../../types";
import { useDetallePedido } from "../../hooks/use-detalle-pedido";
import { lineaDeTiempo } from "../../lib/detalle";
import { BarraPedido } from "./barra-pedido";
import { TarjetaHistorial } from "./tarjeta-historial";
import { TarjetaItems } from "./tarjeta-items";
import { TarjetaNotas } from "./tarjeta-notas";
import { TarjetaPago } from "./tarjeta-pago";
import { TarjetaCliente, TarjetaEntrega } from "./tarjetas-laterales";

type DetalleProps = { pedido: Pedido; detalle: DetallePedido; ahora: string };

/**
 * Detalle del pedido en dos columnas (2/3 productos e historial, 1/3 cliente, entrega y notas),
 * con la misma lógica que el formulario de producto. Las acciones avisan; cancelar requiere confirmar y no se puede deshacer.
 */
export function DetallePedidoVista({ pedido, detalle, ahora }: DetalleProps) {
  const d = useDetallePedido(pedido, detalle, ahora);

  return (
    <div className="flex flex-col gap-10 pb-[calc(var(--spacing)*36+env(safe-area-inset-bottom))] lg:gap-12 lg:pb-0">
      <BarraPedido pedido={d.pedido} ahora={ahora} onAccion={d.ejecutar} />
      {/* Orden del DOM móvil; desktop reparte las mismas secciones en dos columnas, sin duplicar controles. */}
      <div className="grid min-w-0 grid-cols-1 items-start gap-10 lg:grid-cols-3 lg:gap-12">
        <div className="min-w-0 lg:col-span-2 lg:row-span-2"><TarjetaItems pedido={d.pedido} detalle={d.detalle} /></div>
        <div className="min-w-0 lg:col-start-3 lg:row-start-1"><TarjetaPago pedido={d.pedido} ahora={ahora} onDesmarcar={() => d.ejecutar("desmarcar-pago")} /></div>
        <div className="min-w-0 lg:col-start-3 lg:row-start-2"><TarjetaCliente pedido={d.pedido} detalle={d.detalle} /></div>
        <div className="min-w-0 lg:col-span-2 lg:row-span-2 lg:row-start-3"><TarjetaHistorial pasos={lineaDeTiempo(d.pedido, d.detalle, ahora)} /></div>
        <div className="min-w-0 lg:col-start-3 lg:row-start-3"><TarjetaEntrega pedido={d.pedido} detalle={d.detalle} /></div>
        <div className="min-w-0 lg:col-start-3 lg:row-start-4"><TarjetaNotas pedidoId={d.pedido.id} inicial={d.detalle.nota} /></div>
      </div>

      <div role="status" className="pointer-events-none fixed inset-x-4 bottom-24 z-30 flex justify-center lg:inset-x-auto lg:right-8 lg:bottom-8">
        <AnimatePresence>
          {d.aviso && <AvisoPedido key={d.avisoId} texto={d.aviso} onCerrar={d.cerrarAviso} onDeshacer={d.puedeDeshacer ? d.deshacer : undefined} />}
        </AnimatePresence>
      </div>
    </div>
  );
}
