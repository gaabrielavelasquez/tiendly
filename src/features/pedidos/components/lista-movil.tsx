"use client";

import { AnimatePresence, motion } from "motion/react";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";
import type { Pedido } from "../types";
import { motionTokens } from "@/styles/tokens";
import { AccionWhatsApp } from "./accion-whatsapp";
import { CeldaCliente, CeldaEntrega, CeldaPago, CeldaPedido, CeldaTotal } from "./celdas";

const ease = [...motionTokens.easing] as [number, number, number, number];

/** Móvil: una tarjeta por pedido. Arriba número y total; al medio el cliente; abajo los dos estados. */
export function ListaMovilPedidos({ pedidos, ahora }: { pedidos: Pedido[]; ahora: string }) {
  const reduce = useReducedMotion();
  return (
    <ul className="flex flex-col divide-y divide-line-subtle">
      <AnimatePresence initial={!reduce}>
        {pedidos.map((p, i) => (
          <motion.li
            key={p.id}
            layout={reduce ? false : "position"}
            initial={reduce ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: motionTokens.durationFast * 2, ease, delay: reduce ? 0 : Math.min(i, 10) * 0.03 }}
            className="group flex flex-col gap-3 px-4 py-4"
          >
            <div className="flex items-start justify-between gap-3">
              <CeldaPedido p={p} ahora={ahora} />
              <CeldaTotal p={p} />
            </div>
            <div className="flex items-center justify-between gap-3">
              <CeldaCliente p={p} />
              <AccionWhatsApp p={p} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <CeldaPago p={p} ahora={ahora} />
              <CeldaEntrega p={p} />
            </div>
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}
