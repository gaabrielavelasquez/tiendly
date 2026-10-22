"use server";

import { fijarRubros } from "./perfil";
import { esRubro, type RubroId } from "./rubros";

/** Guarda los rubros del negocio. Se vuelve a validar aquí: no se confía en el navegador. */
export async function guardarRubros(rubros: RubroId[]): Promise<{ ok: true } | { error: string }> {
  if (!Array.isArray(rubros) || !rubros.length || !rubros.every(esRubro)) return { error: "Elige al menos una opción." };
  fijarRubros(rubros);
  return { ok: true };
}
