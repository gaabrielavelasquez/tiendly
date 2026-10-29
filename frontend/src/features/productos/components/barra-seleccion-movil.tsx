"use client";

import { Ellipsis, Pause, Tag } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui";

type Props = { cantidad: number; conOferta: number; onPausar: () => void; onQuitarOferta: () => void; onPonerEnOferta: () => void };

const item = "flex min-h-12 w-full items-center gap-3 px-4 text-left text-body text-fg hover:bg-sunken disabled:text-fg-tertiary";

/**
 * Móvil, modo selección (0034): barra fija abajo con la acción principal "Poner en oferta (3)" y "Más" (Pausar,
 * Quitar oferta). La barra de pestañas se oculta mientras tanto. Para salir: "Cancelar", arriba.
 */
export function BarraSeleccionMovil({ cantidad, conOferta, onPausar, onQuitarOferta, onPonerEnOferta }: Props) {
  const [menu, setMenu] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!menu) return;
    const fuera = (e: PointerEvent) => !ref.current?.contains(e.target as Node) && setMenu(false);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    window.addEventListener("pointerdown", fuera);
    window.addEventListener("keydown", esc);
    return () => (window.removeEventListener("pointerdown", fuera), window.removeEventListener("keydown", esc));
  }, [menu]);
  return (
    <div ref={ref} className="fixed inset-x-0 bottom-0 z-40 border-t border-line-subtle bg-surface px-4 pt-3 pb-[max(calc(var(--spacing)*3),env(safe-area-inset-bottom))] lg:hidden">
      {menu && (
        <div role="menu" aria-label="Más acciones" className="absolute right-4 bottom-full left-4 mb-2 overflow-hidden rounded-card bg-surface py-1 shadow-overlay">
          <button type="button" role="menuitem" className={item} onClick={() => (setMenu(false), onPausar())}>
            <Pause aria-hidden strokeWidth={1.5} className="size-4" />
            Pausar
          </button>
          <button type="button" role="menuitem" className={item} disabled={!conOferta} onClick={() => (setMenu(false), onQuitarOferta())}>
            <Tag aria-hidden strokeWidth={1.5} className="size-4" />
            Quitar oferta{conOferta ? ` (${conOferta})` : ""}
          </button>
        </div>
      )}
      <div className="flex gap-2">
        <Button variant="secondary" aria-haspopup="menu" aria-expanded={menu} disabled={!cantidad} onClick={() => setMenu((m) => !m)}>
          <span className="flex items-center gap-1.5"><Ellipsis aria-hidden strokeWidth={1.5} className="size-4" />Más</span>
        </Button>
        <Button className="flex-1" disabled={!cantidad} onClick={onPonerEnOferta}>Poner en oferta{cantidad ? ` (${cantidad})` : ""}</Button>
      </div>
    </div>
  );
}
