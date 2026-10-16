export type Tema = "neutral" | "editorial" | "suave";

export const RUBROS = [
  { id: "moda", label: "Moda", tema: "editorial", frase: "moda" },
  { id: "calzado", label: "Calzado", tema: "editorial", frase: "calzado" },
  { id: "accesorios", label: "Accesorios", tema: "editorial", frase: "accesorios" },
  { id: "belleza", label: "Belleza", tema: "suave", frase: "belleza" },
  { id: "reposteria", label: "Repostería", tema: "suave", frase: "repostería" },
  { id: "otro", label: "Otro", tema: "neutral", frase: "" },
] as const satisfies readonly { id: string; label: string; tema: Tema; frase: string }[];

export type RubroId = (typeof RUBROS)[number]["id"];

export const TEMA_LABEL: Record<Tema, string> = { neutral: "Neutral", editorial: "Editorial", suave: "Suave" };

/** Decisión 0013: el tema por defecto sale del rubro. */
export function temaDe(rubro: RubroId | null): Tema {
  return RUBROS.find((r) => r.id === rubro)?.tema ?? "neutral";
}

export function explicacionTema(rubro: RubroId | null): string {
  const r = RUBROS.find((x) => x.id === rubro);
  const tema = TEMA_LABEL[temaDe(rubro)];
  if (!r || !r.frase) return `Le pusimos el tema ${tema}, que va bien con todo.`;
  return `Le pusimos el tema ${tema} por ser de ${r.frase}.`;
}
