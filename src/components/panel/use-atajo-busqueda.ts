"use client";

import { useEffect, useRef, useState } from "react";

/**
 * ⌘K (Mac) o Ctrl+K (resto) enfoca el buscador. La pista se calcula después de montar para que
 * servidor y navegador rendericen lo mismo (sin error de hidratación).
 */
export function useAtajoBusqueda<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [esMac, setEsMac] = useState(false);

  useEffect(() => {
    setEsMac(/Mac|iPhone|iPad/.test(navigator.userAgent));
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        ref.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return { ref, pista: esMac ? "⌘K" : "Ctrl K" };
}
