"use client";

import { useCallback, useEffect, useState } from "react";

/** Cuenta regresiva en segundos para "Reenviar código en 0:42". */
export function useCountdown(desde: number) {
  const [restante, setRestante] = useState(desde);
  useEffect(() => {
    if (restante <= 0) return;
    const t = setTimeout(() => setRestante((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [restante]);
  const reiniciar = useCallback(() => setRestante(desde), [desde]);
  const texto = `${Math.floor(restante / 60)}:${String(restante % 60).padStart(2, "0")}`;
  return { restante, texto, reiniciar };
}
