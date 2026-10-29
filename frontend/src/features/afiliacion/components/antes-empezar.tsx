import { Building2, CreditCard, UserRound } from "lucide-react";
import { Button } from "@/components/ui";
export function AntesEmpezar({ empezar, ayuda }: { empezar: () => void; ayuda: () => void }) {
  return <div className="flex flex-col gap-5">
    <div><h2 className="font-titulo-seccion text-h3">Antes de empezar</h2><p className="mt-2 text-body text-fg-secondary">Tus clientes podrán pagar con tarjeta o Yape sin salir de tu tienda.</p></div>
    <p className="text-body-sm text-fg-secondary">Ten a mano estos datos para completar los cuatro pasos.</p>
    <ul className="divide-y divide-line-subtle rounded-card bg-surface px-5 text-body-sm shadow-contenedor">
      {[{ Icon: Building2, titulo: "RUC activo y habido", texto: "De tu negocio o de la persona titular." }, { Icon: UserRound, titulo: "Datos del representante", texto: "DNI, celular y correo de contacto." }, { Icon: CreditCard, titulo: "Cuenta bancaria y CCI", texto: "A nombre del titular de tu RUC." }].map(({ Icon, titulo, texto }) =>
        <li key={titulo} className="flex gap-3 py-5"><span className="flex size-11 shrink-0 items-center justify-center "><Icon aria-hidden strokeWidth={1.5} className="size-5 text-icon" /></span><div><h3 className="font-semibold">{titulo}</h3><p className="mt-1 text-fg-secondary">{texto}</p></div></li>)}
    </ul>
    <p className="text-body-sm text-fg-secondary">Puedes seguir recibiendo Pedidos por WhatsApp durante la revisión. Tu borrador se conserva en esta pestaña.</p>
    <Button variant="ghost" className="self-start" onClick={ayuda}>No tengo RUC, ¿qué puedo hacer?</Button>
    <Button block onClick={empezar}>Empezar solicitud</Button>
  </div>;
}
