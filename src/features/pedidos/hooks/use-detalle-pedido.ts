"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { DetallePedido, Pedido } from "../types";
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
 * deshacer la última durante unos segundos y avisa qué pasó.
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
      setAnterior(estado);
      const [pedido, detalle] = aplicar(estado.pedido, estado.detalle, accion, ahora);
      setEstado({ pedido, detalle });
      setAviso(`Pedido #${pedido.numero} ${AVISO[accion]}.`);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => (setAviso(""), setAnterior(null)), 6000);
    },
    [estado, ahora],
  );

  const deshacer = useCallback(() => {
    if (anterior) setEstado(anterior);
    setAnterior(null);
    setAviso("");
    window.clearTimeout(timer.current);
  }, [anterior]);

  return { ...estado, ejecutar, deshacer, aviso };
}
