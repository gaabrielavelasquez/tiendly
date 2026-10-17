"use client";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui";

type Props = { abierto: boolean; guardando: boolean; mensaje: string; cerrar: () => void; descartar: () => void; guardar: () => Promise<void> };
export function SalidaSinGuardar({ abierto, guardando, mensaje, cerrar, descartar, guardar }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (abierto && !dialog.current?.open) dialog.current?.showModal();
    else if (!abierto && dialog.current?.open) dialog.current?.close();
  }, [abierto]);
  return <dialog ref={dialog} aria-labelledby="salir-mi-tienda" onCancel={e => { if (guardando) e.preventDefault(); else cerrar(); }}
    className="fixed inset-x-0 bottom-0 top-auto m-0 max-h-[90dvh] w-full max-w-none overflow-y-auto rounded-t-xl border border-line-subtle bg-surface p-6 text-fg shadow-overlay backdrop:bg-scrim lg:inset-0 lg:m-auto lg:max-w-lg lg:rounded-card">
    <h2 id="salir-mi-tienda" className="font-display-title text-h2">Tienes cambios sin guardar</h2>
    <p className="mt-3 text-body text-fg-secondary">Guarda los cambios antes de salir o descártalos para conservar la última versión guardada.</p>
    {mensaje && <p role="status" className="mt-3 text-body-sm text-fg-secondary">{mensaje}</p>}
    <div className="mt-6 flex flex-col gap-3">
      <Button disabled={guardando} loading={guardando} onClick={() => void guardar()}>Guardar y salir</Button>
      <Button variant="secondary" disabled={guardando} onClick={cerrar}>Seguir editando</Button>
      <Button variant="ghost" disabled={guardando} onClick={descartar}>Descartar y salir</Button>
    </div>
  </dialog>;
}
