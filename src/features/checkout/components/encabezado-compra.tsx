import { Check, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/cn";

type Props = { paso: 1 | 2; titulo: string; volver: string; volverLabel: string; carrito: string };

/**
 * Encabezado de la compra (Figma, módulo 1). Móvil: volver, título y "Paso N de 2" con barra en dos
 * tramos (indicator/*). Desktop: pasos "Carrito — Finalizar compra" y el título en serif.
 */
export function EncabezadoCompra({ paso, titulo, volver, volverLabel, carrito }: Props) {
  return (
    <div className="flex flex-col gap-3 lg:gap-5">
      <div className="flex items-center gap-1 lg:hidden">
        <Link href={volver} aria-label={volverLabel} className="-ml-2 flex size-11 items-center justify-center rounded-theme text-icon hover:bg-sunken">
          <ChevronLeft aria-hidden strokeWidth={1.6} className="size-6" />
        </Link>
        <h1 className="text-h3 font-semibold text-fg">{titulo}</h1>
      </div>
      <div className="flex flex-col gap-2 lg:hidden">
        <p className="text-caption font-semibold text-fg-secondary">Paso {paso} de 2</p>
        <div aria-hidden className="grid grid-cols-2 gap-1">
          <span className="h-1 rounded-full bg-indicator" />
          <span className={cn("h-1 rounded-full", paso === 2 ? "bg-indicator" : "bg-sunken")} />
        </div>
      </div>
      <ol aria-label="Pasos de la compra" className="hidden items-center gap-3 text-body-sm lg:flex">
        <li className="flex items-center gap-2">
          {paso === 2 ? (
            <Link href={carrito} className="flex items-center gap-2 text-fg-secondary hover:text-fg">
              <span className="flex size-5 items-center justify-center rounded-full bg-success-surface text-success">
                <Check aria-hidden strokeWidth={2} className="size-3" />
              </span>
              Carrito
            </Link>
          ) : (
            <span aria-current="step" className="flex items-center gap-2 font-semibold text-fg">
              <span className="flex size-5 items-center justify-center rounded-full bg-selected text-label text-on-selected">1</span>
              Carrito
            </span>
          )}
        </li>
        <li aria-hidden className="h-px w-12 bg-line" />
        <li className={cn("flex items-center gap-2", paso === 2 ? "font-semibold text-fg" : "text-fg-secondary")} aria-current={paso === 2 ? "step" : undefined}>
          <span className={cn("flex size-5 items-center justify-center rounded-full text-label", paso === 2 ? "bg-selected text-on-selected" : "bg-sunken text-fg-secondary")}>2</span>
          Finalizar compra
        </li>
      </ol>
      <h1 className="hidden font-display-hero text-h1 text-fg lg:block">{titulo}</h1>
    </div>
  );
}
