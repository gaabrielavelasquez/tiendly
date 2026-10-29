"use client";

import { ShoppingBag } from "lucide-react";
import { EmptyState, Skeleton } from "@/components/ui";
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
  /** Acción del estado vacío ("Seguir comprando"). */
  vacio: React.ReactNode;
  onIr?: () => void;
};

/**
 * Cuerpo del carrito, igual en el drawer y en /carrito (0036): las líneas en UN contenedor con divisores (0031), con
 * "Deshacer" en el lugar de la que se quitó; el avance al envío gratis (si la tienda lo ofrece) y el cupón (si tiene
 * alguno activo). Estados: cargando (esqueleto), vacío y con productos. Vacío: sin envío gratis ni cupón; si se
 * acaba de quitar el último, "Deshacer" queda arriba del mensaje.
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
  const deshacer = v.quitado && (
    <li key="quitado" className="flex items-center justify-between gap-3 bg-surface px-4 py-2 text-body-sm">
      <span className="min-w-0 truncate text-fg-secondary">Quitaste {v.quitado.linea.nombre}.</span>
      <button type="button" onClick={v.deshacer} className="link-text min-h-11 shrink-0 font-semibold">Deshacer</button>
    </li>
  );
  const lista = (filas: React.ReactNode) => (
    <ul aria-label="Productos en tu carrito" className="flex flex-col divide-y divide-line-subtle overflow-hidden rounded-card border border-line-subtle">
      {filas}
    </ul>
  );
  const aviso = <p role="status" className="sr-only">{v.quitado ? `Quitaste ${v.quitado.linea.nombre} del carrito.` : ""}</p>;
  if (v.lineas.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        {deshacer && lista(deshacer)}
        {aviso}
        <EmptyState icon={ShoppingBag} title="Tu carrito está vacío." description="Cuando agregues productos, aparecerán aquí." action={vacio} />
      </div>
    );
  }
  const filas: React.ReactNode[] = v.lineas.map((l, i) => (
    <LineaCarrito key={`${l.id}|${l.variante}`} linea={l} tienda={tienda} prioridad={i < 2} resaltada={resaltar === `${l.id}|${l.variante}`}
      onCantidad={(n) => v.cambiarCantidad(l, n)} onQuitar={() => v.quitar(l)} onIr={onIr} />
  ));
  if (v.quitado) filas.splice(Math.min(v.quitado.indice, filas.length), 0, deshacer);
  return (
    <div className="flex flex-col gap-4">
      {lista(filas)}
      {aviso}
      <EnvioGratis base={v.totales.productos - v.totales.descuento} desde={v.reglasEnvio} />
      {(hayCupones || v.cupon) && <Cupon cupon={v.cupon} descuento={v.totales.descuento} validar={v.validarCupon} onAplicar={v.setCupon} />}
    </div>
  );
}
