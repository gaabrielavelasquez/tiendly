"use client";

import { useEffect, useRef, useState } from "react";

const ENFOCABLES = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Comportamiento de un panel modal (drawer del carrito, 0036): el foco entra al panel y no sale (ni con Tab ni con un
 * clic en la página de atrás); Escape lo cierra; la página de atrás no hace scroll. `activo` pasa a true a los 400 ms:
 * antes, el panel no recibe toques, porque el segundo toque de un doble toque en "Agregar al carrito" caería sobre el
 * panel recién abierto. `presente` es false mientras sale (animación de cierre): ahí suelta el foco para que vuelva al
 * botón que lo abrió.
 */
export function useCajon(onCerrar: () => void, presente: boolean) {
  const panel = useRef<HTMLDivElement>(null);
  const [activo, setActivo] = useState(false);

  useEffect(() => {
    if (!presente) return;
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
    // El foco vuelve al panel si algo de atrás lo toma (focusin) o si se pierde en la página (focusout hacia nada).
    let vivo = true;
    const volver = () => requestAnimationFrame(() => vivo && panel.current?.focus());
    const adentro = (e: FocusEvent) => panel.current && !panel.current.contains(e.target as Node) && volver();
    const afuera = (e: FocusEvent) => panel.current && !panel.current.contains(e.relatedTarget as Node | null) && volver();
    window.addEventListener("keydown", tecla);
    document.addEventListener("focusin", adentro);
    panel.current?.addEventListener("focusout", afuera);
    const nodo = panel.current;
    return () => {
      vivo = false;
      window.clearTimeout(t);
      window.removeEventListener("keydown", tecla);
      document.removeEventListener("focusin", adentro);
      nodo?.removeEventListener("focusout", afuera);
      document.body.style.overflow = overflow;
    };
  }, [onCerrar, presente]);

  return { panel, activo };
}
