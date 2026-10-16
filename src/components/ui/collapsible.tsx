"use client";

import { ChevronDown } from "lucide-react";
import { useId, useState } from "react";
import { cn } from "@/lib/cn";

type CollapsibleProps = {
  /** Lo que se ve plegado (va dentro del botón: texto, no controles). */
  resumen: React.ReactNode;
  children: React.ReactNode;
  abiertoInicial?: boolean;
  className?: string;
  /** Clases del botón (alto, relleno, tipografía). */
  claseBoton?: string;
  /** Clases del contenido desplegado. */
  claseContenido?: string;
};

/**
 * Sección plegable (acordeón): un botón con el resumen y un chevron que gira (150 ms ease-out,
 * motion/duration/fast). Accesible: aria-expanded y aria-controls; el contenido plegado no está en el DOM.
 */
export function Collapsible({ resumen, children, abiertoInicial = false, className, claseBoton, claseContenido }: CollapsibleProps) {
  const [abierto, setAbierto] = useState(abiertoInicial);
  const id = useId();
  return (
    <div className={className}>
      <button
        type="button"
        aria-expanded={abierto}
        aria-controls={id}
        onClick={() => setAbierto((v) => !v)}
        className={cn("flex min-h-11 w-full items-center gap-3 text-left", claseBoton)}
      >
        <span className="min-w-0 flex-1">{resumen}</span>
        <ChevronDown aria-hidden strokeWidth={1.6} className={cn("size-5 shrink-0 text-icon transition-transform duration-150 ease-out", abierto && "rotate-180")} />
      </button>
      {abierto && (
        <div id={id} className={claseContenido}>
          {children}
        </div>
      )}
    </div>
  );
}
