"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/cn";

type Props = { valor: string; etiqueta: string; onCambio: (v: string) => void };

const BOTON = "relative flex size-10 shrink-0 items-center justify-center rounded-button border border-line-strong bg-surface text-fg transition active:scale-98 disabled:text-fg-tertiary after:absolute after:-inset-1 after:content-['']";
export const CANTIDAD = "h-10 w-20 rounded-button border border-line-strong bg-surface px-3 text-right text-body tabular-nums text-fg outline-2 outline-offset-2 outline-transparent placeholder:text-fg-tertiary focus:outline-focus";

/** En 0: "Agotada" debajo, como texto de color (sin píldora, 0031). Reserva el alto para que nada salte. */
export function Agotada({ valor, className }: { valor: string; className?: string }) {
  const cero = !(Number(valor) > 0);
  return <span aria-hidden={!cero} className={cn("text-caption", cero ? "text-error" : "invisible", className)}>Agotada</span>;
}

/** Móvil: − cantidad + (zona táctil de 44 px). La cantidad también se puede escribir. */
export function Stepper({ valor, etiqueta, onCambio }: Props) {
  const n = Number(valor) || 0;
  return (
    <span className="flex flex-col items-end gap-0.5">
      <span className="flex items-center gap-1.5">
        <button type="button" className={BOTON} aria-label={`Restar 1 a ${etiqueta}`} disabled={n === 0} onClick={() => onCambio(String(n - 1))}>
          <Minus aria-hidden strokeWidth={1.5} className="size-4" />
        </button>
        <input inputMode="numeric" aria-label={`Cantidad de ${etiqueta}`} placeholder="0" value={valor} onChange={(e) => onCambio(e.target.value)}
          className="h-10 w-12 rounded-button border border-line-strong bg-surface text-center text-body tabular-nums text-fg outline-2 outline-offset-2 outline-transparent placeholder:text-fg-tertiary focus:outline-focus" />
        <button type="button" className={BOTON} aria-label={`Sumar 1 a ${etiqueta}`} onClick={() => onCambio(String(n + 1))}>
          <Plus aria-hidden strokeWidth={1.5} className="size-4" />
        </button>
      </span>
      <Agotada valor={valor} />
    </span>
  );
}

/** Desktop: la cantidad como campo de planilla, con "Agotada" debajo en 0. */
export function CeldaCantidad({ valor, etiqueta, onCambio }: Props) {
  return (
    <span className="inline-flex flex-col items-end gap-0.5">
      <input inputMode="numeric" aria-label={`Cantidad de ${etiqueta}`} placeholder="0" className={CANTIDAD} value={valor} onChange={(e) => onCambio(e.target.value)} />
      <Agotada valor={valor} />
    </span>
  );
}
