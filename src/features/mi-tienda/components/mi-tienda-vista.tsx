"use client";
import { useRef, useState } from "react";
import { CloudOff, Monitor, Smartphone, Sparkles } from "lucide-react";
import { PanelMain } from "@/components/panel";
import { Badge, Button, Card, EmptyState } from "@/components/ui";
import { cn } from "@/lib/cn";
import { useMiTienda } from "../hooks/use-mi-tienda";
import { useSalidaSinGuardar } from "../hooks/use-salida-sin-guardar";
import { Apariencia } from "./apariencia";
import { CamposFree } from "./campos-free";
import { MiTiendaSkeleton } from "./mi-tienda-skeleton";
import { ProBloqueado } from "./pro-bloqueado";
import { TiendaPreview } from "./tienda-preview";
import { SalidaSinGuardar } from "./salida-sin-guardar";

export function MiTiendaVista({ escenario }: { escenario?: string }) {
  const m = useMiTienda(escenario);
  const salida = useSalidaSinGuardar(m.pendiente, m.guardando);
  const [computadora, setComputadora] = useState(false);
  const preview = useRef<HTMLDialogElement>(null);
  return <PanelMain className="pb-28 lg:pb-12">
    <header className="flex flex-wrap items-start justify-between gap-4">
      <div><h1 className="font-display-title text-h1 text-fg">Mi tienda</h1><p className="mt-1 text-body text-fg-secondary">Así ven tu tienda tus clientes. Los cambios se guardan cuando tocas Guardar.</p></div>
      <Badge>Plan Free</Badge>
    </header>
    {m.estado === "cargando" ? <MiTiendaSkeleton /> : m.estado === "error" ? <Card><EmptyState icon={CloudOff} title="No pudimos cargar tu tienda" description="Revisa tu conexión o los datos guardados e inténtalo de nuevo." action={<Button onClick={m.cargar}>Reintentar</Button>} /></Card> : <>
      {escenario === "vacio" && <p className="rounded-card border border-line-subtle bg-surface p-4 text-body-sm text-fg-secondary">Tu tienda está lista para personalizar. Elige un tema y agrega tu marca.</p>}
      <div className="grid items-start gap-6 xl:grid-cols-2">
        <div className="flex min-w-0 flex-col gap-5">
          <Apariencia tienda={m.tienda} cambiar={m.cambiar} vistaPrevia={() => preview.current?.showModal()} />
          <CamposFree tienda={m.tienda} errores={m.errores} cambiar={m.cambiar} />
          <ProBloqueado />
        </div>
        <aside className="sticky top-6 hidden min-w-0 xl:block" aria-label="Vista previa en vivo">
          <Card className="flex flex-col gap-4 p-4 lg:p-5">
            <div className="flex items-center justify-between"><h2 className="flex items-center gap-2 font-display-title text-h3"><Sparkles aria-hidden className="size-5 text-indicator" />Vista previa</h2><Badge tone="success">En vivo</Badge></div>
            <div className="flex justify-center gap-2" role="group" aria-label="Dispositivo de vista previa">
              {[false, true].map(v => <Button key={String(v)} variant="secondary" aria-pressed={computadora === v} className={cn(computadora === v && "border-selected-border bg-selected text-on-selected hover:bg-selected")} onClick={() => setComputadora(v)}>{v ? <span className="flex gap-2"><Monitor aria-hidden className="size-4" />Computadora</span> : <span className="flex gap-2"><Smartphone aria-hidden className="size-4" />Celular</span>}</Button>)}
            </div>
            <div className={cn("mx-auto max-h-[70dvh] w-full overflow-y-auto rounded-card border border-line-subtle bg-sunken", !computadora && "max-w-sm")}><TiendaPreview tienda={m.tienda} computadora={computadora} /></div>
          </Card>
        </aside>
      </div>
      <div className="fixed inset-x-0 bottom-0 z-20 flex flex-wrap items-center justify-end gap-3 border-t border-line-subtle bg-surface px-4 py-4 xl:static xl:rounded-card xl:border">
        <p role="status" className="basis-full text-caption text-fg-secondary sm:basis-auto sm:flex-1">{m.mensaje || (m.pendiente ? "Tienes cambios sin guardar." : "Todos los cambios están guardados.")}</p>
        <Button className="w-full xl:w-auto" loading={m.guardando} disabled={!m.pendiente || m.guardando} onClick={() => void m.guardar()}>Guardar cambios</Button>
      </div>
      <dialog ref={preview} aria-label="Vista previa de tu tienda" className="fixed inset-0 m-0 h-dvh max-h-dvh w-full max-w-none overflow-y-auto bg-page text-fg backdrop:bg-scrim">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-line-subtle bg-surface p-4"><Button variant="secondary" onClick={() => preview.current?.close()}>Volver</Button><Badge tone="success">En vivo</Badge></header>
        <div className="mx-auto max-w-2xl pb-32"><TiendaPreview tienda={m.tienda} /></div>
        <footer className="fixed inset-x-0 bottom-0 border-t border-line-subtle bg-surface p-4"><p role="status" className="mb-3 text-caption text-fg-secondary">{m.mensaje || "Así verán tu tienda tus clientes."}</p><Button block loading={m.guardando} disabled={m.guardando} onClick={async () => { if (await m.guardar()) preview.current?.close(); }}>Guardar cambios</Button></footer>
      </dialog>
      <SalidaSinGuardar abierto={salida.abierto} guardando={m.guardando} mensaje={m.mensaje} cerrar={salida.cerrar}
        descartar={() => { m.descartar(); salida.confirmar(); }} guardar={async () => { if (await m.guardar()) salida.confirmar(); }} />
    </>}
  </PanelMain>;
}
