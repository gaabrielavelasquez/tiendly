import { AtSign, Clock, MessageCircle } from "lucide-react";
import { Field } from "@/components/ui";
import type { Errores, Tienda } from "../types";
import { CampoImagen } from "./campo-imagen";
import { Seccion } from "./seccion";

export function CamposFree({ tienda, errores, cambiar }: { tienda: Tienda; errores: Errores; cambiar: <K extends keyof Tienda>(key: K, valor: Tienda[K]) => void }) {
  return <>
    <Seccion titulo="Tu marca" descripcion="Los detalles que hacen que tu tienda sea tuya.">
      <CampoImagen label="Logo" valor={tienda.logo} onChange={v => cambiar("logo", v)} />
      <CampoImagen label="Foto de portada" valor={tienda.portada} onChange={v => cambiar("portada", v)} />
      <Field label="Texto de bienvenida" value={tienda.bienvenida} maxLength={80} onChange={e => cambiar("bienvenida", e.target.value)}
        error={errores.bienvenida} hint={`${tienda.bienvenida.length}/80 caracteres.`} />
    </Seccion>
    <Seccion titulo="Contacto" descripcion="Ayuda a tus clientes a encontrarte y comprar con confianza.">
      <div className="flex items-start gap-3"><AtSign aria-hidden className="mt-7 size-5 shrink-0 text-accent-text" />
        <Field className="flex-1" label="Instagram" prefix="@" value={tienda.instagram} maxLength={30} onChange={e => cambiar("instagram", e.target.value)} error={errores.instagram} hint="Solo tu usuario, sin el enlace." />
      </div>
      <div className="flex items-start gap-3"><MessageCircle aria-hidden className="mt-7 size-5 shrink-0 text-success" />
        <Field className="flex-1" label="WhatsApp" prefix="+51" inputMode="numeric" value={tienda.whatsapp} maxLength={9} onChange={e => cambiar("whatsapp", e.target.value.replace(/\D/g, ""))} error={errores.whatsapp} hint="El número que verán tus clientes." />
      </div>
      <div className="flex items-start gap-3"><Clock aria-hidden className="mt-7 size-5 shrink-0 text-warning" />
        <Field className="flex-1" label="Horario de atención" value={tienda.horario} maxLength={160} onChange={e => cambiar("horario", e.target.value)} error={errores.horario} hint="Por ejemplo: lunes a sábado, de 9 a. m. a 6 p. m." />
      </div>
    </Seccion>
  </>;
}
