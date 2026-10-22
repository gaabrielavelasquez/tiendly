"use server";

import { AHORA } from "@/features/pedidos/lib/mock";
import type { Cupon } from "../types";
import { cuponesActuales, eliminarCupon as borrar, guardarCupon as guardar } from "./mock";
import { aCupon, cuponesEnUso, enUso, LIMITE_FREE, validarCupon, type FormCupon } from "./reglas";

// Cupones (decisión 0008). Simulado: memoria del servidor. Se valida todo aquí, incluido el límite del Plan Free.

const hoy = () => AHORA.slice(0, 10);
const LIMITE = `Llegaste al límite de ${LIMITE_FREE} cupones en uso del Plan Free. Pausa uno para activar otro.`;

/** ¿Este cambio deja más de 3 cupones en uso? Los programados también ocupan lugar. */
function pasaElLimite(c: Cupon, todos: Cupon[]) {
  const otros = todos.filter((x) => x.id !== c.id);
  return enUso(c, hoy()) && cuponesEnUso(otros, hoy()) >= LIMITE_FREE;
}

export async function guardarCupon(f: FormCupon, id?: string): Promise<{ codigo: string } | { error: string; errores?: Record<string, string> }> {
  await new Promise((r) => setTimeout(r, 500));
  const todos = cuponesActuales();
  const actual = id ? todos.find((c) => c.id === id) : undefined;
  if (id && !actual) return { error: "Este cupón ya no existe." };
  const errores = validarCupon(f, todos.filter((c) => c.id !== id));
  if (Object.keys(errores).length) return { error: "Revisa los campos marcados.", errores };
  const cupon = aCupon(f, { id: actual?.id ?? `c-${Date.now()}`, usos: actual?.usos ?? 0 });
  if (pasaElLimite(cupon, todos)) return { error: LIMITE };
  guardar(cupon);
  return { codigo: cupon.codigo };
}

/** Pausar o activar desde la lista (interruptor de cada cupón). */
export async function alternarCupon(id: string, activo: boolean): Promise<{ ok: true } | { error: string }> {
  const todos = cuponesActuales();
  const c = todos.find((x) => x.id === id);
  if (!c) return { error: "Este cupón ya no existe." };
  const sig = { ...c, activo };
  if (activo && pasaElLimite(sig, todos)) return { error: LIMITE };
  guardar(sig);
  return { ok: true };
}

export async function eliminarCupon(id: string) {
  borrar(id);
}
