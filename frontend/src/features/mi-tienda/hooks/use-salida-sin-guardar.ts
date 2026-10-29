"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/** La advertencia de recarga vive en useMiTienda; aquí se interceptan los enlaces del panel. */
export function useSalidaSinGuardar(pendiente: boolean, guardando: boolean) {
  const router = useRouter();
  const [destino, setDestino] = useState<string | null>(null);
  useEffect(() => {
    if (!pendiente) return;
    function interceptar(event: MouseEvent) {
      const link = event.target instanceof Element ? event.target.closest("a") : null;
      if (!link || link.target === "_blank" || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || link.hasAttribute("download")) return;
      const url = new URL(link.href, location.href);
      if (url.origin !== location.origin || url.href === location.href || url.hash) return;
      event.preventDefault();
      if (!guardando) setDestino(url.pathname + url.search);
    }
    document.addEventListener("click", interceptar, true);
    return () => document.removeEventListener("click", interceptar, true);
  }, [pendiente, guardando]);
  function confirmar() {
    if (!destino) return;
    const href = destino;
    setDestino(null); router.push(href);
  }
  return { abierto: destino !== null, cerrar: () => setDestino(null), confirmar };
}
