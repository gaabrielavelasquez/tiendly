"use client";

import { cn } from "@/lib/cn";

type SwitchProps = { checked: boolean; onChange: (v: boolean) => void; id?: string; "aria-describedby"?: string; children: React.ReactNode };

/**
 * Interruptor (role="switch"). Encendido en selection/* (negro carbón, DESIGN.md §4), nunca cobalto.
 * El texto va dentro del botón, así toda la fila es tocable.
 */
export function Switch({ checked, onChange, id, children, ...rest }: SwitchProps) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="group flex min-h-11 w-full items-center justify-between gap-3 rounded-sm text-left"
      {...rest}
    >
      <span className="text-body-sm font-semibold text-fg">{children}</span>
      <span
        aria-hidden
        className={cn("relative h-5 w-9 shrink-0 rounded-full transition-colors", checked ? "bg-selected" : "bg-control-off")}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 size-4 rounded-full bg-surface shadow-card transition-transform",
            checked && "translate-x-4",
          )}
        />
      </span>
    </button>
  );
}
