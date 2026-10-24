import { Check, X, Minus } from "lucide-react";
import { Seccion } from "@/components/panel";
import { cn } from "@/lib/cn";
import type { Paso } from "../../lib/detalle";

const MARCA: Record<Paso["estado"], string> = {
  hecho: "text-icon",
  actual: "text-fg",
  pendiente: "text-icon-subtle",
  cancelado: "text-icon",
};

/**
 * Historial vertical: progreso neutro sin círculos. El color se reserva al plazo del pago.
 * Cada paso conserva su estado, descripción y fecha.
 */
export function TarjetaHistorial({ pasos }: { pasos: Paso[] }) {
  return (
    <Seccion id="historial-pedido" titulo="Historial">
      <ol className="flex flex-col">
        {pasos.map((p, i) => (
          <li key={p.id} className="relative flex gap-3 pb-5 last:pb-0">
            {i < pasos.length - 1 && (
              <span aria-hidden className={cn("absolute top-6 bottom-0 left-2.5 w-px", p.estado === "hecho" ? "bg-indicator" : "bg-line")} />
            )}
            <span aria-hidden className={cn("relative z-10 flex size-5 shrink-0 items-center justify-center bg-surface", MARCA[p.estado])}>
              {p.estado === "hecho" && <Check strokeWidth={1.5} className="size-4" />}
              {p.estado === "cancelado" && <X strokeWidth={1.5} className="size-4" />}
              {(p.estado === "actual" || p.estado === "pendiente") && <Minus strokeWidth={1.5} className="size-4" />}
            </span>
            <div className="-mt-0.5 flex min-w-0 flex-1 flex-col gap-0.5">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <span className={cn("text-body-sm font-semibold", p.estado === "pendiente" ? "text-fg-secondary" : "text-fg")}>
                  {p.titulo}
                  <span className="sr-only">{p.estado === "hecho" ? " (hecho)" : p.estado === "actual" ? " (en curso)" : p.estado === "pendiente" ? " (pendiente)" : ""}</span>
                </span>
                {p.cuando && <span className="text-caption text-fg-secondary tabular-nums">{p.cuando}</span>}
              </div>
              {p.detalle && <span className={cn("text-caption", p.estado === "actual" && p.id === "pago" ? "text-warning" : "text-fg-secondary")}>{p.detalle}</span>}
            </div>
          </li>
        ))}
      </ol>
    </Seccion>
  );
}
