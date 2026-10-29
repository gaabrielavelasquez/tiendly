import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

type Props = {
  numero: number;
  titulo: string;
  estado: "abierto" | "hecho" | "pendiente";
  /** Hecho: el resumen ("Andrea Quispe · 987 654 321"). Pendiente: qué viene ("Delivery o recojo en tienda"). */
  resumen: React.ReactNode;
  onEditar?: () => void;
  children?: React.ReactNode;
};

/**
 * Un paso de "Finalizar compra" (Figma K0): abierto con su número en carbón, hecho con check y "Editar",
 * o pendiente en gris. Al completarse se pliega y deja su resumen.
 */
export function Paso({ numero, titulo, estado, resumen, onEditar, children }: Props) {
  const id = `paso-${numero}`;
  return (
    <section aria-labelledby={id} className="flex min-w-0 flex-col gap-3">
      <header className="flex min-w-0 items-center gap-3">
        <span aria-hidden className={cn("flex size-6 shrink-0 items-center justify-center text-body-sm", estado === "abierto" ? "rounded-full bg-indicator text-on-selected" : "text-fg-secondary")}>
          {estado === "hecho" ? <Check strokeWidth={1.5} className="size-5 text-icon" /> : numero}
        </span>
        <h2 id={id} aria-current={estado === "abierto" ? "step" : undefined} className={cn("min-w-0 flex-1 font-display-light text-h3", estado === "pendiente" ? "text-fg-secondary" : "text-fg")}>{titulo}</h2>
        {estado === "hecho" && <span className="sr-only">Completado.</span>}
        {estado === "hecho" && onEditar && <button type="button" onClick={onEditar} className="min-h-11 shrink-0 px-2 text-body-sm font-medium text-accent-text underline-offset-4 hover:underline">Editar<span className="sr-only"> {titulo.toLowerCase()}</span></button>}
      </header>
      {estado === "abierto" ? <div className="flex min-w-0 flex-col gap-5 rounded-card bg-surface p-5 shadow-contenedor lg:p-6">{children}</div>
        : <div className="min-w-0 break-words rounded-card bg-surface p-5 text-body-sm text-fg-secondary shadow-contenedor lg:p-6">{resumen}</div>}
    </section>
  );
}
