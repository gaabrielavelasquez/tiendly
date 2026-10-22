import { Check, X } from "lucide-react";
import { TarjetaSeccion } from "@/components/panel";
import { cn } from "@/lib/cn";
import type { Paso } from "../../lib/detalle";

const MARCA: Record<Paso["estado"], string> = {
  hecho: "border-indicator bg-indicator text-on-selected",
  actual: "border-warning bg-warning-surface",
  pendiente: "border-line bg-surface",
  cancelado: "border-line-strong bg-sunken text-fg-secondary",
};

/**
 * Historial vertical: lo hecho en indicator/fill (DESIGN.md §4), lo que está en curso en ámbar
 * y lo que falta como marcador hueco. Cada paso dice qué pasó y cuándo.
 */
export function TarjetaHistorial({ pasos }: { pasos: Paso[] }) {
  return (
    <TarjetaSeccion titulo="Historial">
      <ol className="flex flex-col">
        {pasos.map((p, i) => (
          <li key={p.id} className="relative flex gap-3 pb-5 last:pb-0">
            {i < pasos.length - 1 && (
              <span aria-hidden className={cn("absolute top-6 bottom-0 left-2.5 w-px", p.estado === "hecho" ? "bg-indicator" : "bg-line")} />
            )}
            <span aria-hidden className={cn("relative z-10 flex size-5 shrink-0 items-center justify-center rounded-full border-2", MARCA[p.estado])}>
              {p.estado === "hecho" && <Check strokeWidth={3} className="size-3" />}
              {p.estado === "cancelado" && <X strokeWidth={3} className="size-3" />}
            </span>
            <div className="-mt-0.5 flex min-w-0 flex-1 flex-col gap-0.5">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <span className={cn("text-body-sm font-semibold", p.estado === "pendiente" ? "text-fg-secondary" : "text-fg")}>
                  {p.titulo}
                  <span className="sr-only">{p.estado === "hecho" ? " (hecho)" : p.estado === "actual" ? " (en curso)" : p.estado === "pendiente" ? " (pendiente)" : ""}</span>
                </span>
                {p.cuando && <span className="text-caption text-fg-secondary tabular-nums">{p.cuando}</span>}
              </div>
              {p.detalle && <span className={cn("text-caption", p.estado === "actual" ? "text-warning" : "text-fg-secondary")}>{p.detalle}</span>}
            </div>
          </li>
        ))}
      </ol>
    </TarjetaSeccion>
  );
}
