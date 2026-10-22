import { ChevronRight, Clock3, PackageX, Truck, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { Pendiente } from "../lib/reglas";

// Cada tipo tiene su ícono: el color nunca es la única señal.
const ICONO: Record<Pendiente["id"], LucideIcon> = { "por-enviar": Truck, reservas: Clock3, agotados: PackageX };
// Estado = ícono fino del color del estado, sin contenedor (decisión 0031, ronda 4).
const TONO: Record<Pendiente["tono"], string> = { info: "text-info", warning: "text-warning", error: "text-error" };

/**
 * Fila de "Para atender hoy" (decisión 0031, ronda 4): ícono fino, título, detalle y chevron simple, sin cajas.
 * La jerarquía la dan el tamaño y el peso del texto. Toda la fila es el link (0027), de al menos 44 px de alto.
 * Solo lo urgente (la reserva que vence hoy) lleva badge relleno, junto al título.
 */
export function FilaPendiente({ fila }: { fila: Pendiente }) {
  const Icono = ICONO[fila.id];
  return (
    <Link
      href={fila.href}
      className="group -mx-3 flex min-h-11 items-start gap-4 rounded-theme px-3 py-4 transition hover:bg-sunken active:scale-98 lg:py-5"
    >
      <Icono aria-hidden strokeWidth={1.6} className={cn("mt-0.5 size-5 shrink-0", TONO[fila.tono])} />
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="text-body font-medium text-fg">{fila.titulo}</span>
          {fila.etiqueta && <Badge tone="warning">{fila.etiqueta}</Badge>}
        </span>
        <span className="text-body-sm text-fg-secondary">{fila.detalle}</span>
      </span>
      <ChevronRight aria-hidden strokeWidth={1.6} className="mt-0.5 size-5 shrink-0 text-icon transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}
