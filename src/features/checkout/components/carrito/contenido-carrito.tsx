"use client";

import { ShoppingBag } from "lucide-react";
import { EmptyState, Skeleton } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { VistaCarrito } from "../../hooks/use-vista-carrito";
import { Cupon } from "../cupon";
import { EnvioGratis } from "./envio-gratis";
import { LineaCarrito } from "./linea-carrito";

type Props = {
  v: VistaCarrito;
  tienda: string;
  hayCupones: boolean;
  /** Clave "id|variante" de lo recién agregado: se resalta un momento. */
  resaltar?: string | null;
  /** Acción del estado vacío ("Ver productos"). */
  vacio: React.ReactNode;
  onIr?: () => void;
};

/**
 * Cuerpo del carrito, igual en el drawer y en /carrito (0036): las líneas en UN contenedor con divisores (0031), con
 * "Deshacer" en el lugar de la que se quitó; el avance al envío gratis (si la tienda lo ofrece) y el cupón (si tiene
 * alguno activo). Estados: cargando (esqueleto), vacío y con productos.
 */
export function ContenidoCarrito({ v, tienda, hayCupones, resaltar, vacio, onIr }: Props) {
  if (v.lineas === null) {
    return (
      <div aria-busy className="flex flex-col gap-3">
        <span className="sr-only">Cargando tu carrito</span>
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
    );
  }
  if (v.lineas.length === 0 && !v.quitado) {
    return <EmptyState icon={ShoppingBag} title="Tu carrito está vacío" description="Cuando agregues productos, aparecerán aquí." action={vacio} />;
  }
  const filas: React.ReactNode[] = v.lineas.map((l, i) => (
    <LineaCarrito key={`${l.id}|${l.variante}`} linea={l} tienda={tienda} prioridad={i < 2} resaltada={resaltar === `${l.id}|${l.variante}`}
      onCantidad={(n) => v.cambiarCantidad(l, n)} onQuitar={() => v.quitar(l)} onIr={onIr} />
  ));
  if (v.quitado) {
    filas.splice(Math.min(v.quitado.indice, filas.length), 0, (
      <li key="quitado" className="flex items-center justify-between gap-3 bg-surface px-4 py-2 text-body-sm">
        <span className="min-w-0 truncate text-fg-secondary">Quitaste {v.quitado.linea.nombre}.</span>
        <button type="button" onClick={v.deshacer} className="link-text min-h-11 shrink-0 font-semibold">Deshacer</button>
      </li>
    ));
  }
  return (
    <div className="flex flex-col gap-4">
      <ul aria-label="Productos en tu carrito" className={cn("flex flex-col divide-y divide-line-subtle overflow-hidden rounded-card border border-line-subtle")}>
        {filas}
      </ul>
      <p role="status" className="sr-only">{v.quitado ? `Quitaste ${v.quitado.linea.nombre} del carrito.` : ""}</p>
      <EnvioGratis base={v.totales.productos - v.totales.descuento} desde={v.reglasEnvio} />
      {(hayCupones || v.cupon) && <Cupon cupon={v.cupon} descuento={v.totales.descuento} validar={v.validarCupon} onAplicar={v.setCupon} />}
    </div>
  );
}
