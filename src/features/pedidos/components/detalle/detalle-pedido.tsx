"use client";

import { AnimatePresence, motion } from "motion/react";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";
import { motionTokens } from "@/styles/tokens";
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
  const reduce = useReducedMotion();

  return (
    <div className="flex flex-col gap-10 pb-[calc(var(--spacing)*36+env(safe-area-inset-bottom))] lg:gap-12 lg:pb-0">
      <BarraPedido pedido={d.pedido} ahora={ahora} onAccion={d.ejecutar} />
      {/* Orden del DOM móvil; desktop reparte las mismas secciones en dos columnas, sin duplicar controles. */}
      <div className="grid min-w-0 grid-cols-1 items-start gap-10 lg:grid-cols-3 lg:gap-12">
        <div className="min-w-0 lg:col-span-2 lg:row-span-2"><TarjetaItems pedido={d.pedido} detalle={d.detalle} /></div>
        <div className="min-w-0 lg:col-start-3 lg:row-start-1"><TarjetaPago pedido={d.pedido} ahora={ahora} /></div>
        <div className="min-w-0 lg:col-start-3 lg:row-start-2"><TarjetaCliente pedido={d.pedido} detalle={d.detalle} /></div>
        <div className="min-w-0 lg:col-span-2 lg:row-span-2 lg:row-start-3"><TarjetaHistorial pasos={lineaDeTiempo(d.pedido, d.detalle, ahora)} /></div>
        <div className="min-w-0 lg:col-start-3 lg:row-start-3"><TarjetaEntrega pedido={d.pedido} detalle={d.detalle} /></div>
        <div className="min-w-0 lg:col-start-3 lg:row-start-4"><TarjetaNotas pedidoId={d.pedido.id} inicial={d.detalle.nota} /></div>
      </div>

      <div role="status" className="pointer-events-none fixed inset-x-4 bottom-24 z-30 flex justify-center lg:inset-x-auto lg:right-8 lg:bottom-8">
        <AnimatePresence>
          {d.aviso && (
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: 12 }}
              transition={{ duration: motionTokens.durationFast, ease: [...motionTokens.easing] as [number, number, number, number] }}
              className="pointer-events-auto flex w-full max-w-sm items-center justify-between gap-4 rounded-card bg-inverse py-2 pr-2 pl-4 text-body-sm text-fg-inverse shadow-overlay"
            >
              <span className="min-w-0 break-words">{d.aviso}</span>
              {d.puedeDeshacer && <button type="button" onClick={d.deshacer} className="h-9 shrink-0 rounded-theme px-3 font-semibold hover:bg-fg-inverse/10">
                Deshacer
              </button>}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
