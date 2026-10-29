"use client";

import { useReducedMotion as usePreferencia } from "motion/react";
import { useEffect, useState } from "react";

/**
 * "Reducir movimiento" sin romper la hidratación. El servidor no conoce la preferencia y asume
 * que no; si el primer render del navegador la usara, el HTML no coincidiría (atributos y textos
 * distintos). Por eso devuelve `false` hasta montar y recién después la preferencia real.
 * MotionConfig reducedMotion="user" (en el layout) ya evita el movimiento en ese primer instante.
 */
export function useReducedMotion() {
  const preferencia = usePreferencia();
  const [montado, setMontado] = useState(false);
  useEffect(() => setMontado(true), []);
  return montado ? Boolean(preferencia) : false;
}
