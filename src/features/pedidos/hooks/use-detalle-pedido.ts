"use client";

import { useCallback, useState } from "react";
import type { DetallePedido, Pedido } from "../types";
import { sincronizarPedido } from "../lib/acciones";
import { ahoraIso } from "@/lib/reloj";
import { aplicar, inicial, type AccionPedido } from "../lib/detalle";

type Estado = { pedido: Pedido; detalle: DetallePedido };

const AVISO: Record<AccionPedido, string> = {
  pagar: "marcado como pagado",
  enviar: "marcado como enviado",
  recoger: "marcado como recogido",
  entregar: "marcado como entregado",
  "entregar-cobrar": "entregado y cobrado",
  cancelar: "cancelado",
  "desmarcar-pago": "marcado como no pagado",
};

/**
 * Estado del detalle de un pedido en el cliente (hasta tener backend): aplica acciones, deja
 * deshacer la última durante unos segundos, salvo cancelar (irreversible), y avisa qué pasó.
 */
export function useDetallePedido(p: Pedido, d: DetallePedido, ahora: string) {
  const [estado, setEstado] = useState<Estado>(() => {
    const [pedido, detalle] = inicial(p, d, ahora);
    return { pedido, detalle };
  });
  const [anterior, setAnterior] = useState<Estado | null>(null);
  const [aviso, setAviso] = useState("");
  const [avisoId, setAvisoId] = useState(0);
  const cerrarAviso = useCallback(() => { setAviso(""); setAnterior(null); }, []);

  const ejecutar = useCallback(
    (accion: AccionPedido) => {
      setAnterior(accion === "cancelar" || accion === "desmarcar-pago" ? null : estado);
      const [pedido, detalle] = aplicar(estado.pedido, estado.detalle, accion, ahoraIso());
      setEstado({ pedido, detalle });
      void sincronizarPedido(pedido, detalle); // pedidos de la vitrina: estado y stock en el almacén
      setAviso(`Pedido #${pedido.numero} ${AVISO[accion]}.`);
      setAvisoId((id) => id + 1);
    },
    [estado],
  );

  const deshacer = useCallback(() => {
    if (anterior && estado.pedido.pago.estado !== "cancelado") {
      setEstado(anterior);
      void sincronizarPedido(anterior.pedido, anterior.detalle);
    }
    setAnterior(null);
    setAviso("");

  }, [anterior, estado.pedido.pago.estado]);

  return { ...estado, ejecutar, deshacer, aviso, avisoId, cerrarAviso, puedeDeshacer: anterior !== null };
}
