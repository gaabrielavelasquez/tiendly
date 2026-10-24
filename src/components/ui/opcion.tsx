import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

type Props = {
  /** Fila de una lista con divisores; el contenedor lo pone quien la usa. */
  fila?: boolean;
  nombre: string;
  valor: string;
  elegida: boolean;
  onElegir: () => void;
  titulo: string;
  detalle: string;
  icono?: LucideIcon;
  etiqueta?: React.ReactNode;
  children?: React.ReactNode;
};

/**
 * Tarjeta de opción con radio (Figma: entrega y pago en el checkout; tipo de descuento en Cupones).
 * Esquinas del tema: rectas en la vitrina Editorial, 8 px en el panel. Elegida: borde carbón de 2 px (selection/border,
 * decisión 0019) y su contenido se despliega adentro.
 */
export function Opcion({ nombre, valor, elegida, onElegir, titulo, detalle, icono: Icono, etiqueta, children, fila = false }: Props) {
  return (
    <div className={cn("bg-surface transition-colors", fila ? "" : elegida ? "border-2 border-selected-border" : "border border-line-subtle hover:border-line-strong", !fila && "rounded-card")}>
      <label className={cn("flex cursor-pointer items-start gap-3", !fila && elegida ? "p-3.75" : "min-h-11 p-4")}>
        <input type="radio" name={nombre} value={valor} checked={elegida} onChange={onElegir} className="peer sr-only" />
        <span aria-hidden className={cn("mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus", elegida ? "border-selected-border" : "border-line-strong")}>
          {elegida && <span className="size-2.5 rounded-full bg-selected" />}
        </span>
        {Icono && <Icono aria-hidden strokeWidth={1.6} className="mt-0.5 size-5 shrink-0 text-icon" />}
        <span className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="text-body font-semibold text-fg">{titulo}</span>
          <span className="text-body-sm text-fg-secondary">{detalle}</span>
          {etiqueta}
        </span>
      </label>
      {elegida && children && <div className="flex flex-col gap-4 px-4 pb-4">{children}</div>}
    </div>
  );
}
