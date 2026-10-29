import { Badge } from "@/components/ui";
import { cn } from "@/lib/cn";
import { formatoSoles } from "@/lib/formato";

type Props = { precio: number; precioAntes?: number; descuento: number; tamano?: "tarjeta" | "ficha"; conEtiqueta?: boolean; className?: string };

/**
 * Precio en la tienda (0034): el vigente; con oferta, el normal tachado y "−22 %" (Badge de selección: el color del
 * tema, nunca rojo). Sin fechas: solo se ven en el panel. Accesible: "Precio anterior" y "Descuento de".
 */
export function PrecioTienda({ precio, precioAntes, descuento, tamano = "tarjeta", conEtiqueta = true, className }: Props) {
  const ficha = tamano === "ficha";
  return (
    <span className={cn("flex flex-wrap items-baseline gap-x-2 gap-y-1 tabular-nums", className)}>
      <span className={cn("font-body text-fg", ficha ? "text-body-lg font-semibold" : "text-body-sm", descuento > 0 && !ficha && "font-medium")}>{formatoSoles(precio)}</span>
      {descuento > 0 && precioAntes && (
        <>
          <span className={cn("text-fg-tertiary line-through", ficha ? "text-body-sm" : "text-caption")}>
            <span className="sr-only">Precio anterior: </span>
            {formatoSoles(precioAntes)}
          </span>
          {conEtiqueta && (
            <Badge tone="selected" className="h-5 self-center px-1.5 tabular-nums">
              <span className="sr-only">Descuento de </span>−{descuento} %
            </Badge>
          )}
        </>
      )}
    </span>
  );
}
