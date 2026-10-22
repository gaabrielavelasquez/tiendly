import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui";
import { formatoSoles } from "@/lib/formato";
import { cn } from "@/lib/cn";
import type { Totales } from "../../types";

type Props = { totales: Totales; cupon?: string; seguir: string; onFinalizar: () => void; bloqueado: boolean; children?: React.ReactNode };

const fila = "flex items-baseline justify-between gap-3 text-body-sm";

/** Desktop: "Resumen del pedido" fijo a la derecha (Figma D1), con el cupón adentro. */
export function ResumenCarrito({ totales, cupon, seguir, onFinalizar, bloqueado, children }: Props) {
  const subtotal = totales.productos - totales.descuento;
  return (
    <section aria-labelledby="resumen-titulo" className="sticky top-24 hidden flex-col gap-4 border border-line-subtle bg-surface p-6 lg:flex">
      <h2 id="resumen-titulo" className="text-h3 font-semibold text-fg">Resumen del pedido</h2>
      <p className={fila}>
        <span className="text-fg-secondary">Productos ({totales.unidades})</span>
        <span className="text-fg tabular-nums">{formatoSoles(totales.productos)}</span>
      </p>
      {children}
      {totales.descuento > 0 && (
        <p className={fila}>
          <span className="text-fg-secondary">Cupón {cupon}</span>
          <span className="text-success tabular-nums">−{formatoSoles(totales.descuento)}</span>
        </p>
      )}
      <p className={cn(fila, "border-b border-line-subtle pb-4")}>
        <span className="text-fg-secondary">Envío</span>
        <span className="text-fg">{totales.envioGratis ? "Gratis" : "Se calcula en el siguiente paso"}</span>
      </p>
      <p className="flex items-baseline justify-between">
        <span className="text-body font-semibold text-fg">Total</span>
        <span className="text-h2 font-semibold text-fg tabular-nums">{formatoSoles(subtotal)}</span>
      </p>
      <Button block onClick={onFinalizar} disabled={bloqueado} className="h-12">
        Finalizar compra
      </Button>
      <Link href={seguir} className={cn(buttonVariants({ variant: "ghost" }), "text-fg")}>
        Seguir comprando
      </Link>
    </section>
  );
}

/** Móvil: barra fija abajo con subtotal, "Finalizar compra" y "Seguir comprando" (Figma 1 · Carrito). */
export function BarraCarrito({ totales, seguir, onFinalizar, bloqueado }: Omit<Props, "children" | "cupon">) {
  const subtotal = totales.productos - totales.descuento;
  return (
    <div className="fixed inset-x-0 bottom-0 z-20 flex flex-col gap-2 border-t border-line-subtle bg-surface px-4 pt-3 pb-[max(env(safe-area-inset-bottom),--spacing(3))] lg:hidden">
      <p className="flex items-baseline justify-between">
        <span className="text-body-sm text-fg-secondary">
          Subtotal ({totales.unidades} {totales.unidades === 1 ? "producto" : "productos"})
        </span>
        <span className="text-h3 font-semibold text-fg tabular-nums">{formatoSoles(subtotal)}</span>
      </p>
      <Button block onClick={onFinalizar} disabled={bloqueado} className="h-12">
        Finalizar compra
      </Button>
      <Link href={seguir} className={cn(buttonVariants({ variant: "ghost" }), "text-fg")}>
        Seguir comprando
      </Link>
    </div>
  );
}
