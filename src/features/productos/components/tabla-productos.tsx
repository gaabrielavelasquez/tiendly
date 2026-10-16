"use client";

import { AnimatePresence, motion } from "motion/react";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";
import { Checkbox } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { Producto } from "../types";
import { motionTokens } from "@/styles/tokens";
import { AccionesFila } from "./acciones-fila";
import { CeldaEstado, CeldaInventario, CeldaPrecio, CeldaProducto } from "./celdas";

const ease = [...motionTokens.easing] as [number, number, number, number];
const th = "px-4 py-3 text-left encabezado-columna text-fg-secondary";

type TablaProps = {
  productos: Producto[];
  seleccion: Set<string>;
  onAlternar: (id: string) => void;
  onAlternarTodos: () => void;
  onDuplicar: (id: string) => void;
  onArchivar: (id: string) => void;
};

/**
 * Tabla de desktop: casilla por fila + maestro, datos en Inter, encabezados en Outfit SemiBold,
 * filas con aire (py-4). Entrada escalonada sutil y salida suave al archivar.
 */
export function TablaProductos({ productos, seleccion, onAlternar, onAlternarTodos, onDuplicar, onArchivar }: TablaProps) {
  const reduce = useReducedMotion();
  const marcados = productos.filter((p) => seleccion.has(p.id)).length;
  return (
    <table className="w-full border-collapse">
      <caption className="sr-only">Productos de tu tienda</caption>
      <thead>
        <tr className="border-b border-line-subtle bg-sunken/60">
          <th scope="col" className="w-px py-1 pr-0 pl-4">
            <Checkbox
              aria-label="Seleccionar todos los productos de la lista"
              checked={marcados > 0 && marcados === productos.length}
              indeterminate={marcados > 0 && marcados < productos.length}
              onChange={onAlternarTodos}
            />
          </th>
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
          {productos.map((p, i) => {
            const marcado = seleccion.has(p.id);
            return (
              <motion.tr
                key={p.id}
                layout={reduce ? false : "position"}
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0 }}
                transition={{ duration: motionTokens.durationFast * 2, ease, delay: reduce ? 0 : Math.min(i, 10) * 0.03 }}
                className={cn(
                  "group border-b border-line-subtle transition-colors last:border-b-0",
                  marcado ? "bg-sunken" : "hover:bg-sunken/60",
                )}
              >
                <td className="py-4 pr-0 pl-4">
                  <Checkbox aria-label={`Seleccionar ${p.nombre}`} checked={marcado} onChange={() => onAlternar(p.id)} />
                </td>
                <td className="max-w-80 px-4 py-4">
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
            );
          })}
        </AnimatePresence>
      </tbody>
    </table>
  );
}
