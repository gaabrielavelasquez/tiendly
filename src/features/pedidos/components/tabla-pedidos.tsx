"use client";

import { AnimatePresence, motion } from "motion/react";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";
import type { Pedido } from "../types";
import { motionTokens } from "@/styles/tokens";
import { AccionWhatsApp } from "./accion-whatsapp";
import { CeldaCliente, CeldaEntrega, CeldaPago, CeldaPedido, CeldaTotal } from "./celdas";

const ease = [...motionTokens.easing] as [number, number, number, number];
const th = "px-4 py-3 text-left encabezado-columna text-fg-secondary";

/**
 * Tabla de desktop con doble estado (pago y entrega): datos en Inter, encabezados en Outfit SemiBold,
 * filas con aire (py-4) y WhatsApp al pasar por la fila. Entrada escalonada sutil.
 */
export function TablaPedidos({ pedidos, ahora }: { pedidos: Pedido[]; ahora: string }) {
  const reduce = useReducedMotion();
  return (
    <table className="w-full border-collapse">
      <caption className="sr-only">Pedidos de tu tienda</caption>
      <thead>
        <tr className="border-b border-line-subtle bg-surface">
          <th scope="col" className={`${th} pl-6`}>Pedido</th>
          <th scope="col" className={th}>Cliente</th>
          <th scope="col" className={th}>Pago</th>
          <th scope="col" className={th}>Entrega</th>
          <th scope="col" className={`${th} text-right`}>Total</th>
          <th scope="col" className={`${th} pr-6`}>
            <span className="sr-only">Acciones</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <AnimatePresence initial={!reduce}>
          {pedidos.map((p, i) => (
            <motion.tr
              key={p.id}
              layout={reduce ? false : "position"}
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0 }}
              transition={{ duration: motionTokens.durationFast * 2, ease, delay: reduce ? 0 : Math.min(i, 10) * 0.03 }}
              className="group relative border-b border-line-subtle transition-colors last:border-b-0 hover:bg-surface"
            >
              <td className="py-4 pr-4 pl-6">
                <CeldaPedido p={p} ahora={ahora} />
              </td>
              <td className="max-w-64 px-4 py-4">
                <CeldaCliente p={p} />
              </td>
              <td className="px-4 py-4">
                <CeldaPago p={p} ahora={ahora} />
              </td>
              <td className="px-4 py-4">
                <CeldaEntrega p={p} />
              </td>
              <td className="px-4 py-4 text-right">
                <CeldaTotal p={p} />
              </td>
              <td className="relative z-10 w-px py-4 pr-6 pl-2">
                <AccionWhatsApp p={p} />
              </td>
            </motion.tr>
          ))}
        </AnimatePresence>
      </tbody>
    </table>
  );
}
