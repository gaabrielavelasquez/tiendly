import { Check, Clock, MessageCircle, TriangleAlert } from "lucide-react";
import { Badge, Button } from "@/components/ui";
import { BANCOS } from "../lib/reglas";
import type { Solicitud } from "../types";

const fecha = (valor: string) => new Intl.DateTimeFormat("es-PE", { dateStyle: "medium", timeZone: "America/Lima" }).format(new Date(valor));
export function EstadoSolicitud({ solicitud: s, detalle, corregir, soporte }: { solicitud: Solicitud; detalle: () => void; corregir: () => void; soporte?: string }) {
  const observada = s.estado === "observada";
  const aprobada = s.estado === "aprobada";
  const titulo = observada ? "Solicitud observada" : aprobada ? "Cobros automáticos aprobados" : "Tu solicitud está en revisión";
  const Icon = observada ? TriangleAlert : aprobada ? Check : Clock;
  return <div className="flex min-w-0 flex-col gap-10 lg:gap-12">
    <Icon aria-hidden className={observada ? "size-10 text-warning" : aprobada ? "size-10 text-icon" : "size-10 text-icon"} />
    <div><h2 className="font-display-light text-h2">{titulo}</h2><p className="mt-2 text-body-sm text-fg-secondary">{observada ? "No pudimos validar el CCI de tu cuenta bancaria. Corrígelo para continuar, sin repetir los otros pasos." : aprobada ? "Tu afiliación de demostración fue aprobada. Los cobros reales se activarán cuando se integre el proveedor de pagos." : "Revisaremos los datos de tu negocio y tu cuenta. Mientras tanto, sigue recibiendo Pedidos por WhatsApp."}</p></div>
    <Badge className="self-start" tone={observada ? "warning" : aprobada ? "success" : "neutral"}>{s.numero}</Badge>
    <ol className="divide-y divide-line-subtle rounded-card bg-surface px-5 text-body-sm shadow-contenedor [&>li]:py-4">
      <li><p className="font-semibold">Solicitud recibida</p><p className="mt-1 text-fg-secondary">{fecha(s.enviada)}.</p></li>
      <li aria-current={!aprobada ? "step" : undefined}><p className="font-semibold">{observada ? "Necesitamos una corrección" : "Revisión de datos"}</p><p className="mt-1 text-fg-secondary">{observada ? "El CCI no pudo ser validado." : `Respuesta estimada: ${fecha(s.respuesta)}.`}</p></li>
      <li><p className={aprobada ? "font-semibold text-success" : "text-fg-secondary"}>{aprobada ? "Cobros aprobados" : "Activación de cobros"}</p></li>
    </ol>
    <section className="flex min-w-0 flex-col gap-3 text-body-sm"><h3 className="font-titulo-seccion text-h3">Datos enviados</h3><div className="min-w-0 space-y-3 break-words rounded-card bg-surface p-5 shadow-contenedor"><p className="text-fg-secondary">{s.negocio.razonSocial}</p><p className="text-fg-secondary">RUC {s.datos.ruc}</p><p className="text-fg-secondary">{BANCOS.find(b => b.id === s.datos.banco)?.nombre} · CCI termina en {s.datos.cci.slice(-4)}.</p><Button variant="ghost" onClick={detalle}>Ver solicitud</Button></div></section>
    {observada && <Button onClick={corregir}>Corregir CCI</Button>}
    {soporte ? <a href={`https://wa.me/${soporte}?text=${encodeURIComponent(`Hola, quiero consultar mi solicitud ${s.numero}.`)}`} target="_blank" rel="noreferrer" className="link-text flex min-h-12 items-center justify-center gap-2 text-body-sm"><MessageCircle aria-hidden className="size-5" />Escribir a Tiendly</a>
      : <div><Button variant="secondary" block disabled>Escribir a Tiendly</Button><p className="mt-2 text-caption text-fg-secondary">El canal de soporte por WhatsApp aún no está disponible.</p></div>}
  </div>;
}
