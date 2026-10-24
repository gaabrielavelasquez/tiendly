"use client";

import { Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Seccion } from "@/components/panel";

type NotasProps = { pedidoId: string; inicial?: string };

/**
 * Notas internas del pedido. Se guardan solas al dejar de escribir (en este navegador, hasta tener
 * backend). El cliente nunca las ve.
 */
export function TarjetaNotas({ pedidoId, inicial = "" }: NotasProps) {
  const clave = `tiendly:nota:${pedidoId}`;
  const [texto, setTexto] = useState(inicial);
  const [estado, setEstado] = useState<"" | "guardando" | "guardado">("");
  const timer = useRef<number | undefined>(undefined);

  // Lo guardado se lee después de montar (el servidor no tiene localStorage: así no hay error de hidratación).
  useEffect(() => {
    try {
      const guardada = localStorage.getItem(clave);
      if (guardada !== null) setTexto(guardada);
    } catch {}
    return () => window.clearTimeout(timer.current);
  }, [clave]);

  function cambiar(v: string) {
    setTexto(v);
    setEstado("guardando");
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      try {
        localStorage.setItem(clave, v);
      } catch {}
      setEstado("guardado");
    }, 600);
  }

  return (
    <Seccion
      id="notas-pedido"
      titulo="Notas"
      descripcion="Solo tú las ves."
      accion={
        <span role="status" className="flex h-6 items-center gap-1 text-caption text-fg-secondary">
          {estado === "guardado" && <Check aria-hidden strokeWidth={2} className="size-3.5 text-success" />}
          {estado === "guardando" ? "Guardando…" : estado === "guardado" ? "Guardado" : ""}
        </span>
      }
    >
      <label htmlFor={`nota-${pedidoId}`} className="sr-only">
        Notas internas del pedido
      </label>
      <textarea
        id={`nota-${pedidoId}`}
        value={texto}
        onChange={(e) => cambiar(e.target.value)}
        rows={4}
        placeholder="Ej. Envolver para regalo, cobrar el saldo al entregar…"
        className="block w-full resize-y rounded-button border border-line-strong bg-surface px-3 py-2.5 text-body text-fg outline-2 outline-offset-2 outline-transparent transition placeholder:text-fg-tertiary focus:outline-focus"
      />
    </Seccion>
  );
}
