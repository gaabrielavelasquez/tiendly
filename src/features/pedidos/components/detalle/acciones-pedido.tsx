"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { Pedido } from "../../types";
import { puedeCancelar, siguienteAccion, type Accion } from "../../lib/detalle";

type AccionesProps = { pedido: Pedido; onAccion: (a: Accion | "cancelar") => void; className?: string };

/**
 * Acciones del pedido: "Cancelar pedido" (fantasma, pide confirmar en el lugar) y la siguiente acción
 * lógica como CTA (degradado cobalto). Si el pedido ya terminó, no muestra nada.
 */
export function AccionesPedido({ pedido, onAccion, className }: AccionesProps) {
  const [confirmando, setConfirmando] = useState(false);
  const siguiente = siguienteAccion(pedido);
  const cancelable = puedeCancelar(pedido);

  useEffect(() => {
    if (!confirmando) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setConfirmando(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [confirmando]);

  if (!siguiente && !cancelable) return null;

  if (confirmando) {
    return (
      <div role="group" aria-label="Confirmar cancelación" className={cn("flex items-center gap-2", className)}>
        <span className="hidden text-body-sm text-fg sm:inline">¿Cancelar este pedido?</span>
        <Button variant="ghost" onClick={() => setConfirmando(false)} autoFocus>
          No
        </Button>
        <Button variant="danger" onClick={() => (setConfirmando(false), onAccion("cancelar"))}>
          Sí, cancelar
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {cancelable && (
        <Button variant="ghost" onClick={() => setConfirmando(true)} className="text-fg-secondary hover:bg-sunken hover:text-fg">
          Cancelar pedido
        </Button>
      )}
      {siguiente && (
        <Button onClick={() => onAccion(siguiente.id)} className="flex-1 sm:flex-none">
          {siguiente.label}
        </Button>
      )}
    </div>
  );
}
