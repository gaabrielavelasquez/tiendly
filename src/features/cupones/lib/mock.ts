import { datosTienda } from "@/lib/datos/tienda";
import type { Cupon, Escenario } from "../types";
import { NAVIDAD } from "./semilla-heather";

// Cupones de cada tienda (módulo 3), guardados con sus datos (lib/datos/tienda). El checkout los valida
// al aplicarlos y suma un uso cuando se crea el pedido. Funciones puras sobre la lista: quien llama guarda.

/** Crea o reemplaza un cupón (por id). */
export function guardarCupon(lista: Cupon[], c: Cupon) {
  const i = lista.findIndex((x) => x.id === c.id);
  if (i >= 0) lista[i] = { ...c };
  else lista.unshift({ ...c });
}

/** Suma un uso al crear un pedido con el cupón (puede pasar a "Agotado"). */
export function sumarUso(lista: Cupon[], codigo: string) {
  const c = lista.find((x) => x.codigo === codigo);
  if (c) c.usos += 1;
}

export function leerEscenario(v: string | string[] | undefined): Escenario {
  const e = Array.isArray(v) ? v[0] : v;
  return e === "vacio" || e === "limite" || e === "error" ? e : "cupones";
}

export async function obtenerCupones(slug: string, escenario: Escenario = "cupones"): Promise<Cupon[]> {
  if (escenario === "error") throw new Error("No se pudo cargar Cupones (simulado).");
  if (escenario === "vacio") return [];
  const cupones = (await datosTienda(slug))?.cupones ?? [];
  return escenario === "limite" ? [NAVIDAD, ...cupones] : cupones;
}
