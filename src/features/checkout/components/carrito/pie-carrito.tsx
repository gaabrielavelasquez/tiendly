import { Button } from "@/components/ui";
import { formatoSoles } from "@/lib/formato";
import type { Totales } from "../../types";

type Props = { totales: Totales; cupon?: string; bloqueado: boolean; onFinalizar: () => void; seguir: React.ReactNode };

const fila = "flex items-baseline justify-between gap-3 text-body-sm";

/**
 * Pie fijo del carrito (drawer y /carrito, 0036): cupón aplicado, subtotal, envío y las dos salidas: "Finalizar compra"
 * (CTA) y "Seguir comprando". Dinero sereno (0031): cifras tabulares, SemiBold solo en el subtotal.
 */
export function PieCarrito({ totales, cupon, bloqueado, onFinalizar, seguir }: Props) {
  const vacio = totales.unidades === 0;
  return (
    <div className="flex flex-col gap-3">
      {totales.descuento > 0 && (
        <p className={fila}>
          <span className="text-fg-secondary">Cupón {cupon}</span>
          <span className="text-success tabular-nums">−{formatoSoles(totales.descuento)}</span>
        </p>
      )}
      <p className="flex items-baseline justify-between gap-3">
        <span className="text-body-sm text-fg-secondary">
          Subtotal ({totales.unidades} {totales.unidades === 1 ? "producto" : "productos"})
        </span>
        <span className="text-body-lg font-semibold text-fg tabular-nums">{formatoSoles(totales.productos - totales.descuento)}</span>
      </p>
      <p className="text-caption text-fg-secondary">{totales.envioGratis ? "Tu envío es gratis." : "El envío lo eliges en el siguiente paso."}</p>
      {bloqueado && <p className="text-body-sm text-error">Quita las opciones agotadas para finalizar tu compra.</p>}
      <div className="flex flex-col gap-2">
        <Button block onClick={onFinalizar} disabled={bloqueado || vacio}>Finalizar compra</Button>
        {seguir}
      </div>
    </div>
  );
}
