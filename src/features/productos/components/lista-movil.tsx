"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Checkbox } from "@/components/ui";
import type { Producto } from "../types";
import { motionTokens } from "@/styles/tokens";
import { AccionesFila } from "./acciones-fila";
import { CeldaEstado, CeldaPrecio, CeldaProducto, TextoInventario } from "./celdas";

const ease = [...motionTokens.easing] as [number, number, number, number];

type ListaProps = {
  productos: Producto[];
  seleccion: Set<string>;
  onAlternar: (id: string) => void;
  onDuplicar: (id: string) => void;
  onArchivar: (id: string) => void;
};

/** Móvil: una tarjeta compacta por producto (una tabla de 6 columnas no entra en 390 px). */
export function ListaMovil({ productos, seleccion, onAlternar, onDuplicar, onArchivar }: ListaProps) {
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
            className="group flex gap-1 py-4 pr-4 pl-2"
          >
            <Checkbox aria-label={`Seleccionar ${p.nombre}`} checked={seleccion.has(p.id)} onChange={() => onAlternar(p.id)} className="mt-1.5" />
            <div className="flex min-w-0 flex-1 flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <CeldaProducto p={p} />
                <CeldaPrecio p={p} />
              </div>
              {/* Sin sangría: estado arriba y unidades en una sola línea, para que las acciones táctiles quepan. */}
              <div className="flex items-end justify-between gap-3">
                <div className="flex min-w-0 flex-col items-start gap-1">
                  <CeldaEstado p={p} />
                  <TextoInventario p={p} />
                </div>
                <AccionesFila id={p.id} nombre={p.nombre} onDuplicar={() => onDuplicar(p.id)} onArchivar={() => onArchivar(p.id)} />
              </div>
            </div>
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}
