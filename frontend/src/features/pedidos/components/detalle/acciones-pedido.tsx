"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { HojaModal } from "@/features/afiliacion/components/hoja-modal";
import { cn } from "@/lib/cn";
import type { Pedido } from "../../types";
import { puedeCancelar, siguienteAccion, type AccionPedido } from "../../lib/detalle";

type AccionesProps = { pedido: Pedido; onAccion: (a: AccionPedido) => void; className?: string };

/** Cancelación irreversible con diálogo nativo; las demás acciones conservan su siguiente paso. */
export function AccionesPedido({ pedido, onAccion, className }: AccionesProps) {
  const [confirmando, setConfirmando] = useState(false);
  const siguiente = siguienteAccion(pedido);
  const cancelable = puedeCancelar(pedido);
  if (!siguiente && !cancelable) return null;
  return (
    <>
      <div className={cn("flex items-center gap-2", className)}>
        {cancelable && (
          <Button variant="ghost" onClick={() => setConfirmando(true)} className="shrink-0 text-fg-secondary hover:bg-sunken hover:text-fg">
            Cancelar pedido
          </Button>
        )}
        {siguiente && (
          <Button onClick={() => onAccion(siguiente.id)} className="h-auto min-h-10 min-w-0 flex-1 py-2 whitespace-normal text-center sm:flex-none">
            {siguiente.label}
          </Button>
        )}
      </div>
      <HojaModal titulo="Cancelar pedido" abierto={confirmando} cerrar={() => setConfirmando(false)}>
        <p className="text-body text-fg-secondary">Se cancelará el pedido #{pedido.numero}. Esta acción no se puede deshacer.</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button autoFocus data-foco-inicial variant="secondary" onClick={() => setConfirmando(false)}>Conservar pedido</Button>
          <Button variant="danger" onClick={() => { setConfirmando(false); onAccion("cancelar"); }}>Sí, cancelar pedido</Button>
        </div>
      </HojaModal>
    </>
  );
}
