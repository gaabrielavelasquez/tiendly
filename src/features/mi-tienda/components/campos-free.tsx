import { AtSign, Clock, MessageCircle } from "lucide-react";
import { Field } from "@/components/ui";
import type { Errores, Tienda } from "../types";
import { CampoImagen } from "./campo-imagen";
import { Seccion } from "./seccion";

export function CamposFree({ tienda, errores, cambiar }: { tienda: Tienda; errores: Errores; cambiar: <K extends keyof Tienda>(key: K, valor: Tienda[K]) => void }) {
  return <>
    <Seccion titulo="Identidad">
      <div className="divide-y divide-line-subtle [&>div]:py-5 [&>div:first-child]:pt-0 [&>div:last-child]:pb-0">
      <CampoImagen label="Logo" ayuda="Cuadrado, JPG, PNG o WebP. Hasta 1 MB." valor={tienda.logo} onChange={v => cambiar("logo", v)} />
      <CampoImagen label="Foto de portada" ayuda="Horizontal, JPG, PNG o WebP. Hasta 1 MB." valor={tienda.portada} onChange={v => cambiar("portada", v)} />
      <Field label="Texto de bienvenida" value={tienda.bienvenida} maxLength={80} onChange={e => cambiar("bienvenida", e.target.value)}
        error={errores.bienvenida} hint={`${tienda.bienvenida.length}/80 caracteres. Se ve debajo de tu logo.`} />
      </div>
    </Seccion>
    <Seccion titulo="Contacto y atención">
      <div className="divide-y divide-line-subtle">
      <div className="flex min-w-0 items-start gap-3 py-5 first:pt-0 last:pb-0"><span className="mt-8 shrink-0 text-icon"><AtSign aria-hidden strokeWidth={1.5} className="size-5" /></span>
        <Field className="min-w-0 flex-1" label="Instagram" prefix="@" value={tienda.instagram} maxLength={30} onChange={e => cambiar("instagram", e.target.value)} error={errores.instagram} hint="Solo tu usuario, sin el enlace." />
      </div>
      <div className="flex min-w-0 items-start gap-3 py-5 first:pt-0 last:pb-0"><span className="mt-8 shrink-0 text-icon"><MessageCircle aria-hidden strokeWidth={1.5} className="size-5" /></span>
        <Field className="min-w-0 flex-1" label="WhatsApp" prefix="+51" prefixFijo inputMode="numeric" value={tienda.whatsapp} maxLength={9} onChange={e => cambiar("whatsapp", e.target.value.replace(/\D/g, ""))} error={errores.whatsapp} hint="Es el número al que llegan los pedidos. Se usa en tu tienda y en Métodos de pago." />
      </div>
      <div className="flex min-w-0 items-start gap-3 py-5 first:pt-0 last:pb-0"><span className="mt-8 shrink-0 text-icon"><Clock aria-hidden strokeWidth={1.5} className="size-5" /></span>
        <Field className="min-w-0 flex-1" label="Horario de atención" value={tienda.horario} maxLength={160} onChange={e => cambiar("horario", e.target.value)} error={errores.horario} hint="Por ejemplo: lunes a sábado, de 9 a. m. a 6 p. m." />
      </div>
      </div>
    </Seccion>
  </>;
}
