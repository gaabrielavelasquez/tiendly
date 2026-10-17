import { CheckCircle, LoaderCircle } from "lucide-react";
import { Badge, Button, Field } from "@/components/ui";
import type { ModeloAfiliacion } from "../hooks/use-afiliacion";

export function PasoNegocio({ m, ayuda, whatsapp }: { m: ModeloAfiliacion; ayuda: () => void; whatsapp: () => void }) {
  const noHabido = m.negocio?.condicion === "no-habido";
  return <div className="flex flex-col gap-5">
    <div><h2 className="font-display-title text-h2">Tu negocio</h2><p className="mt-2 text-body-sm text-fg-secondary">Buscaremos los datos de tu negocio con el RUC.</p></div>
    <Field label="RUC" inputMode="numeric" autoComplete="off" value={m.datos.ruc} maxLength={11} disabled={m.buscando} onChange={e => m.cambiar("ruc", e.target.value.replace(/\D/g, ""))} error={m.errores.ruc} hint="Tiene 11 dígitos. Puede empezar con 10 o 20." />
    <Button type="button" variant="ghost" className="self-start" onClick={ayuda}>Cómo sacar mi RUC</Button>
    {m.buscando && <p role="status" className="flex items-center gap-2 text-body-sm text-fg-secondary"><LoaderCircle aria-hidden className="size-5 motion-safe:animate-spin" />Buscando tu negocio en SUNAT...</p>}
    {m.negocio && <section className="flex flex-col gap-3 rounded-card border border-line-subtle bg-sunken p-4">
      <h3 className="font-semibold text-fg">{m.negocio.razonSocial}</h3><p className="text-body-sm text-fg-secondary">{m.negocio.direccion}.</p>
      <Badge className="self-start" tone={noHabido ? "warning" : "success"}>{noHabido ? "No habido" : <span className="flex items-center gap-1"><CheckCircle aria-hidden className="size-4" />Activo y habido</span>}</Badge>
    </section>}
    {noHabido && <div role="alert" className="space-y-3 rounded-card border border-warning-border bg-warning-surface p-4 text-body-sm text-warning">
      <p>SUNAT registra tu negocio como no habido. Regulariza esa condición para solicitar cobros automáticos. Mientras tanto, puedes seguir recibiendo Pedidos por WhatsApp.</p>
      <Button type="button" variant="secondary" className="lg:hidden" onClick={whatsapp}>Seguir con Pedidos por WhatsApp</Button>
    </div>}
  </div>;
}
