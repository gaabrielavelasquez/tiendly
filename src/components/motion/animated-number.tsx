"use client";

import { motion, useReducedMotion, useSpring, useTransform, type SpringOptions } from "motion/react";
import { useEffect } from "react";
import { cn } from "@/lib/cn";

// Copiado de Motion Primitives (animated-number) y adaptado: arranca en 0 para que el número
// "suba", acepta un formateador (S/, miles) y respeta "reducir movimiento".
export type AnimatedNumberProps = {
  value: number;
  className?: string;
  springOptions?: SpringOptions;
  format?: (n: number) => string;
};

const formatoBase = (n: number) => Math.round(n).toLocaleString("es-PE");

export function AnimatedNumber({ value, className, springOptions, format = formatoBase }: AnimatedNumberProps) {
  const reduce = useReducedMotion();
  const spring = useSpring(reduce ? value : 0, { bounce: 0, duration: 900, ...springOptions });
  const display = useTransform(spring, (current) => format(Math.round(current)));

  useEffect(() => {
    if (reduce) spring.jump(value);
    else spring.set(value);
  }, [spring, value, reduce]);

  return <motion.span className={cn("tabular-nums", className)}>{display}</motion.span>;
}
