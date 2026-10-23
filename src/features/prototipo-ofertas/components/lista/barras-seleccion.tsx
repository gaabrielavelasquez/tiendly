"use client";

import { MoreHorizontal, Pause, TagIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui";
import { plural } from "@/lib/formato";

type Acciones = { cantidad: number; conOferta: number; onPausar: () => void; onQuitarOferta: () => void; onPonerEnOferta: () => void };

const icono = "size-4";

/** Desktop: barra arriba de la tabla al marcar productos (0027), con las acciones de 0034. */
export function BarraSeleccionDesktop({ cantidad, conOferta, onPausar, onQuitarOferta, onPonerEnOferta, onLimpiar }: Acciones & { onLimpiar: () => void }) {
  if (!cantidad) return null;
  return (
    <div role="region" aria-label="Acciones para los seleccionados" className="hidden items-center gap-3 rounded-card bg-sunken px-4 py-2 lg:flex">
      <p className="flex-1 text-body-sm font-semibold text-fg" aria-live="polite">{plural(cantidad, "seleccionado", "seleccionados")}</p>
      <Button variant="ghost" size="sm" onClick={onLimpiar}>Quitar selección</Button>
      <Button variant="secondary" size="sm" onClick={onPausar}><span className="flex items-center gap-1.5"><Pause aria-hidden strokeWidth={1.5} className={icono} />Pausar</span></Button>
      <Button variant="secondary" size="sm" onClick={onQuitarOferta} disabled={!conOferta}>Quitar oferta</Button>
      <Button variant="secondary" size="sm" onClick={onPonerEnOferta}><span className="flex items-center gap-1.5"><TagIcon aria-hidden strokeWidth={1.5} className={icono} />Poner en oferta</span></Button>
    </div>
  );
}

/**
 * Móvil (ronda 2): barra fija abajo con la acción principal "Poner en oferta (3)" y "Más" (Pausar, Quitar oferta).
 * La única salida del modo es "Cancelar", arriba (donde estaba "Seleccionar"). Tapa la barra de pestañas mientras dura.
 */
export function BarraSeleccionMovil({ cantidad, conOferta, onPausar, onQuitarOferta, onPonerEnOferta }: Acciones) {
  const [menu, setMenu] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!menu) return;
    const fuera = (e: PointerEvent) => !ref.current?.contains(e.target as Node) && setMenu(false);
    window.addEventListener("pointerdown", fuera);
    return () => window.removeEventListener("pointerdown", fuera);
  }, [menu]);
  const item = "flex min-h-12 w-full items-center gap-3 px-4 text-left text-body text-fg hover:bg-sunken disabled:text-fg-tertiary";
  return (
    <div ref={ref} className="fixed inset-x-0 bottom-0 z-45 border-t border-line-subtle bg-surface px-4 pt-3 pb-[max(calc(var(--spacing)*3),env(safe-area-inset-bottom))] lg:hidden">
      {menu && (
        <div role="menu" className="absolute right-4 bottom-full left-4 mb-2 overflow-hidden rounded-card bg-surface py-1 shadow-overlay">
          <button type="button" role="menuitem" className={item} disabled={!cantidad} onClick={() => (setMenu(false), onPausar())}>
            <Pause aria-hidden strokeWidth={1.5} className={icono} />Pausar
          </button>
          <button type="button" role="menuitem" className={item} disabled={!conOferta} onClick={() => (setMenu(false), onQuitarOferta())}>
            <TagIcon aria-hidden strokeWidth={1.5} className={icono} />Quitar oferta{conOferta ? ` (${conOferta})` : ""}
          </button>
        </div>
      )}
      <div className="flex gap-2">
        <Button variant="secondary" aria-haspopup="menu" aria-expanded={menu} disabled={!cantidad} onClick={() => setMenu((m) => !m)}>
          <span className="flex items-center gap-1.5"><MoreHorizontal aria-hidden strokeWidth={1.5} className={icono} />Más</span>
        </Button>
        <Button className="flex-1" disabled={!cantidad} onClick={onPonerEnOferta}>Poner en oferta{cantidad ? ` (${cantidad})` : ""}</Button>
      </div>
    </div>
  );
}
