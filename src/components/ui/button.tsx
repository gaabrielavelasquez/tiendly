"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { LoaderCircle } from "lucide-react";
import type { HTMLMotionProps } from "motion/react";
import { Pressable } from "@/components/motion/pressable";
import { cn } from "@/lib/cn";

// DESIGN.md §4 · El degradado cobalto es exclusivo del CTA (decisión 0019).
const button = cva(
  "group relative isolate inline-flex items-center justify-center gap-2 overflow-hidden rounded-button font-body font-semibold transition-colors disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        primary: "bg-cta text-on-accent disabled:bg-none disabled:bg-sunken disabled:text-fg-tertiary",
        secondary: "border border-line-strong bg-surface text-fg hover:bg-sunken disabled:text-fg-tertiary",
        ghost: "text-accent-text hover:bg-accent-subtle disabled:text-fg-tertiary",
        danger: "bg-danger text-on-danger hover:bg-danger-hover disabled:bg-sunken disabled:text-fg-tertiary",
      },
      size: {
        md: "h-12 px-5 text-body",
        sm: "h-10 px-4 text-body-sm",
      },
      block: { true: "w-full" },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type ButtonProps = Omit<HTMLMotionProps<"button">, "children"> &
  VariantProps<typeof button> & { loading?: boolean; children: React.ReactNode };

export function Button({ variant, size, block, loading, disabled, className, children, ...rest }: ButtonProps) {
  const isPrimary = (variant ?? "primary") === "primary";
  return (
    <Pressable
      className={cn(button({ variant, size, block }), className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {isPrimary && !disabled && (
        // Capa de hover: CSS no anima degradados, así que se funde una segunda capa.
        <span aria-hidden className="absolute inset-0 -z-10 bg-cta-hover opacity-0 transition-opacity group-hover:opacity-100" />
      )}
      {loading && <LoaderCircle aria-hidden className="size-5 motion-safe:animate-spin" />}
      <span>{children}</span>
    </Pressable>
  );
}
