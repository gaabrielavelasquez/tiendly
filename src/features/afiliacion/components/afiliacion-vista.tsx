"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CloudOff } from "lucide-react";
import { PanelMain } from "@/components/panel";
import { Button, Card, EmptyState } from "@/components/ui";
import { STORAGE } from "../lib/borrador";
import { cn } from "@/lib/cn";
import type { RubroId } from "@/features/onboarding/lib/rubros";
import { useAfiliacion } from "../hooks/use-afiliacion";
import { AfiliacionDialogos, type Dialogo } from "./afiliacion-dialogos";
import { AfiliacionSkeleton } from "./afiliacion-skeleton";
import { AntesEmpezar } from "./antes-empezar";
import { EstadoSolicitud } from "./estado-solicitud";
import { PasoCuenta } from "./paso-cuenta";
import { PasoNegocio } from "./paso-negocio";
import { PasoRepresentante } from "./paso-representante";
import { PasoRevision } from "./paso-revision";
import { SolicitudEnviada } from "./solicitud-enviada";
import { Stepper } from "./stepper";

export function AfiliacionVista({ escenario, soporte, rubros, tienda }: { escenario?: string; soporte?: string; rubros: RubroId[]; tienda: string }) {
  const m = useAfiliacion(escenario, rubros, tienda);
  const router = useRouter();
  const [dialogo, setDialogo] = useState<Dialogo>(null);
  const [errorSalir, setErrorSalir] = useState("");
  const destino = useRef("/panel/configuracion");
  const card = useRef<HTMLDivElement>(null);
  const enFormulario = m.paso >= 1 && m.paso <= 4;
  const ocupado = m.buscando || m.enviando;
  useEffect(() => {
    if (!enFormulario) return;
    function interceptar(e: MouseEvent) {
      const link = e.target instanceof Element ? e.target.closest("a") : null;
      if (!link || link.target === "_blank" || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      const url = new URL(link.href, location.href);
      if (url.origin !== location.origin || url.href === location.href || url.hash) return;
      e.preventDefault(); e.stopPropagation();
      if (!ocupado) { destino.current = url.pathname + url.search; setDialogo("salir"); }
    }
    document.addEventListener("click", interceptar, true);
    return () => document.removeEventListener("click", interceptar, true);
  }, [enFormulario, ocupado]);
  useEffect(() => {
    const primerError = card.current?.querySelector<HTMLElement>('[aria-invalid="true"]');
    primerError?.focus();
  }, [m.errores]);
  useEffect(() => {
    const titulo = card.current?.querySelector("h2");
    if (titulo) { titulo.setAttribute("tabindex", "-1"); titulo.focus({ preventScroll: true }); }
    if (enFormulario) card.current?.scrollIntoView({ block: "start", behavior: "instant" });
  }, [m.paso, enFormulario]);
  function salir(href = destino.current) {
    try {
      sessionStorage.setItem(STORAGE, JSON.stringify({ datos: m.datos, negocio: m.negocio, paso: m.paso, solicitud: m.solicitud }));
      setDialogo(null); router.push(href);
    } catch { setErrorSalir("No pudimos guardar tu borrador. Conserva esta pantalla abierta e inténtalo de nuevo."); }
  }
  function volver() {
    if (m.paso === 1) { destino.current = "/panel/configuracion"; setDialogo("salir"); }
    else m.ir(m.paso - 1);
  }
  const rucBloqueado = m.paso === 1 && m.negocio?.condicion === "no-habido";
  return <PanelMain className="pb-32 lg:pb-16">
    <nav aria-label="Ruta" className="flex flex-wrap gap-2 text-caption text-fg-secondary"><Link className="link-text flex min-h-11 items-center" href="/panel/configuracion">Configuración</Link><span className="self-center">/</span><span className="self-center">Cobros automáticos</span></nav>
    <header className={cn("w-full", m.paso === 6 ? "max-w-180" : "mx-auto max-w-160")}><h1 className="font-display-title text-h1 text-fg">{m.paso === 6 ? "Métodos de pago" : "Cobros automáticos"}</h1><p className="mt-2 text-body text-fg-secondary">{m.paso === 6 ? "Sigue el estado de tus cobros automáticos." : "Tarjeta y Yape en tu tienda, con una solicitud guiada."}</p></header>
    <p className={cn("w-full rounded-button border border-info-border bg-info-surface p-3 text-caption text-info", m.paso === 6 ? "max-w-180" : "mx-auto max-w-160")}>Modo de prueba. Usa datos ficticios: no se consultan servicios externos ni se envían mensajes o confirmaciones.</p>
    {m.estado === "cargando" ? <AfiliacionSkeleton /> : m.estado === "error" ? <Card className="mx-auto w-full max-w-2xl"><EmptyState icon={CloudOff} title="No pudimos cargar tu solicitud" description="El borrador no se pudo leer. Puedes empezar una solicitud nueva con datos de prueba." action={<Button onClick={m.reiniciar}>Empezar de nuevo</Button>} /></Card> :
      <div ref={card} className={cn("w-full scroll-mt-20", m.paso === 6 ? "max-w-180" : "mx-auto max-w-160")}>
        <Card className="flex flex-col gap-6 p-5 lg:p-8">
          {enFormulario && <Stepper paso={m.paso} />}
          {m.paso === 0 && <AntesEmpezar empezar={() => m.ir(1)} ayuda={() => setDialogo("ayuda")} />}
          {enFormulario && <form noValidate onSubmit={e => { e.preventDefault(); if (!ocupado) void (m.paso === 4 ? m.enviar() : m.continuar()); }} className="flex flex-col gap-6">
            {Object.values(m.errores).some(Boolean) && <p role="alert" className="rounded-button border border-error-border bg-error-surface p-3 text-body-sm text-error">Revisa los campos marcados para continuar.</p>}
            <fieldset disabled={m.enviando} className="min-w-0">
              {m.paso === 1 && <PasoNegocio m={m} ayuda={() => setDialogo("ayuda")} whatsapp={() => salir("/panel")} />}
              {m.paso === 2 && <PasoRepresentante m={m} />}
              {m.paso === 3 && <PasoCuenta m={m} />}
              {m.paso === 4 && <PasoRevision m={m} terminos={() => setDialogo("terminos")} />}
            </fieldset>
            {m.mensaje && <p role="alert" className="text-body-sm text-error">{m.mensaje}</p>}
            <div className="fixed inset-x-0 bottom-0 z-20 flex items-center justify-end gap-3 border-t border-line-subtle bg-surface p-4 lg:static lg:border-0 lg:p-0">
              <Button type="button" variant="secondary" disabled={ocupado} onClick={volver}>Volver</Button>
              {rucBloqueado && <Button type="button" variant="secondary" className="hidden lg:inline-flex" onClick={() => salir("/panel")}>Seguir con Pedidos por WhatsApp</Button>}
              <Button type="submit" loading={ocupado} disabled={ocupado || rucBloqueado || (m.paso === 4 && !m.acepto)}>{m.enviando ? "Enviando solicitud…" : m.buscando ? "Buscando…" : m.paso === 4 ? "Enviar solicitud" : m.paso === 1 && !m.negocio ? "Buscar negocio" : "Continuar"}</Button>
            </div>
          </form>}
          {m.paso === 5 && m.solicitud && <SolicitudEnviada solicitud={m.solicitud} verDetalle={() => m.ir(6)} />}
          {m.paso === 6 && m.solicitud && <EstadoSolicitud solicitud={m.solicitud} detalle={() => setDialogo("detalle")} corregir={() => m.editar(3)} soporte={soporte} />}
        </Card>
      </div>}
    {!enFormulario && m.mensaje && <p role="alert" className="text-body-sm text-error">{m.mensaje}</p>}
    <AfiliacionDialogos dialogo={dialogo} cerrar={() => { setDialogo(null); setErrorSalir(""); }} salir={() => salir()} m={m} errorSalir={errorSalir} />
  </PanelMain>;
}
