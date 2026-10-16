"use client";

import { useCallback, useEffect, useState } from "react";

const KEY = "tiendly:menu-colapsado";

/** Barra lateral expandida (248 px) o colapsada (80 px). La preferencia se recuerda en este navegador. */
export function useMenuColapsado() {
  const [colapsada, setColapsada] = useState(false);

  useEffect(() => {
    try {
      setColapsada(localStorage.getItem(KEY) === "1");
    } catch {
      /* sin storage: arranca expandida */
    }
  }, []);

  const alternar = useCallback(() => {
    setColapsada((prev) => {
      try {
        localStorage.setItem(KEY, prev ? "0" : "1");
      } catch {}
      return !prev;
    });
  }, []);

  return { colapsada, alternar };
}
