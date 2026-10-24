import { CreditCard } from "lucide-react";
import { Seccion } from "@/components/panel";
import type { Pedido } from "../../types";
import { plazoReserva } from "../../lib/format";
import { BADGE_PAGO, METODO_PAGO } from "../../lib/reglas";

/** El pago ya existente, separado del resumen: método, estado y plazo de reserva, sin confirmaciones automáticas. */
export function TarjetaPago({ pedido, ahora }: { pedido: Pedido; ahora: string }) {
  const vence = plazoReserva(pedido, ahora);
  const cancelado = pedido.pago.estado === "cancelado";
  return (
    <Seccion id="pago-pedido" titulo="Pago">
      <div className="flex items-start gap-3">
        <CreditCard aria-hidden strokeWidth={1.5} className="mt-0.5 size-5 shrink-0 text-icon" />
        <div className="flex min-w-0 flex-col gap-1 text-body-sm">
          <span className="font-medium text-fg">{METODO_PAGO[pedido.pago.metodo]}</span>
          <span className="text-fg-secondary">{BADGE_PAGO[pedido.pago.estado].texto}</span>
          {vence && <span className="font-medium text-warning">{vence}</span>}
        </div>
      </div>
      <p className="text-caption text-fg-secondary">
        {cancelado ? "Pedido cancelado: no se cobró." : pedido.pago.estado === "pagado" ? "El pago está registrado." : pedido.pago.metodo === "contra-entrega" ? "Se cobra al entregar." : "Verifica el abono antes de marcar el pedido como pagado. La reserva dura 24 h."}
      </p>
    </Seccion>
  );
}
