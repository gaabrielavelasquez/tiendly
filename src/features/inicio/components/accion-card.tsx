import { ChevronRight, Clock3, PackageX, Truck, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { Pendiente } from "../lib/reglas";

// Cada tipo tiene su ícono: el color nunca es la única señal.
const ICONO: Record<Pendiente["id"], LucideIcon> = { "por-enviar": Truck, reservas: Clock3, agotados: PackageX };
// Estado = ícono chico + color (decisión 0031), sobre un fondo neutro: nada de tiles rellenos.
const TONO: Record<Pendiente["tono"], string> = { info: "text-info", warning: "text-warning", error: "text-error" };

/**
 * Un pendiente de "Para atender hoy" (decisión 0031): ícono, título, detalle corto y botón redondo con chevron.
 * Móvil: fila de una tarjeta única con divisores. Desktop: tarjeta chica propia, con el chevron arriba a la derecha.
 * Toda la fila o tarjeta es el link (0027). Solo lo urgente (la reserva que vence hoy) lleva badge relleno.
 */
export function AccionCard({ fila }: { fila: Pendiente }) {
  const Icono = ICONO[fila.id];
  return (
    <Link
      href={fila.href}
      className="group relative flex h-full items-center gap-4 px-5 py-4 transition hover:bg-sunken active:scale-98 lg:flex-col lg:items-start lg:gap-3 lg:rounded-card lg:border lg:border-line-card lg:bg-surface lg:p-5 lg:shadow-card lg:hover:bg-surface lg:hover:shadow-float"
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-sunken">
        <Icono aria-hidden strokeWidth={1.6} className={cn("size-5", TONO[fila.tono])} />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="text-body-sm font-medium text-fg">{fila.titulo}</span>
        <span className="text-caption text-fg-secondary">{fila.detalle}</span>
        {fila.etiqueta && (
          <Badge tone="warning" className="mt-1 self-start">
            {fila.etiqueta}
          </Badge>
        )}
      </span>
      <span
        aria-hidden
        className="flex size-9 shrink-0 items-center justify-center rounded-full border border-line-subtle text-icon transition group-hover:translate-x-0.5 lg:absolute lg:top-5 lg:right-5"
      >
        <ChevronRight strokeWidth={1.6} className="size-4" />
      </span>
    </Link>
  );
}
