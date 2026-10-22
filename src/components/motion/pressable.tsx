"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";
import { forwardRef } from "react";
import { motionTokens } from "@/styles/tokens";

/** Botón con la micro-interacción del sistema: escala 0.98 al presionar, 150 ms ease-out. */
export const Pressable = forwardRef<HTMLButtonElement, HTMLMotionProps<"button">>(function Pressable(props, ref) {
  const reduce = useReducedMotion();
  return (
    <motion.button
      ref={ref}
      whileTap={reduce || props.disabled ? undefined : { scale: motionTokens.pressedScale }}
      transition={{ duration: motionTokens.durationFast, ease: [...motionTokens.easing] as [number, number, number, number] }}
      {...props}
    />
  );
});
