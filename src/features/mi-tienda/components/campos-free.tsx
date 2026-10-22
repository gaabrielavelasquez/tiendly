import { AtSign, Clock, MessageCircle } from "lucide-react";
import { Field } from "@/components/ui";
import type { Errores, Tienda } from "../types";
import { CampoImagen } from "./campo-imagen";
import { Seccion } from "./seccion";

export function CamposFree({ tienda, errores, cambiar }: { tienda: Tienda; errores: Errores; cambiar: <K extends keyof Tienda>(key: K, valor: Tienda[K]) => void }) {
  return <>
    <Seccion titulo="Identidad">
      <CampoImagen label="Logo" ayuda="PNG o JPG cuadrado." valor={tienda.logo} onChange={v => cambiar("logo", v)} />
      <CampoImagen label="Foto de portada" ayuda="Para lanzamientos o promos." valor={tienda.portada} onChange={v => cambiar("portada", v)} />
      <Field label="Texto de bienvenida" value={tienda.bienvenida} maxLength={80} onChange={e => cambiar("bienvenida", e.target.value)}
        error={errores.bienvenida} hint={`${tienda.bienvenida.length}/80 caracteres. Se ve debajo de tu logo.`} />
    </Seccion>
    <Seccion titulo="Contacto y atención">
      <div className="flex items-start gap-3"><span className="mt-7 flex size-10 shrink-0 items-center justify-center rounded-button bg-accent-subtle"><AtSign aria-hidden className="size-5 text-accent-text" /></span>
        <Field className="flex-1" label="Instagram" prefix="@" value={tienda.instagram} maxLength={30} onChange={e => cambiar("instagram", e.target.value)} error={errores.instagram} hint="Solo tu usuario, sin el enlace." />
      </div>
      <div className="flex items-start gap-3"><span className="mt-7 flex size-10 shrink-0 items-center justify-center rounded-button bg-success-surface"><MessageCircle aria-hidden className="size-5 text-success" /></span>
        <Field className="flex-1" label="WhatsApp" prefix="+51" inputMode="numeric" value={tienda.whatsapp} maxLength={9} onChange={e => cambiar("whatsapp", e.target.value.replace(/\D/g, ""))} error={errores.whatsapp} hint="Es el número al que llegan los pedidos." />
      </div>
      <div className="flex items-start gap-3"><span className="mt-7 flex size-10 shrink-0 items-center justify-center rounded-button bg-info-surface"><Clock aria-hidden className="size-5 text-info" /></span>
        <Field className="flex-1" label="Horario de atención" value={tienda.horario} maxLength={160} onChange={e => cambiar("horario", e.target.value)} error={errores.horario} hint="Por ejemplo: lunes a sábado, de 9 a. m. a 6 p. m." />
      </div>
    </Seccion>
  </>;
}
