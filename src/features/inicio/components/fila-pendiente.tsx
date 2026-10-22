import { ChevronRight, Clock3, PackageX, Truck, type LucideIcon } from "lucide-react";
import Link from "next/link";
import type { Pendiente } from "../lib/reglas";

// Cada tipo tiene su ícono (fino y gris): el color queda solo para lo que pide atención, como "Vence hoy".
const ICONO: Record<Pendiente["id"], LucideIcon> = { "por-enviar": Truck, reservas: Clock3, agotados: PackageX };

/**
 * Fila de "Para atender hoy" (decisión 0031, ronda 4): ícono fino gris sin contenedor, título, detalle y chevron
 * simple. Orden de lectura: título → plazo ("Vence hoy, …" en color de aviso, sin fondo; ronda 5) → detalle.
 * La jerarquía la dan el tamaño y el peso del texto. Toda la fila es el link (0027), de al menos 44 px.
 */
export function FilaPendiente({ fila }: { fila: Pendiente }) {
  const Icono = ICONO[fila.id];
  return (
    <Link href={fila.href} className="group flex min-h-11 items-start gap-4 px-5 py-4 transition-colors hover:bg-sunken lg:px-6 lg:py-5">
      <Icono aria-hidden strokeWidth={1.5} className="mt-0.5 size-5 shrink-0 text-icon" />
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="text-body font-medium text-fg">{fila.titulo}</span>
        {fila.vence && (
          <span className="flex items-center gap-1.5 text-body-sm font-medium text-warning">
            <Clock3 aria-hidden strokeWidth={1.5} className="size-4 shrink-0" />
            Vence hoy, {fila.vence}
          </span>
        )}
        <span className="text-body-sm text-fg-secondary">{fila.detalle}</span>
      </span>
      <ChevronRight aria-hidden strokeWidth={1.5} className="mt-0.5 size-5 shrink-0 text-icon-subtle transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}
