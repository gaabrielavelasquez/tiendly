"use client";
import { useEffect, useId, useRef } from "react";
import { Button } from "@/components/ui";

/** Hoja en móvil, modal centrado en desktop. Dialog nativo: foco, Escape e inert. */
export function HojaModal({ titulo, abierto, cerrar, children, ocupado = false, subtitulo }: { titulo: string; abierto: boolean; cerrar: () => void; children: React.ReactNode; ocupado?: boolean; subtitulo?: string }) {
  const ref = useRef<HTMLDialogElement>(null);
  const id = useId();
  useEffect(() => { if (abierto && !ref.current?.open) { ref.current?.showModal(); ref.current?.querySelector<HTMLElement>("[data-foco-inicial]")?.focus(); } else if (!abierto && ref.current?.open) ref.current?.close(); }, [abierto]);
  return <dialog ref={ref} aria-labelledby={id} onCancel={(e) => { if (ocupado) e.preventDefault(); else cerrar(); }} onClose={cerrar}
    className="fixed inset-x-0 bottom-0 top-auto m-0 max-h-[90dvh] w-full max-w-none overflow-y-auto rounded-t-xl border border-line-subtle bg-surface p-6 text-fg shadow-overlay backdrop:bg-scrim lg:inset-0 lg:m-auto lg:max-w-140 lg:rounded-card lg:p-8">
    <div className="mb-5 flex items-start justify-between gap-3"><h2 id={id} className="min-w-0 flex-1 break-words font-display-light text-h2 tracking-tight"><span className="block">{titulo}</span>{subtitulo && <span className="block text-fg-secondary">{subtitulo}</span>}</h2><Button variant="ghost" disabled={ocupado} onClick={cerrar}>Cerrar</Button></div>
    {children}
  </dialog>;
}
