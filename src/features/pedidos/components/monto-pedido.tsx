import { cn } from "@/lib/cn";
import { formatoSoles } from "@/lib/formato";

/** Mismo redondeo y soles enteros que la tienda; la moneda queda atenuada. */
export function MontoPedido({ valor, tachado = false, className }: { valor: number; tachado?: boolean; className?: string }) {
  const monto = formatoSoles(valor);
  return (
    <span aria-label={monto} className={cn("inline-flex items-baseline whitespace-nowrap tabular-nums", className)}>
      <span aria-hidden className={cn("mr-1 text-caption font-normal", tachado ? "text-fg-tertiary line-through" : "text-fg-secondary")}>S/</span>
      <span aria-hidden className={cn(tachado && "text-fg-tertiary line-through")}>{monto.replace(/^S\/\s*/, "")}</span>
    </span>
  );
}
