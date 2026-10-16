"use client";

import { useEffect, useState } from "react";
import { EVENTO_CARRITO, leerCarrito } from "../lib/carrito";

/**
 * Cantidad de productos en el carrito de esta tienda (en este navegador, hasta tener backend).
 * Se lee después de montar: el servidor no tiene localStorage y así no hay error de hidratación.
 */
export function useCantidadCarrito(slug: string) {
  const [cantidad, setCantidad] = useState(0);
  useEffect(() => {
    const leer = () => setCantidad(leerCarrito(slug).reduce((t, i) => t + (i.cantidad ?? 1), 0));
    leer();
    window.addEventListener("storage", leer); // otra pestaña agregó algo
    window.addEventListener(EVENTO_CARRITO, leer); // esta pestaña agregó algo
    return () => {
      window.removeEventListener("storage", leer);
      window.removeEventListener(EVENTO_CARRITO, leer);
    };
  }, [slug]);
  return cantidad;
}
