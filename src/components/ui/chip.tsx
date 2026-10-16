"use client";

import type { HTMLMotionProps } from "motion/react";
import { Pressable } from "@/components/motion/pressable";
import { cn } from "@/lib/cn";

type ChipProps = Omit<HTMLMotionProps<"button">, "children"> & {
  selected?: boolean;
  children: React.ReactNode;
};

/**
 * Chip de selección (tallas, colores, categorías, filtros). Decisiones 0018 y 0019:
 * pill compacto de 32 px; seleccionado en negro carbón (chip.selected), nunca en cobalto.
 * La zona táctil se extiende a 44 px con un ::after invisible.
 */
export function Chip({ selected = false, className, children, ...rest }: ChipProps) {
  return (
    <Pressable
      type="button"
      aria-pressed={selected}
      className={cn(
        "relative inline-flex h-8 items-center gap-1.5 rounded-chip border px-3 text-body-sm font-medium transition-colors",
        "after:absolute after:-inset-y-1.5 after:inset-x-0 after:content-['']",
        selected
          ? "border-selected-border bg-selected text-on-selected"
          : "border-line bg-surface text-fg hover:border-line-strong",
        className,
      )}
      {...rest}
    >
      {children}
    </Pressable>
  );
}
