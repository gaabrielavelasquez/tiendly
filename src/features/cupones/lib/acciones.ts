"use server";

import { hoyLima } from "@/lib/reloj";
import { datosPanel, mutarPanel } from "@/lib/sesion";
import type { Cupon } from "../types";
import { guardarCupon as guardar } from "./mock";
import { aCupon, cuponesEnUso, enUso, LIMITE_FREE, limiteCupones, validarCupon, type FormCupon } from "./reglas";

// Cupones (decisión 0008) de la tienda del panel, guardados con sus datos. Se valida todo aquí, incluido el límite del plan.

const hoy = () => hoyLima();
const LIMITE = `Llegaste al límite de ${LIMITE_FREE} cupones en uso del Plan Free. Pausa uno para activar otro.`;

/** Plan Free: ¿este cambio deja más de 3 cupones en uso? Los programados también ocupan lugar. Pro: sin límite. */
function pasaElLimite(c: Cupon, todos: Cupon[], plan: "free" | "pro") {
  const limite = limiteCupones(plan);
  const otros = todos.filter((x) => x.id !== c.id);
  return limite !== null && enUso(c, hoy()) && cuponesEnUso(otros, hoy()) >= limite;
}

export async function guardarCupon(f: FormCupon, id?: string): Promise<{ codigo: string } | { error: string; errores?: Record<string, string> }> {
  const { cupones: todos, tienda } = await datosPanel();
  const actual = id ? todos.find((c) => c.id === id) : undefined;
  if (id && !actual) return { error: "Este cupón ya no existe." };
  const errores = validarCupon(f, todos.filter((c) => c.id !== id));
  if (Object.keys(errores).length) return { error: "Revisa los campos marcados.", errores };
  const cupon = aCupon(f, { id: actual?.id ?? `c-${Date.now()}`, usos: actual?.usos ?? 0 });
  if (pasaElLimite(cupon, todos, tienda.plan)) return { error: LIMITE };
  await mutarPanel((d) => guardar(d.cupones, cupon));
  return { codigo: cupon.codigo };
}

/** Pausar o activar desde la lista (interruptor de cada cupón). */
export async function alternarCupon(id: string, activo: boolean): Promise<{ ok: true } | { error: string }> {
  const { cupones: todos, tienda } = await datosPanel();
  const c = todos.find((x) => x.id === id);
  if (!c) return { error: "Este cupón ya no existe." };
  const sig = { ...c, activo };
  if (activo && pasaElLimite(sig, todos, tienda.plan)) return { error: LIMITE };
  await mutarPanel((d) => guardar(d.cupones, sig));
  return { ok: true };
}

export async function eliminarCupon(id: string) {
  await mutarPanel((d) => void (d.cupones = d.cupones.filter((c) => c.id !== id)));
}
