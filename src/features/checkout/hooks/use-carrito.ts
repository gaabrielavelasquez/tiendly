"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { EVENTO_CARRITO, guardarCarrito, leerCarrito, type ItemCarrito } from "@/features/vitrina/lib/carrito";
import type { CatalogoCompra, Cupon, Linea } from "../types";
import { mismaLinea, resolverLineas } from "../lib/reglas";

const claveCupon = (slug: string) => `tiendly:cupon:${slug}`;

/**
 * Carrito de la tienda en este navegador, ya resuelto contra el catálogo. `lineas` es null hasta montar
 * (el servidor no tiene localStorage): así se muestra el esqueleto y no hay error de hidratación.
 * El cupón se recuerda en la sesión para que pase del carrito a "Finalizar compra".
 */
export function useCarrito(slug: string, catalogo: CatalogoCompra) {
  const [items, setItems] = useState<ItemCarrito[] | null>(null);
  const [cupon, setCuponState] = useState<Cupon | null>(null);
  const [quitado, setQuitado] = useState<{ linea: Linea; indice: number } | null>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const leer = () => setItems(leerCarrito(slug));
    leer();
    try {
      setCuponState(JSON.parse(sessionStorage.getItem(claveCupon(slug)) ?? "null"));
    } catch {}
    window.addEventListener("storage", leer);
    window.addEventListener(EVENTO_CARRITO, leer);
    return () => {
      window.removeEventListener("storage", leer);
      window.removeEventListener(EVENTO_CARRITO, leer);
      window.clearTimeout(timer.current);
    };
  }, [slug]);

  const lineas = useMemo(() => (items ? resolverLineas(items, catalogo) : null), [items, catalogo]);

  const guardar = useCallback((sig: ItemCarrito[]) => (setItems(sig), guardarCarrito(slug, sig)), [slug]);

  const cambiarCantidad = useCallback(
    (l: ItemCarrito, cantidad: number) => items && guardar(items.map((i) => (mismaLinea(i, l) ? { ...i, cantidad } : i))),
    [items, guardar],
  );

  /** Quita la línea y deja "Deshacer" unos segundos (Figma C2). */
  const quitar = useCallback(
    (l: Linea) => {
      if (!items) return;
      setQuitado({ linea: l, indice: items.findIndex((i) => mismaLinea(i, l)) });
      guardar(items.filter((i) => !mismaLinea(i, l)));
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setQuitado(null), 6000);
    },
    [items, guardar],
  );

  const deshacer = useCallback(() => {
    if (!items || !quitado) return;
    const { id, variante, cantidad } = quitado.linea;
    guardar([...items.slice(0, quitado.indice), { id, variante, cantidad }, ...items.slice(quitado.indice)]);
    setQuitado(null);
  }, [items, quitado, guardar]);

  const setCupon = useCallback(
    (c: Cupon | null) => {
      setCuponState(c);
      try {
        sessionStorage.setItem(claveCupon(slug), JSON.stringify(c));
      } catch {}
    },
    [slug],
  );

  /** Al cerrar la compra: carrito y cupón vuelven a cero. */
  const vaciar = useCallback(() => (guardar([]), setCupon(null)), [guardar, setCupon]);

  return { lineas, cupon, setCupon, cambiarCantidad, quitar, deshacer, quitado, vaciar };
}
