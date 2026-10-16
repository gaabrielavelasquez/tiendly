"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { Producto } from "../types";
import { motionTokens } from "@/styles/tokens";
import { AccionesFila } from "./acciones-fila";
import { CeldaInventario, CeldaPrecio, CeldaProducto } from "./celdas";

const ease = [...motionTokens.easing] as [number, number, number, number];

type ListaProps = { productos: Producto[]; onDuplicar: (id: string) => void; onArchivar: (id: string) => void };

/** Móvil: una tarjeta compacta por producto (una tabla de 5 columnas no entra en 390 px). */
export function ListaMovil({ productos, onDuplicar, onArchivar }: ListaProps) {
  const reduce = useReducedMotion();
  return (
    <ul className="flex flex-col divide-y divide-line-subtle">
      <AnimatePresence initial={!reduce}>
        {productos.map((p, i) => (
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
              <CeldaProducto p={p} />
              <CeldaPrecio p={p} />
            </div>
            <div className="flex items-center justify-between gap-3 pl-15">
              <CeldaInventario p={p} />
              <AccionesFila id={p.id} nombre={p.nombre} onDuplicar={() => onDuplicar(p.id)} onArchivar={() => onArchivar(p.id)} />
            </div>
            {p.estado === "borrador" && <span className="pl-15 text-caption text-fg-secondary">Borrador: no se ve en tu tienda.</span>}
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}
