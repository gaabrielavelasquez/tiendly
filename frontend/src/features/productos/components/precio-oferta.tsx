import { Badge } from "@/components/ui";
import { cn } from "@/lib/cn";
import { formatoSoles } from "@/lib/formato";
import { descuento, estadoOferta, precioVigente, type ConPrecio } from "../lib/ofertas";

type Props = { p: ConPrecio; hoy: string; tamano?: "lista" | "ficha"; className?: string };

/**
 * Precio con oferta (0034): el vigente, el normal tachado y "−22 %" (Badge de selección: carbón o el color del tema;
 * sin rojo). Fuera de fechas, solo el precio normal. Montos serenos (0031): Regular o Medium, cifras tabulares.
 * Accesible: "Precio anterior: S/ 89" y "Descuento de 22 %" para lectores de pantalla. Sin fechas: van aparte, solo en el panel.
 */
export function PrecioOferta({ p, hoy, tamano = "lista", className }: Props) {
  const activa = estadoOferta(p, hoy) === "activa";
  return (
    <span className={cn("flex flex-wrap items-center gap-x-2 gap-y-1 tabular-nums", className)}>
      <span className={cn("font-medium text-fg", tamano === "ficha" ? "text-body-lg" : "text-body-sm")}>{formatoSoles(precioVigente(p, hoy))}</span>
      {activa && (
        <>
          <span className={cn("text-fg-tertiary line-through", tamano === "ficha" ? "text-body-sm" : "text-caption")}>
            <span className="sr-only">Precio anterior: </span>
            {formatoSoles(p.precioAntes!)}
          </span>
          <Badge tone="selected" className="h-5 px-1.5 tabular-nums">
            <span className="sr-only">Descuento de </span>−{descuento(p.precio, p.precioAntes)} %
          </Badge>
        </>
      )}
    </span>
  );
}
