import { Check, ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import type { Paso } from "../types";

type PasoFilaProps = { paso: Paso; destacado: boolean; separador: boolean };

function Marca({ hecho }: { hecho: boolean }) {
  return hecho ? (
    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-success">
      <Check aria-hidden strokeWidth={2} className="size-4 text-fg-inverse" />
    </span>
  ) : (
    <span aria-hidden className="size-7 shrink-0 rounded-full border-2 border-line" />
  );
}

const Configurar = ({ className }: { className: string }) => (
  <span className={cn("items-center text-body-sm font-bold text-accent-text", className)}>
    Configurar<span aria-hidden>&nbsp;→</span>
  </span>
);

/**
 * Un paso para arrancar. Solo el siguiente pendiente se resalta (selection/*, decisión 0027) y lleva "Configurar →"
 * (en móvil debajo del texto, en desktop a la derecha); los demás pendientes, chevron.
 */
export function PasoFila({ paso, destacado, separador }: PasoFilaProps) {
  const texto = (
    <span className="flex min-w-0 flex-1 flex-col gap-0.5">
      <span className={cn("text-body-sm font-bold", paso.hecho ? "text-fg-secondary" : "text-fg")}>{paso.titulo}</span>
      <span className="text-caption text-fg-secondary">{paso.descripcion}</span>
      {destacado && <Configurar className="flex min-h-8 lg:hidden" />}
    </span>
  );

  return (
    <li className={cn(separador && "border-t border-line-subtle")}>
      {paso.hecho ? (
        <div className="flex min-h-12 items-center gap-3 py-2.5">
          <Marca hecho />
          {texto}
          <span className="sr-only">Listo.</span>
        </div>
      ) : (
        <Link
          href={paso.href}
          className={cn(
            "group flex min-h-12 items-center gap-3 transition-colors",
            destacado
              ? "rounded-theme border border-selected-border bg-selected-subtle p-3"
              : "-mx-2 rounded-theme px-2 py-3 hover:bg-sunken",
          )}
        >
          <Marca hecho={false} />
          {texto}
          {destacado ? (
            <Configurar className="hidden min-h-11 lg:flex" />
          ) : (
            <ChevronRight aria-hidden strokeWidth={1.6} className="size-6 shrink-0 text-icon transition-transform group-hover:translate-x-0.5" />
          )}
        </Link>
      )}
    </li>
  );
}
