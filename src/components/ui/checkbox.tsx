"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

type CheckboxProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> & {
  /** Estado mixto del maestro: algunos seleccionados, no todos. */
  indeterminate?: boolean;
  /** Obligatorio: la casilla no tiene texto visible. */
  "aria-label": string;
};

/**
 * Casilla nativa (accesible y con estado mixto real), marcada en selection/* (negro carbón,
 * DESIGN.md §4). El label envolvente da una zona táctil de 36 px aunque la casilla mida 16.
 */
export function Checkbox({ indeterminate = false, className, ...rest }: CheckboxProps) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);
  return (
    <label className={cn("relative flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-theme hover:bg-sunken", className)}>
      <input ref={ref} type="checkbox" className="size-4 cursor-pointer accent-selected" {...rest} />
    </label>
  );
}
