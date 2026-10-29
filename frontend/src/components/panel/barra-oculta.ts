"use client";

import { useEffect, useSyncExternalStore } from "react";

// Pantallas que tapan la barra inferior del panel con su propia barra (p. ej. el modo selección de Productos, 0034):
// la ocultan mientras están activas, así no queda debajo (ni para un lector de pantalla). Un contador por si hay varias.

let pedidos = 0;
const oyentes = new Set<() => void>();
const avisar = () => oyentes.forEach((o) => o());
const suscribir = (o: () => void) => (oyentes.add(o), () => void oyentes.delete(o));

/** Mientras `activo` sea true, la barra inferior del panel no se muestra. */
export function useOcultarBarraInferior(activo: boolean) {
  useEffect(() => {
    if (!activo) return;
    pedidos++;
    avisar();
    return () => {
      pedidos--;
      avisar();
    };
  }, [activo]);
}

/** Lo lee TabBar. En el servidor, siempre visible. */
export const useBarraInferiorOculta = () => useSyncExternalStore(suscribir, () => pedidos > 0, () => false);
