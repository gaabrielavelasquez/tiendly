"use client";

import { useCallback, useState } from "react";
import type { DetallePedido, Pedido } from "../types";
import { comandoPedido, deshacerPedido, sincronizarPedido } from "../lib/acciones";
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
 * Estado del detalle de un pedido en el cliente: aplica acciones, deja deshacer la última durante
 * unos segundos, salvo cancelar (irreversible), y avisa qué pasó. Con API, la acción se confirma
 * con un comando del backend; si llegó tarde, la vista vuelve a lo que tiene el servidor.
 */
export function useDetallePedido(p: Pedido, d: DetallePedido, ahora: string, conApi = false) {
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
      const previo = estado;
      setAnterior(accion === "cancelar" || accion === "desmarcar-pago" ? null : previo);
      const [pedido, detalle] = aplicar(previo.pedido, previo.detalle, accion, ahoraIso());
      setEstado({ pedido, detalle });
      setAviso(`Pedido #${pedido.numero} ${AVISO[accion]}.`);
      setAvisoId((id) => id + 1);
      if (conApi) {
        void comandoPedido(pedido.id, accion, previo.pedido.version ?? 0).then((r) => {
          if ("error" in r) {
            setEstado(previo); // el comando no pasó: se muestra el pedido como está en el backend
            setAviso(r.error);
            setAvisoId((id) => id + 1);
          } else {
            // La respuesta trae la versión canónica: el siguiente comando parte de ella.
            setEstado({ pedido: r.pedido, detalle: r.detalle });
          }
        }).catch(() => {
          setEstado(previo);
          setAviso("No se pudo guardar el cambio. Revisa tu conexión e inténtalo de nuevo.");
          setAvisoId((id) => id + 1);
        });
      } else {
        void sincronizarPedido(pedido, detalle); // pedidos de la vitrina: estado y stock en el almacén
      }
    },
    [estado, conApi],
  );

  const deshacer = useCallback(() => {
    if (!anterior || estado.pedido.pago.estado === "cancelado") return;
    const previo = estado;
    const objetivo = anterior;
    setEstado(objetivo);
    setAnterior(null);
    setAviso("");
    if (conApi) {
      void deshacerPedido(previo.pedido.id).then((r) => {
        if ("error" in r) {
          setEstado(previo);
          setAviso(r.error);
          setAvisoId((id) => id + 1);
        } else {
          setEstado({ pedido: r.pedido, detalle: r.detalle });
        }
      }).catch(() => {
        setEstado(previo);
        setAviso("No se pudo deshacer. Revisa tu conexión e inténtalo de nuevo.");
        setAvisoId((id) => id + 1);
      });
    } else {
      void sincronizarPedido(objetivo.pedido, objetivo.detalle);
    }
  }, [anterior, estado, conApi]);

  return { ...estado, ejecutar, deshacer, aviso, avisoId, cerrarAviso, puedeDeshacer: anterior !== null };
}
