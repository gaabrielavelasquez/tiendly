"use client";

import { useCallback } from "react";
import type { DatosCompra } from "../lib/catalogo";
import { aplicarCupon } from "../lib/acciones";
import { calcularTotales } from "../lib/reglas";
import { useCarrito } from "./use-carrito";

/**
 * Lo que muestran el drawer del carrito y la página /carrito (0036): las líneas, los totales (sin envío: se elige en
 * el siguiente paso), si hay una opción agotada que bloquea la compra y la validación del cupón.
 */
export function useVistaCarrito(datos: DatosCompra) {
  const c = useCarrito(datos.tienda.slug, datos.catalogo);
  const totales = calcularTotales(c.lineas ?? [], c.cupon, null, datos.reglas.envioGratisDesde);
  const bloqueado = Boolean(c.lineas?.some((l) => l.maximo === 0));
  const validarCupon = useCallback((codigo: string) => aplicarCupon(datos.tienda.slug, codigo, totales.productos), [datos.tienda.slug, totales.productos]);
  return { ...c, totales, bloqueado, validarCupon, reglasEnvio: datos.reglas.envioGratisDesde };
}

export type VistaCarrito = ReturnType<typeof useVistaCarrito>;
