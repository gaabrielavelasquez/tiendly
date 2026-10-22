import { Check, LoaderCircle, Lock } from "lucide-react";
import { Button, Field } from "@/components/ui";
import type { ModeloAfiliacion } from "../hooks/use-afiliacion";
import { OPCIONES_RUBRO } from "../lib/reglas";
import { CampoSelect } from "./campo-select";

/** A2 · Tu negocio (Figma 106:59): RUC → SUNAT; después, nombre de la tienda, rubro y dirección fiscal (de SUNAT, bloqueada). */
export function PasoNegocio({ m, ayuda, whatsapp }: { m: ModeloAfiliacion; ayuda: () => void; whatsapp: () => void }) {
  const noHabido = m.negocio?.condicion === "no-habido";
  return <div className="flex flex-col gap-5">
    <div><h2 className="font-display-title text-h2">Tu negocio</h2><p className="mt-2 text-body-sm text-fg-secondary">Con tu RUC traemos tus datos de SUNAT. Solo completas lo que falta.</p></div>
    <div className="flex flex-col gap-2">
      <Field label="RUC" inputMode="numeric" autoComplete="off" value={m.datos.ruc} maxLength={11} disabled={m.buscando} onChange={e => m.cambiar("ruc", e.target.value.replace(/\D/g, ""))} error={m.errores.ruc} hint={m.negocio ? undefined : "Tiene 11 dígitos. Puede empezar con 10 o 20."} />
      {m.buscando && <p role="status" className="flex items-center gap-2 text-body-sm text-fg-secondary"><LoaderCircle aria-hidden className="size-5 motion-safe:animate-spin" />Buscando tu negocio en SUNAT…</p>}
      {m.negocio && <section aria-label="Resultado de SUNAT" className="flex gap-3 rounded-card border border-line-subtle bg-surface p-3">
        <span aria-hidden className={noHabido ? "w-0.5 shrink-0 rounded-full bg-warning" : "w-0.5 shrink-0 rounded-full bg-success"} />
        <div className="flex flex-col gap-1"><p className="text-body-sm font-semibold text-fg">{m.negocio.razonSocial}</p>
          <p className={noHabido ? "text-caption text-warning" : "flex items-center gap-1 text-caption text-success"}>{!noHabido && <Check aria-hidden className="size-4" />}{noHabido ? "No habido en SUNAT" : "Activo y habido en SUNAT"}</p></div>
      </section>}
    </div>
    {!m.negocio && <Button type="button" variant="ghost" className="self-start" onClick={ayuda}>Cómo sacar mi RUC</Button>}
    {noHabido && <div role="alert" className="space-y-3 rounded-card border border-warning-border bg-warning-surface p-4 text-body-sm text-warning">
      <p>SUNAT registra tu negocio como no habido. Regulariza esa condición para solicitar cobros automáticos. Mientras tanto, puedes seguir recibiendo Pedidos por WhatsApp.</p>
      <Button type="button" variant="secondary" className="lg:hidden" onClick={whatsapp}>Seguir con Pedidos por WhatsApp</Button>
    </div>}
    {m.negocio && !noHabido && <>
      <Field label="Nombre de tu tienda" value={m.datos.tienda} maxLength={60} error={m.errores.tienda} hint="Es el nombre que verán tus clientes. Puede ser tu marca, no tiene que ser la razón social." onChange={e => m.cambiar("tienda", e.target.value)} />
      <CampoSelect label="Rubro" value={m.datos.rubro} placeholder="Elige tu rubro" opciones={OPCIONES_RUBRO.map(r => ({ valor: r, texto: r }))} error={m.errores.rubro} onChange={v => m.cambiar("rubro", v)} />
      <div className="flex flex-col gap-1.5">
        <span className="text-body-sm font-semibold text-fg">Dirección fiscal</span>
        <p className="flex min-h-10 items-center gap-2 rounded-button bg-sunken px-3 py-2 text-body text-fg-secondary"><Lock aria-hidden className="size-4 shrink-0" /><span>{m.negocio.direccion}</span></p>
        <p className="text-caption text-fg-secondary">Viene de SUNAT. Si cambió, actualízala allá.</p>
      </div>
    </>}
  </div>;
}
