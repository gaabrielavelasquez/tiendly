import { Badge } from "@/components/ui";
import type { NivelStock } from "../types";

const BADGE: Record<NivelStock, { tone: "success" | "warning" | "error"; texto: string }> = {
  "en-stock": { tone: "success", texto: "En stock" },
  "bajo-stock": { tone: "warning", texto: "Bajo stock" },
  agotado: { tone: "error", texto: "Agotado" },
};

/** Nivel de inventario con color semántico suave. El texto siempre acompaña al color. */
export function BadgeStock({ nivel }: { nivel: NivelStock }) {
  const { tone, texto } = BADGE[nivel];
  return <Badge tone={tone}>{texto}</Badge>;
}
