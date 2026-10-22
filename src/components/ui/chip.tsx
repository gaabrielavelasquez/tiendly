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
 * pill compacto de 28 px (0020); seleccionado en negro carbón (chip.selected), nunca en cobalto.
 * La zona táctil se extiende a 44 px de alto con un ::after invisible; de ancho, nunca menos de 44 px (S, M, L).
 */
export function Chip({ selected = false, className, children, ...rest }: ChipProps) {
  return (
    <Pressable
      type="button"
      aria-pressed={selected}
      className={cn(
        "relative inline-flex h-7 min-w-11 items-center justify-center gap-1.5 rounded-chip border px-3 text-body-sm font-medium transition-colors",
        "after:absolute after:-inset-y-2 after:inset-x-0 after:content-['']",
        selected
          ? "border-transparent bg-selected text-on-selected"
          : "border-line bg-surface text-fg hover:border-line-strong",
        className,
      )}
      {...rest}
    >
      {children}
    </Pressable>
  );
}
