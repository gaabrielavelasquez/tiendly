"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type EstadoCopia = "idle" | "copiado" | "error";

/** Copia al portapapeles y vuelve a "idle" después de unos segundos. */
export function useCopiar(duracionMs = 2000) {
  const [estado, setEstado] = useState<EstadoCopia>("idle");
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copiar = useCallback(
    async (texto: string) => {
      window.clearTimeout(timer.current);
      try {
        await navigator.clipboard.writeText(texto);
        setEstado("copiado");
      } catch {
        setEstado("error");
      }
      timer.current = window.setTimeout(() => setEstado("idle"), duracionMs);
    },
    [duracionMs],
  );

  return { estado, copiar };
}
