"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { Producto } from "../types";
import { motionTokens } from "@/styles/tokens";
import { AccionesFila } from "./acciones-fila";
import { CeldaEstado, CeldaInventario, CeldaPrecio, CeldaProducto } from "./celdas";

const ease = [...motionTokens.easing] as [number, number, number, number];
const th = "px-4 py-3 text-left font-display-title text-caption text-fg-secondary first:pl-6";

type TablaProps = { productos: Producto[]; onDuplicar: (id: string) => void; onArchivar: (id: string) => void };

/**
 * Tabla de desktop: datos en Inter, encabezados en Outfit SemiBold, filas con aire (py-4).
 * Entrada escalonada sutil y salida suave al archivar; acciones al pasar por la fila.
 */
export function TablaProductos({ productos, onDuplicar, onArchivar }: TablaProps) {
  const reduce = useReducedMotion();
  return (
    <table className="w-full border-collapse">
      <caption className="sr-only">Productos de tu tienda</caption>
      <thead>
        <tr className="border-b border-line-subtle bg-sunken/60">
          <th scope="col" className={th}>Producto</th>
          <th scope="col" className={th}>Estado</th>
          <th scope="col" className={th}>Inventario</th>
          <th scope="col" className={`${th} text-right`}>Precio</th>
          <th scope="col" className={`${th} pr-6`}>
            <span className="sr-only">Acciones</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <AnimatePresence initial={!reduce}>
          {productos.map((p, i) => (
            <motion.tr
              key={p.id}
              layout={reduce ? false : "position"}
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0 }}
              transition={{ duration: motionTokens.durationFast * 2, ease, delay: reduce ? 0 : Math.min(i, 10) * 0.03 }}
              className="group border-b border-line-subtle transition-colors last:border-b-0 hover:bg-sunken/60"
            >
              <td className="max-w-80 py-4 pr-4 pl-6">
                <CeldaProducto p={p} />
              </td>
              <td className="px-4 py-4">
                <CeldaEstado p={p} />
              </td>
              <td className="px-4 py-4">
                <CeldaInventario p={p} />
              </td>
              <td className="px-4 py-4 text-right">
                <CeldaPrecio p={p} />
              </td>
              <td className="w-px py-4 pr-6 pl-4">
                <AccionesFila id={p.id} nombre={p.nombre} onDuplicar={() => onDuplicar(p.id)} onArchivar={() => onArchivar(p.id)} />
              </td>
            </motion.tr>
          ))}
        </AnimatePresence>
      </tbody>
    </table>
  );
}
