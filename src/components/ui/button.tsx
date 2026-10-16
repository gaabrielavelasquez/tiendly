"use client";

import type { VariantProps } from "class-variance-authority";
import { LoaderCircle } from "lucide-react";
import type { HTMLMotionProps } from "motion/react";
import { Pressable } from "@/components/motion/pressable";
import { cn } from "@/lib/cn";
import { buttonVariants } from "./button-variants";

type ButtonProps = Omit<HTMLMotionProps<"button">, "children"> &
  VariantProps<typeof buttonVariants> & { loading?: boolean; children: React.ReactNode };

export function Button({ variant, size, block, loading, disabled, className, children, ...rest }: ButtonProps) {
  return (
    <Pressable
      className={cn(buttonVariants({ variant, size, block }), className)}
      disabled={disabled}
      aria-busy={loading || undefined}
      aria-disabled={loading || undefined}
      {...rest}
    >
      {loading && <LoaderCircle aria-hidden className="size-5 motion-safe:animate-spin" />}
      <span>{children}</span>
    </Pressable>
  );
}
