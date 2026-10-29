"use client";

import { useEffect, useState } from "react";
import { EVENTO_CARRITO, leerCarrito } from "../lib/carrito";

/**
 * Cantidad de productos en el carrito de esta tienda (en este navegador, hasta tener backend).
 * Se lee después de montar: el servidor no tiene localStorage y así no hay error de hidratación.
 * `pulso` sube cada vez que la cantidad aumenta (no en la primera lectura): la cabecera lo usa para el salto del ícono.
 */
export function useCantidadCarrito(slug: string) {
  const [cantidad, setCantidad] = useState(0);
  const [pulso, setPulso] = useState(0);
  useEffect(() => {
    let previa: number | null = null;
    const leer = () => {
      const n = leerCarrito(slug).reduce((t, i) => t + (i.cantidad ?? 1), 0);
      if (previa !== null && n > previa) setPulso((x) => x + 1);
      previa = n;
      setCantidad(n);
    };
    leer();
    window.addEventListener("storage", leer); // otra pestaña agregó algo
    window.addEventListener(EVENTO_CARRITO, leer); // esta pestaña agregó algo
    return () => {
      window.removeEventListener("storage", leer);
      window.removeEventListener(EVENTO_CARRITO, leer);
    };
  }, [slug]);
  return { cantidad, pulso };
}
