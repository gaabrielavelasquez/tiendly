import { Field } from "@/components/ui";
import type { ModeloAfiliacion } from "../hooks/use-afiliacion";
import { CARGOS } from "../lib/reglas";
import { CampoSelect } from "./campo-select";

/** A3 · Representante legal (Figma 106:111): nombre, DNI, cargo, celular y correo. */
export function PasoRepresentante({ m }: { m: ModeloAfiliacion }) {
  const autocompletado = m.negocio?.tipo === "persona" ? "Autocompletado con tu RUC. Puedes cambiarlo." : undefined;
  return <div className="flex flex-col gap-5">
    <div><h2 className="font-display-title text-h2">Representante legal</h2><p className="mt-2 text-body-sm text-fg-secondary">Si eres persona natural con negocio (RUC 10), eres tú. Si eres empresa (RUC 20), es quien figura en la partida registral.</p></div>
    <Field label="Nombre y apellido" autoComplete="name" value={m.datos.nombre} maxLength={120} error={m.errores.nombre} hint={autocompletado} onChange={e => m.cambiar("nombre", e.target.value)} />
    <Field label="DNI" inputMode="numeric" autoComplete="off" value={m.datos.dni} maxLength={8} error={m.errores.dni} hint="Tiene 8 dígitos." onChange={e => m.cambiar("dni", e.target.value.replace(/\D/g, ""))} />
    <CampoSelect label="Cargo" value={m.datos.cargo} placeholder="Elige tu cargo" opciones={CARGOS.map(c => ({ valor: c, texto: c }))} error={m.errores.cargo} onChange={v => m.cambiar("cargo", v)} />
    <Field label="Celular" prefix="+51" inputMode="numeric" autoComplete="tel-national" value={m.datos.celular} maxLength={9} error={m.errores.celular} hint="Te escribimos aquí sobre tu solicitud." onChange={e => m.cambiar("celular", e.target.value.replace(/\D/g, ""))} />
    <Field label="Correo" type="email" autoComplete="email" value={m.datos.correo} maxLength={120} error={m.errores.correo} hint="Aquí te llega la confirmación cuando esté aprobado." onChange={e => m.cambiar("correo", e.target.value.trim())} />
  </div>;
}
