export type Tema = "neutral" | "editorial" | "suave";

/** "¿Qué vendes?": se pueden elegir varios (una tienda puede vender ropa y accesorios a la vez). */
export const RUBROS = [
  { id: "moda", label: "Moda" },
  { id: "calzado", label: "Calzado" },
  { id: "accesorios", label: "Accesorios" },
  { id: "belleza", label: "Belleza" },
  { id: "reposteria", label: "Repostería" },
  { id: "otro", label: "Otro" },
] as const;

export type RubroId = (typeof RUBROS)[number]["id"];

export const TEMA_LABEL: Record<Tema, string> = { neutral: "Neutral", editorial: "Editorial", suave: "Suave" };

/**
 * Toda tienda arranca con el tema Neutral y la persona lo cambia en Mi tienda.
 * Reemplaza la regla anterior de la decisión 0013 (tema según el rubro): con varios rubros
 * no hay un único tema que elegir, y decirlo claro evita sorpresas.
 */
export const TEMA_INICIAL: Tema = "neutral";

export const EXPLICACION_TEMA = `Le pusimos el tema ${TEMA_LABEL[TEMA_INICIAL]} para empezar. Podrás cambiarlo o personalizarlo cuando quieras desde Mi tienda.`;

/** Agrega o quita un rubro, manteniendo el orden de la lista. */
export function alternarRubro(actuales: readonly RubroId[], id: RubroId): RubroId[] {
  const set = new Set(actuales);
  if (set.has(id)) set.delete(id);
  else set.add(id);
  return RUBROS.map((r) => r.id).filter((r) => set.has(r));
}
