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
    <section aria-labelledby={id} className={cn("border bg-surface", estado === "abierto" ? "border-line-strong" : "border-line-subtle")}>
      <div className="flex items-start gap-3 p-4">
        {estado === "hecho" ? (
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-success-surface text-success">
            <Check aria-hidden strokeWidth={2.2} className="size-4" />
            <span className="sr-only">Listo:</span>
          </span>
        ) : (
          <span aria-hidden className={cn("flex size-7 shrink-0 items-center justify-center rounded-full text-body-sm font-semibold", estado === "abierto" ? "bg-selected text-on-selected" : "bg-sunken text-fg-secondary")}>
            {numero}
          </span>
        )}
        <div className="flex min-w-0 flex-1 flex-col gap-0.5 pt-0.5">
          <h2 id={id} className={cn("text-body font-semibold", estado === "pendiente" ? "text-fg-secondary" : "text-fg")}>
            {titulo}
          </h2>
          {estado !== "abierto" && <div className="text-body-sm text-fg-secondary">{resumen}</div>}
        </div>
        {estado === "hecho" && onEditar && (
          <button type="button" onClick={onEditar} className="-my-2 h-11 px-1 text-body-sm font-semibold text-fg underline-offset-4 hover:underline">
            Editar<span className="sr-only"> {titulo.toLowerCase()}</span>
          </button>
        )}
      </div>
      {estado === "abierto" && <div className="flex flex-col gap-4 px-4 pb-4">{children}</div>}
    </section>
  );
}
