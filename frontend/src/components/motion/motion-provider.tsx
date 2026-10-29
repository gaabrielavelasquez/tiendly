"use client";

import { MotionConfig } from "motion/react";

/** Motion respeta "reducir movimiento" en todo el sitio: sin desplazamientos ni escalas, solo cambios de opacidad. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
