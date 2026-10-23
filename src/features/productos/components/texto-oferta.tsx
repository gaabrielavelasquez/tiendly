import { Badge } from "@/components/ui";
import { cn } from "@/lib/cn";
import { estadoOferta, vigencia } from "../lib/ofertas";
import type { Producto } from "../types";

/** "Programada" (0034): estado de una oferta que todavía no empieza. Badge neutro: es un estado, no una alerta. */
export function BadgeProgramada() {
  return <Badge className="h-5 px-1.5">Programada</Badge>;
}

/**
 * Vigencia de la oferta en el panel (las fechas nunca se ven en la tienda, 0034): "Hasta el domingo 25.", "Termina hoy."
 * (texto de color, 0031), "Empieza el miércoles 28." o "Terminó el 20 de octubre.". Null si no hay nada que decir.
 */
export function TextoOferta({ p, hoy, className }: { p: Producto; hoy: string; className?: string }) {
  const v = vigencia(p, hoy);
  if (!v) return null;
  return <span className={cn("text-caption", v.urgente ? "text-warning" : "text-fg-secondary", className)}>{v.texto}.</span>;
}

export const esProgramada = (p: Producto, hoy: string) => estadoOferta(p, hoy) === "programada";
