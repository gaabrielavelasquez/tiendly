"use client";

import { useEffect, useState } from "react";

/**
 * Cantidad de productos en el carrito de esta tienda (en este navegador, hasta tener backend).
 * Se lee después de montar: el servidor no tiene localStorage y así no hay error de hidratación.
 */
export function useCantidadCarrito(slug: string) {
  const [cantidad, setCantidad] = useState(0);
  useEffect(() => {
    const leer = () => {
      try {
        const items = JSON.parse(localStorage.getItem(`tiendly:carrito:${slug}`) ?? "[]") as { cantidad?: number }[];
        setCantidad(items.reduce((s, i) => s + (i.cantidad ?? 1), 0));
      } catch {
        setCantidad(0);
      }
    };
    leer();
    window.addEventListener("storage", leer); // otra pestaña agregó algo
    return () => window.removeEventListener("storage", leer);
  }, [slug]);
  return cantidad;
}
