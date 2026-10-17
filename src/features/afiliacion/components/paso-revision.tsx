import { useId } from "react";
import { Button } from "@/components/ui";
import type { ModeloAfiliacion } from "../hooks/use-afiliacion";
import { ResumenSolicitud } from "./resumen-solicitud";

export function PasoRevision({ m, terminos }: { m: ModeloAfiliacion; terminos: () => void }) {
  const id = useId();
  return <div className="flex flex-col gap-5">
    <div><h2 className="font-display-title text-h2">Revisa y envía</h2><p className="mt-2 text-body-sm text-fg-secondary">Confirma que todo esté correcto antes de enviar tu solicitud.</p></div>
    {m.negocio && <ResumenSolicitud datos={m.datos} negocio={m.negocio} editar={m.enviando ? undefined : m.editar} />}
    <section className="space-y-3 rounded-card border border-line-subtle bg-sunken p-4">
      <h3 className="font-semibold">Comisiones de tus cobros</h3>
      <dl className="space-y-2 text-body-sm text-fg-secondary">
        <div className="flex justify-between gap-4"><dt>Proveedor de pagos</dt><dd>Por confirmar</dd></div>
        <div className="flex justify-between gap-4"><dt>Tiendly</dt><dd>Por confirmar</dd></div>
        <div className="flex justify-between gap-4 border-t border-line-subtle pt-2 font-semibold text-fg"><dt>Total por venta</dt><dd>Por confirmar</dd></div>
      </dl><p className="text-caption text-fg-secondary">Antes de activar cobros, recibirás las condiciones y el desglose final. Enviar esta solicitud no realiza ningún cobro.</p>
    </section>
    <label htmlFor={id} className="flex min-h-12 cursor-pointer items-start gap-3 text-body-sm text-fg">
      <input id={id} type="checkbox" checked={m.acepto} disabled={m.enviando} onChange={e => m.setAcepto(e.target.checked)} style={{ accentColor: "var(--tl-selection-bg)" }} className="mt-1 size-5 shrink-0" />
      <span>Acepto los términos de afiliación y autorizo la revisión de los datos de mi solicitud.</span>
    </label>
    <Button type="button" variant="ghost" className="self-start" disabled={m.enviando} onClick={terminos}>Leer términos de afiliación</Button>
    {!m.acepto && <p className="text-caption text-fg-secondary">Acepta los términos para enviar la solicitud.</p>}
    {m.enviando && <p role="status" className="text-body-sm text-fg-secondary">Enviando solicitud... No cierres esta pantalla.</p>}
  </div>;
}
