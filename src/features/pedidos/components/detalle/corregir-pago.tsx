"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { HojaModal } from "@/features/afiliacion/components/hoja-modal";
import type { Pedido } from "../../types";
import { venceEl } from "../../lib/reglas";

/** Corrección disponible después del aviso temporal; no revierte el envío ni renueva la reserva. */
export function CorregirPago({ pedido, onConfirmar }: { pedido: Pedido; onConfirmar: () => void }) {
  const [abierto, setAbierto] = useState(false);
  const [vencida, setVencida] = useState(false);
  return (
    <>
      <Button variant="ghost" className="self-start" onClick={() => {
        setVencida(pedido.pago.metodo !== "contra-entrega" && venceEl(pedido) <= Date.now()); setAbierto(true);
      }}>Marcar como no pagado</Button>
      <HojaModal titulo="Marcar como no pagado" abierto={abierto} cerrar={() => setAbierto(false)}>
        <p className="text-body text-fg-secondary">Se quitará la confirmación de pago del pedido #{pedido.numero}. No se realizará ningún reembolso.</p>
        {pedido.entrega.estado !== "por-enviar" && <p className="mt-4 text-body font-medium text-warning">{pedido.entrega.estado === "enviado" ? "Este pedido ya fue enviado." : pedido.entrega.metodo === "recojo" ? "Este pedido ya fue recogido." : "Este pedido ya fue entregado."} Cambiar el pago no revierte su entrega.</p>}
        <p className="mt-4 text-body text-fg-secondary">{pedido.pago.metodo === "contra-entrega" ? "El cobro volverá a quedar pendiente. Contra entrega no tiene vencimiento de reserva." : vencida ? "La reserva original de 24 h ya venció. El pedido se cancelará automáticamente y se liberará su stock." : "El pago volverá a pendiente, con el vencimiento original de la reserva de 24 h. No se reinicia el plazo."}</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button autoFocus data-foco-inicial variant="secondary" onClick={() => setAbierto(false)}>Conservar pago</Button>
          <Button variant="danger" onClick={() => { setAbierto(false); onConfirmar(); }}>Sí, marcar como no pagado</Button>
        </div>
      </HojaModal>
    </>
  );
}
