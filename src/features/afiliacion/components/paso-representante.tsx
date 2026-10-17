import { Field } from "@/components/ui";
import type { ModeloAfiliacion } from "../hooks/use-afiliacion";
export function PasoRepresentante({ m }: { m: ModeloAfiliacion }) {
  return <div className="flex flex-col gap-5">
    <div><h2 className="font-display-title text-h2">Representante legal</h2><p className="mt-2 text-body-sm text-fg-secondary">Si tu RUC empieza con 10, completa tus datos. Si empieza con 20, los de quien representa legalmente al negocio. Puedes editar los datos autocompletados.</p></div>
    <Field label="Nombres y apellidos" autoComplete="name" value={m.datos.nombre} maxLength={120} error={m.errores.nombre} onChange={e => m.cambiar("nombre", e.target.value)} />
    <Field label="DNI" inputMode="numeric" autoComplete="off" value={m.datos.dni} maxLength={8} error={m.errores.dni} hint="Tiene 8 dígitos." onChange={e => m.cambiar("dni", e.target.value.replace(/\D/g, ""))} />
    <Field label="Celular" prefix="+51" inputMode="numeric" autoComplete="tel-national" value={m.datos.celular} maxLength={9} error={m.errores.celular} hint="Empieza con 9 y tiene 9 dígitos." onChange={e => m.cambiar("celular", e.target.value.replace(/\D/g, ""))} />
    <Field label="Correo electrónico" type="email" autoComplete="email" value={m.datos.correo} maxLength={120} error={m.errores.correo} hint="Aquí recibirás novedades de tu solicitud." onChange={e => m.cambiar("correo", e.target.value.trim())} />
  </div>;
}
