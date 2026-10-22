import { Minus, Plus } from "lucide-react";

type Props = { nombre: string; cantidad: number; maximo: number; onCambio: (n: number) => void };

const boton = "flex size-11 items-center justify-center rounded-full text-icon transition-colors hover:bg-sunken disabled:text-fg-tertiary disabled:hover:bg-transparent";

/** Cantidad en pill (Figma): − 1 +. El máximo es el stock de esa variante. */
export function SelectorCantidad({ nombre, cantidad, maximo, onCambio }: Props) {
  return (
    <div role="group" aria-label={`Cantidad de ${nombre}`} className="flex h-11 w-fit items-center rounded-full border border-line-strong">
      <button type="button" aria-label="Quitar una unidad" disabled={cantidad <= 1} onClick={() => onCambio(cantidad - 1)} className={boton}>
        <Minus aria-hidden strokeWidth={1.6} className="size-4" />
      </button>
      <output aria-live="polite" className="min-w-6 text-center text-body-sm font-semibold text-fg tabular-nums">
        {cantidad}
      </output>
      <button type="button" aria-label="Sumar una unidad" disabled={cantidad >= maximo} onClick={() => onCambio(cantidad + 1)} className={boton}>
        <Plus aria-hidden strokeWidth={1.6} className="size-4" />
      </button>
    </div>
  );
}
