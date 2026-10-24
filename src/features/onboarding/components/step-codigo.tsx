"use client";

import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui";
import { OtpInput } from "./otp-input";
import { TituloAcceso } from "./titulo-acceso";
import { useCodigo } from "../hooks/use-codigo";
import { useOnboarding } from "../hooks/use-onboarding";
import { formatear } from "../lib/phone";

export function StepCodigo() {
  const { state, set } = useOnboarding();
  const c = useCodigo();
  return <div className="flex flex-1 flex-col gap-6">
    <button type="button" disabled={c.verificando} aria-label="Volver" onClick={() => set({ paso: "registro" })} className="-ml-3 flex size-12 items-center justify-center rounded-button text-icon hover:bg-sunken disabled:opacity-50"><ChevronLeft aria-hidden strokeWidth={1.5} className="size-5" /></button>
    <TituloAcceso titulo="Escribe el código." contexto="Un paso más para entrar.">
      <p className="text-body text-fg-secondary">Te lo mandamos por WhatsApp al +51 {formatear(state.celular)}.</p>
      <button type="button" disabled={c.verificando} onClick={() => set({ paso: "registro" })} className="link-text inline-flex min-h-11 items-center self-start text-body-sm">Cambiar número</button>
    </TituloAcceso>
    <OtpInput value={c.codigo} onChange={c.setCodigo} error={!!c.error} disabled={c.verificando || c.vencido} />
    {c.error && <p id="codigo-error" role="alert" className="text-body-sm text-error">{c.error}</p>}
    <div aria-live="polite" className="flex flex-col gap-2 text-body-sm text-fg-secondary">
      {c.aviso && !c.error && <p>{c.aviso}</p>}
      {c.cuenta.restante > 0 && !c.vencido ? <p>Reenviar código en {c.cuenta.texto}.</p> : <button type="button" disabled={c.verificando} className="link-text inline-flex min-h-11 items-center self-start" onClick={c.reenviar}>Reenviar código</button>}
      <p>El código dura 5 minutos.</p>
    </div>
    <Button className="mt-auto lg:mt-0" block loading={c.verificando} disabled={c.verificando || c.vencido || c.codigo.length < 4} onClick={() => c.verificar()}>Verificar</Button>
  </div>;
}
