"use client";

import { useCallback, useEffect, useState } from "react";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";

/**
 * Índice que avanza solo cada `ms` (vista previa del registro). Se detiene con "reducir movimiento",
 * mientras el puntero o el foco están encima (`pausar`) y para siempre cuando la persona elige una (`elegir`):
 * así el movimiento automático siempre se puede parar (WCAG 2.2.2).
 */
export function useRotacion(total: number, ms: number) {
  const reducir = useReducedMotion();
  const [actual, setActual] = useState(0);
  const [pausado, setPausado] = useState(false);
  const [elegido, setElegido] = useState(false);

  useEffect(() => {
    if (reducir || pausado || elegido || total < 2) return;
    const id = window.setInterval(() => setActual((i) => (i + 1) % total), ms);
    return () => window.clearInterval(id);
  }, [reducir, pausado, elegido, total, ms]);

  const elegir = useCallback((i: number) => (setActual(i), setElegido(true)), []);
  const pausar = useCallback((p: boolean) => setPausado(p), []);
  return { actual, elegir, pausar, reducir };
}
