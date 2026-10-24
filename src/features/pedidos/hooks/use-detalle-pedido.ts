"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { DetallePedido, Pedido } from "../types";
import { sincronizarPedido } from "../lib/acciones";
import { aplicar, inicial, type Accion } from "../lib/detalle";

type Estado = { pedido: Pedido; detalle: DetallePedido };

const AVISO: Record<Accion | "cancelar", string> = {
  pagar: "marcado como pagado",
  enviar: "marcado como enviado",
  recoger: "marcado como recogido",
  entregar: "marcado como entregado",
  "entregar-cobrar": "entregado y cobrado",
  cancelar: "cancelado",
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
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const ejecutar = useCallback(
    (accion: Accion | "cancelar") => {
      setAnterior(accion === "cancelar" ? null : estado);
      const [pedido, detalle] = aplicar(estado.pedido, estado.detalle, accion, ahora);
      setEstado({ pedido, detalle });
      void sincronizarPedido(pedido, detalle); // pedidos de la vitrina: estado y stock en el almacén
      setAviso(`Pedido #${pedido.numero} ${AVISO[accion]}.`);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => (setAviso(""), setAnterior(null)), 6000);
    },
    [estado, ahora],
  );

  const deshacer = useCallback(() => {
    if (anterior && estado.pedido.pago.estado !== "cancelado") {
      setEstado(anterior);
      void sincronizarPedido(anterior.pedido, anterior.detalle);
    }
    setAnterior(null);
    setAviso("");
    window.clearTimeout(timer.current);
  }, [anterior, estado.pedido.pago.estado]);

  return { ...estado, ejecutar, deshacer, aviso, puedeDeshacer: anterior !== null };
}
