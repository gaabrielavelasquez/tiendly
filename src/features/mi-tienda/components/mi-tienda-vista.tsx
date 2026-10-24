"use client";
import { useRef, useState } from "react";
import { CloudOff, Monitor, Smartphone, X } from "lucide-react";
import { CONTENEDOR, EncabezadoSeccion, PanelMain, useOcultarBarraInferior, ZonaUsuario } from "@/components/panel";
import { Button, EmptyState } from "@/components/ui";
import type { Tienda } from "../types";
import { cn } from "@/lib/cn";
import { ACENTOS, TEMAS } from "../lib/config";
import { useMiTienda } from "../hooks/use-mi-tienda";
import { useSalidaSinGuardar } from "../hooks/use-salida-sin-guardar";
import { Apariencia } from "./apariencia";
import { CamposFree } from "./campos-free";
import { MiTiendaSkeleton } from "./mi-tienda-skeleton";
import { ProBloqueado } from "./pro-bloqueado";
import { SeccionOfertas } from "./seccion-ofertas";
import { TiendaPreview, type Muestra } from "./tienda-preview";
import { SalidaSinGuardar } from "./salida-sin-guardar";

/** `tienda`: la de la sesión (nombre y slug); una tienda nueva arranca sin la portada ni los textos de Heather. */
export function MiTiendaVista({ escenario, inicial, plan, tienda }: { escenario?: string; inicial: Tienda; plan: "free" | "pro"; tienda: { nombre: string; slug: string; muestras: Muestra[]; muestrasTema: Muestra[]; muestrasEjemplo: boolean; nombreOfertas: string; categorias: string[] } }) {
  const m = useMiTienda(escenario, inicial);
  const salida = useSalidaSinGuardar(m.pendiente, m.guardando);
  // Con cambios sin guardar, la barra de guardar reemplaza a la de pestañas en móvil (antes la tapaba y no se podía guardar).
  useOcultarBarraInferior(m.pendiente);
  const [computadora, setComputadora] = useState(false);
  const preview = useRef<HTMLDialogElement>(null);
  // Figma MT2 / MTD1: la vista previa dice qué tema y acento muestra («Editorial · Terracota»).
  const combinacion = `${TEMAS.find(t => t.id === m.tienda.tema)?.nombre ?? ""} · ${ACENTOS.find(a => a.id === m.tienda.acento)?.nombre ?? ""}`;
  const guardar = (clase: string) => <Button className={clase} loading={m.guardando} disabled={!m.pendiente || m.guardando} onClick={() => void m.guardar()}>Guardar cambios</Button>;
  return <PanelMain className="gap-10 pb-28 lg:gap-12 lg:pb-12">
    {/* Figma MTD1: «Guardar cambios» arriba a la derecha en desktop; en móvil va en la barra de abajo (MT1). */}
    <header className="flex flex-wrap items-start justify-between gap-4">
      <div><h1 className="font-display-light text-h1 tracking-tight text-fg">Mi tienda</h1><p className="mt-1 text-body text-fg-secondary">Así ven tu tienda tus clientes. Los cambios se publican cuando tocas Guardar.</p></div>
      {m.estado === "lista" && <div className="hidden items-center gap-4 xl:flex"><div className="flex flex-col items-end gap-1">{guardar("")}<p role="status" className="text-caption text-fg-secondary">{m.mensaje || (m.pendiente ? "Tienes cambios sin guardar." : "Todos los cambios están guardados.")}</p></div><ZonaUsuario /></div>}
    </header>
    {m.estado === "cargando" ? <MiTiendaSkeleton /> : m.estado === "error" ? <div className={CONTENEDOR}><EmptyState simple icon={CloudOff} title="No pudimos cargar tu tienda" description="Revisa tu conexión o los datos guardados e inténtalo de nuevo." action={<Button onClick={m.cargar}>Reintentar</Button>} /></div> : <>
      {escenario === "vacio" && <p className="text-body-sm text-fg-secondary">Tu tienda está lista para personalizar. Elige un tema y agrega tu marca.</p>}
      <div className="grid min-w-0 items-start gap-10 xl:grid-cols-2 xl:gap-12">
        <div className="flex min-w-0 flex-col gap-10 lg:gap-12">
          <Apariencia tienda={m.tienda} nombre={tienda.nombre} muestras={tienda.muestrasTema} muestrasEjemplo={tienda.muestrasEjemplo} cambiar={m.cambiar} vistaPrevia={() => preview.current?.showModal()} />
          <CamposFree tienda={m.tienda} errores={m.errores} cambiar={m.cambiar} />
          <SeccionOfertas tienda={m.tienda} errores={m.errores} cambiar={m.cambiar} categorias={tienda.categorias} />
          <ProBloqueado plan={plan} />
        </div>
        <aside className="sticky top-6 hidden min-w-0 xl:block" aria-label="Vista previa en vivo">
          <section aria-labelledby="preview-tienda" className="flex min-w-0 flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div><EncabezadoSeccion id="preview-tienda" titulo="Vista previa en vivo" /><p className="text-caption text-fg-secondary">{combinacion}</p></div>
              <div className="flex gap-2" role="group" aria-label="Dispositivo de vista previa">
              {[false, true].map(v => <Button key={String(v)} variant="secondary" aria-pressed={computadora === v} className={cn(computadora === v && "border-selected-border bg-selected text-on-selected hover:bg-selected")} onClick={() => setComputadora(v)}>{v ? <span className="flex gap-2"><Monitor aria-hidden className="size-4" />Computadora</span> : <span className="flex gap-2"><Smartphone aria-hidden className="size-4" />Celular</span>}</Button>)}
              </div>
            </div>
            <p className="text-caption text-fg-secondary">Los cambios se ven al instante en esta vista previa.</p>
            <div className={cn("mx-auto max-h-[70dvh] w-full overflow-y-auto rounded-card bg-surface shadow-contenedor", !computadora && "max-w-sm")}><TiendaPreview tienda={m.tienda} nombre={tienda.nombre} muestras={tienda.muestras} computadora={computadora} /></div>
          </section>
        </aside>
      </div>
      {m.pendiente && <div className="fixed inset-x-0 bottom-0 z-20 flex flex-wrap items-center justify-end gap-3 border-t border-line-subtle bg-surface px-4 pt-3 pb-[max(env(safe-area-inset-bottom),--spacing(3))] xl:hidden">
        <p role="status" className="basis-full text-caption text-fg-secondary sm:basis-auto sm:flex-1">{m.mensaje || (m.pendiente ? "Tienes cambios sin guardar." : "Todos los cambios están guardados.")}</p>
        {guardar("w-full sm:w-auto")}
      </div>}
      {!m.pendiente && <p role="status" className="text-body-sm text-fg-secondary xl:hidden">{m.mensaje || "Todos los cambios están guardados."}</p>}
      <dialog ref={preview} aria-label="Vista previa de tu tienda" className="fixed inset-0 m-0 h-dvh max-h-dvh w-full max-w-none overflow-y-auto bg-page text-fg backdrop:bg-scrim">
        {/* Figma MT2: «Vista previa» con tema · acento, y X para cerrar. */}
        <header className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-line-subtle bg-surface py-2 pr-2 pl-4">
          <div><p className="text-body-sm font-semibold text-fg">Vista previa</p><p className="text-caption text-fg-secondary">{combinacion}</p></div>
          <button type="button" aria-label="Cerrar vista previa" onClick={() => preview.current?.close()} className="flex size-11 items-center justify-center rounded-button text-icon hover:bg-sunken"><X aria-hidden className="size-5" /></button>
        </header>
        <div className="mx-auto max-w-2xl pb-32"><TiendaPreview tienda={m.tienda} nombre={tienda.nombre} muestras={tienda.muestras} /></div>
        <footer className="fixed inset-x-0 bottom-0 border-t border-line-subtle bg-surface p-4"><p role="status" className="mb-3 text-caption text-fg-secondary">{m.mensaje || "Así verán tu tienda tus clientes."}</p><Button block loading={m.guardando} disabled={m.guardando} onClick={async () => { if (await m.guardar()) preview.current?.close(); }}>Guardar cambios</Button></footer>
      </dialog>
      <SalidaSinGuardar abierto={salida.abierto} guardando={m.guardando} mensaje={m.mensaje} cerrar={salida.cerrar}
        descartar={() => { m.descartar(); salida.confirmar(); }} guardar={async () => { if (await m.guardar()) salida.confirmar(); }} />
    </>}
  </PanelMain>;
}
