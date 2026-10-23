"use client";

import { useEffect, useRef, useState } from "react";

const ENFOCABLES = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Comportamiento de un panel modal (drawer del carrito, 0036): el foco entra al panel y no sale con Tab; Escape lo
 * cierra; la página de atrás no hace scroll. `activo` pasa a true a los 400 ms: antes, el panel no recibe toques,
 * porque el segundo toque de un doble toque en "Agregar al carrito" caería sobre el panel recién abierto.
 */
export function useCajon(onCerrar: () => void) {
  const panel = useRef<HTMLDivElement>(null);
  const [activo, setActivo] = useState(false);

  useEffect(() => {
    panel.current?.focus();
    const t = window.setTimeout(() => setActivo(true), 400);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const tecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") return onCerrar();
      if (e.key !== "Tab" || !panel.current) return;
      const f = [...panel.current.querySelectorAll<HTMLElement>(ENFOCABLES)];
      if (!f.length) return;
      const [primero, ultimo] = [f[0], f[f.length - 1]];
      const actual = document.activeElement;
      if (e.shiftKey && (actual === primero || actual === panel.current)) (e.preventDefault(), ultimo.focus());
      else if (!e.shiftKey && actual === ultimo) (e.preventDefault(), primero.focus());
    };
    window.addEventListener("keydown", tecla);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", tecla);
      document.body.style.overflow = overflow;
    };
  }, [onCerrar]);

  return { panel, activo };
}
