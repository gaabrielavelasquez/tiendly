export type Tema = "neutral" | "editorial" | "suave";

/**
 * "¿Qué vendes?": se pueden elegir varios (una tienda puede vender decoración y cosmética a la vez).
 * Multirubro (decisión 0032): en orden alfabético, para que ninguno parezca el principal, y "Otro" al final.
 * Los ids no cambian aunque cambie el texto (las tiendas guardadas los usan): "moda" se muestra como "Ropa".
 * Vapes entran por "Otro" hasta revisar lo legal y las pasarelas de pago.
 */
export const RUBROS = [
  { id: "accesorios", label: "Accesorios" },
  { id: "belleza", label: "Belleza y cuidado personal" },
  { id: "calzado", label: "Calzado" },
  { id: "reposteria", label: "Comida y repostería" },
  { id: "hogar", label: "Hogar y decoración" },
  { id: "hecho-a-mano", label: "Impresión 3D y hecho a mano" },
  { id: "moda", label: "Ropa" },
  { id: "segunda-mano", label: "Segunda mano" },
  { id: "tecnologia", label: "Tecnología" },
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

export const esRubro = (id: unknown): id is RubroId => RUBROS.some((r) => r.id === id);

/** «Calzado, Accesorios»: para resúmenes. */
export const nombresRubros = (ids: readonly RubroId[]) => RUBROS.filter((r) => ids.includes(r.id)).map((r) => r.label).join(", ");
