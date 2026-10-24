import { cn } from "@/lib/cn";
import { formatoSoles } from "@/lib/formato";

/** Montos de Pedidos (0031): cifras tabulares, moneda y decimales atenuados; hereda el tamaño y peso del contexto. */
export function MontoPedido({ valor, className }: { valor: number; className?: string }) {
  const [entero, decimales] = valor.toFixed(2).split(".");
  return (
    <span aria-label={formatoSoles(valor)} className={cn("inline-flex items-baseline whitespace-nowrap tabular-nums", className)}>
      <span aria-hidden className="mr-1 text-caption font-normal text-fg-secondary">S/</span>
      <span aria-hidden>{Number(entero).toLocaleString("es-PE")}</span>
      <span aria-hidden className="text-caption font-normal text-fg-secondary">.{decimales}</span>
    </span>
  );
}
