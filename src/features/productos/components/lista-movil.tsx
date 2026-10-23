"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRef } from "react";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";
import { cn } from "@/lib/cn";
import { motionTokens } from "@/styles/tokens";
import type { Producto } from "../types";
import { AccionesFila } from "./acciones-fila";
import { CeldaEstado, CeldaPrecio, CeldaProducto, TextoInventario } from "./celdas";

const ease = [...motionTokens.easing] as [number, number, number, number];

type ListaProps = {
  productos: Producto[];
  hoy: string;
  onDuplicar: (id: string) => void;
  seleccionando: boolean;
  seleccion: Set<string>;
  onAlternar: (id: string) => void;
  /** Mantener presionado una fila (450 ms): entra al modo selección con esa fila marcada (0034). */
  onMantener: (id: string) => void;
};

/** El contenido de una fila: producto, precio con su oferta (en su propia línea, para no apretar el nombre) y estado. */
function Contenido({ p, hoy, seleccionando, onDuplicar }: { p: Producto; hoy: string; seleccionando: boolean; onDuplicar: () => void }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-2">
      <CeldaProducto p={p} enlace={!seleccionando} />
      <CeldaPrecio p={p} hoy={hoy} alinear="izquierda" />
      <div className="flex items-end justify-between gap-3">
        <div className="flex min-w-0 flex-col items-start gap-1">
          <CeldaEstado p={p} />
          <TextoInventario p={p} />
        </div>
        {!seleccionando && <AccionesFila id={p.id} nombre={p.nombre} onDuplicar={onDuplicar} />}
      </div>
    </div>
  );
}

/**
 * Móvil: una lista en UN contenedor con divisores (0031). Sin casillas por defecto; en modo selección (0034) cada fila
 * es la etiqueta de su casilla: tocar en cualquier parte la marca. Mantener presionado entra al modo sin abrir el producto.
 */
export function ListaMovil({ productos, hoy, onDuplicar, seleccionando, seleccion, onAlternar, onMantener }: ListaProps) {
  const reduce = useReducedMotion();
  const timer = useRef<number | undefined>(undefined);
  const largo = useRef(false);
  const soltar = () => window.clearTimeout(timer.current);
  return (
    <ul className="flex flex-col divide-y divide-line-subtle">
      <AnimatePresence initial={!reduce}>
        {productos.map((p, i) => {
          const marcado = seleccion.has(p.id);
          return (
            <motion.li
              key={p.id}
              layout={reduce ? false : "position"}
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0 }}
              transition={{ duration: motionTokens.durationFast * 2, ease, delay: reduce ? 0 : Math.min(i, 10) * 0.03 }}
              className={cn("transition-colors", marcado && "bg-sunken")}
            >
              {seleccionando ? (
                <label className="flex cursor-pointer gap-3 px-4 py-4">
                  <input type="checkbox" checked={marcado} onChange={() => onAlternar(p.id)} aria-label={`Seleccionar ${p.nombre}`} className="mt-3.5 size-5 shrink-0 accent-selected" />
                  <Contenido p={p} hoy={hoy} seleccionando onDuplicar={() => onDuplicar(p.id)} />
                </label>
              ) : (
                <div
                  className="group flex px-4 py-4 select-none"
                  onPointerDown={() => ((largo.current = false), (timer.current = window.setTimeout(() => ((largo.current = true), navigator.vibrate?.(10), onMantener(p.id)), 450)))}
                  onPointerUp={soltar}
                  onPointerLeave={soltar}
                  onPointerCancel={soltar}
                  onContextMenu={(e) => e.preventDefault()}
                  onClickCapture={(e) => largo.current && (e.preventDefault(), e.stopPropagation(), (largo.current = false))}
                >
                  <Contenido p={p} hoy={hoy} seleccionando={false} onDuplicar={() => onDuplicar(p.id)} />
                </div>
              )}
            </motion.li>
          );
        })}
      </AnimatePresence>
    </ul>
  );
}
