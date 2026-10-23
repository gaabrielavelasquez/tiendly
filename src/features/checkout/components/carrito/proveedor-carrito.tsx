"use client";

import { AnimatePresence } from "motion/react";
import { usePathname } from "next/navigation";
import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import type { DatosCompra } from "../../lib/catalogo";
import { CajonCarrito } from "./cajon-carrito";

type Abrir = { resaltar?: string; volverA?: HTMLElement | null };
type Abierto = { resaltar?: string };
const Contexto = createContext<{ abrir: (o?: Abrir) => void } | null>(null);

/**
 * El drawer del carrito en toda la tienda (0036). null en /carrito y en la compra: ahí el carrito ya es la página y
 * el ícono de la cabecera navega como un link. También null si la tienda no cargó (el link lleva a /carrito).
 */
export const useCajonCarrito = () => useContext(Contexto);

/**
 * Vive en el layout de la tienda: la cabecera (ícono del carrito) y la ficha ("Agregar al carrito") lo abren. Al
 * cerrar, el foco vuelve a lo que lo abrió (el botón o el ícono).
 */
export function ProveedorCarrito({ datos, children }: { datos: DatosCompra; children: React.ReactNode }) {
  const pathname = usePathname();
  const [abierto, setAbierto] = useState<Abierto | null>(null);
  const volverA = useRef<HTMLElement | null>(null);
  const enCompra = /\/(carrito|checkout)(\/|$)/.test(pathname);

  const abrir = useCallback((o?: Abrir) => {
    volverA.current = o?.volverA ?? (document.activeElement as HTMLElement | null);
    setAbierto({ resaltar: o?.resaltar });
  }, []);
  const cerrar = useCallback(() => {
    setAbierto(null);
    requestAnimationFrame(() => volverA.current?.isConnected && volverA.current.focus());
  }, []);
  const valor = useMemo(() => (enCompra ? null : { abrir }), [enCompra, abrir]);

  return (
    <Contexto.Provider value={valor}>
      {children}
      <AnimatePresence>{abierto && <CajonCarrito key="carrito" datos={datos} resaltar={abierto.resaltar} onCerrar={cerrar} />}</AnimatePresence>
    </Contexto.Provider>
  );
}
