"use client";

import { useMemo, useState } from "react";
import type { FichaProducto } from "../lib/vitrina";

/** ¿Hay stock con estos valores? `null` en una opción = cualquiera. */
const hay = (p: FichaProducto, elegidos: (string | null)[]) =>
  p.variantes.some((v) => v.stock > 0 && elegidos.every((e, i) => e === null || v.valores[i] === e));

/**
 * Lo que la persona eligió en la ficha (opciones genéricas, 0032). Arranca con las opciones de un solo valor y con la
 * opción que cambia las fotos (Color o Tono) en el primer valor con stock; las demás, sin elegir. Si un cambio deja
 * otra elección sin stock, esa se borra (como pasaba con la talla al cambiar de color).
 */
export function useEleccion(p: FichaProducto) {
  const [elegidos, setElegidos] = useState<(string | null)[]>(() => {
    const conStock = p.variantes.find((v) => v.stock > 0) ?? p.variantes[0];
    return p.opciones.map((o, i) => (o.valores.length === 1 ? o.valores[0] : i === p.opcionFotos ? (conStock?.valores[i] ?? null) : null));
  });

  const agotados = useMemo(
    () => p.opciones.map((o, i) => new Set(o.valores.filter((v) => !hay(p, elegidos.map((e, j) => (j === i ? v : e)))))),
    [p, elegidos],
  );

  function elegir(i: number, v: string) {
    setElegidos((prev) => {
      const sig = prev.map((e, j) => (j === i ? v : e));
      return sig.map((e, j) => (j !== i && e !== null && p.opciones[j].valores.length > 1 && !hay(p, sig.map((x, k) => (k === j ? e : k === i ? v : null))) ? null : e));
    });
  }

  const completa = elegidos.every((e) => e !== null);
  const variante = completa ? p.variantes.find((v) => v.valores.every((x, i) => x === elegidos[i])) : undefined;
  /** Unidades que quedan con lo elegido hasta ahora (para "Últimas 3 unidades"). */
  const quedan = p.variantes.filter((v) => elegidos.every((e, i) => e === null || v.valores[i] === e)).reduce((s, v) => s + v.stock, 0);
  const fotosDe = p.opcionFotos >= 0 ? (elegidos[p.opcionFotos] ?? p.opciones[p.opcionFotos].valores[0]) : "";
  return { elegidos, elegir, agotados, completa, variante, quedan, fotos: p.fotos[fotosDe] ?? Object.values(p.fotos)[0] ?? [], claveFotos: fotosDe };
}
