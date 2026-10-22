import { RUBROS, type RubroId } from "./rubros";

// Perfil del negocio simulado (memoria del servidor) hasta tener backend. Es la única fuente de los rubros:
// el onboarding los guarda y Afiliación los precarga y los actualiza.
const g = globalThis as typeof globalThis & { __tiendlyRubros?: RubroId[] };

/** Heather (tienda de demo) vende calzado y accesorios. */
export const rubrosTienda = (): RubroId[] => [...(g.__tiendlyRubros ??= ["calzado", "accesorios"])];

export function fijarRubros(rubros: readonly RubroId[]) {
  g.__tiendlyRubros = RUBROS.map((r) => r.id).filter((id) => rubros.includes(id));
}

