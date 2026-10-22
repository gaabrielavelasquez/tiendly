import { Check, MessageCircle } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { Solicitud } from "../types";

const PASOS = [
  { titulo: "Solicitud enviada", detalle: "Hoy", estado: "hecho" },
  { titulo: "En revisión", detalle: "De 3 a 10 días hábiles", estado: "actual" },
  { titulo: "Cobros automáticos activos", detalle: "Tarjeta y Yape aparecen en tu tienda", estado: "pendiente" },
] as const;

/**
 * A6 · Solicitud enviada (Figma 106:259): confirmación, seguimiento en tres etapas (indicator/*, sin
 * cobalto), WhatsApp sigue activo y «Volver al panel» (lleva a Pagos, donde se ve «En revisión», A7).
 */
export function SolicitudEnviada({ solicitud: s, verDetalle }: { solicitud: Solicitud; verDetalle: () => void }) {
  const nombre = s.datos.nombre.trim().split(/\s+/)[0];
  return <div className="flex flex-col items-center gap-6 text-center">
    <span aria-hidden className="flex size-16 items-center justify-center rounded-full bg-success-surface text-success"><Check strokeWidth={2.4} className="size-8" /></span>
    <div className="flex flex-col gap-2">
      <h2 className="font-display-title text-h2 text-fg">¡Listo, {nombre}! Solicitud enviada</h2>
      <p className="text-body-sm text-fg-secondary">El proveedor de pagos revisa tus datos en 3 a 10 días hábiles. Te avisaremos a {s.datos.correo} y al {s.datos.celular.replace(/(\d{3})(?=\d)/g, "$1 ")}.</p>
    </div>
    <ol aria-label="Seguimiento de tu solicitud" className="flex w-full flex-col rounded-card border border-line-subtle bg-surface p-4 text-left">
      {PASOS.map((p, i) => (
        <li key={p.titulo} aria-current={p.estado === "actual" ? "step" : undefined} className="relative flex gap-3 pb-5 last:pb-0">
          {i < PASOS.length - 1 && <span aria-hidden className={cn("absolute top-6 left-2.75 h-full w-0.5", p.estado === "hecho" ? "bg-indicator" : "bg-line")} />}
          <span aria-hidden className={cn("relative flex size-6 shrink-0 items-center justify-center rounded-full border-2", p.estado === "hecho" ? "border-indicator bg-indicator text-fg-inverse" : p.estado === "actual" ? "border-indicator bg-surface" : "border-line bg-sunken")}>
            {p.estado === "hecho" && <Check strokeWidth={3} className="size-3.5" />}
          </span>
          <span className="flex flex-col gap-0.5">
            <span className={cn("text-body-sm font-semibold", p.estado === "pendiente" ? "text-fg-secondary" : "text-fg")}>{p.titulo}</span>
            <span className="text-caption text-fg-secondary">{p.detalle}</span>
          </span>
        </li>
      ))}
    </ol>
    <p className="flex w-full items-start gap-3 rounded-card bg-sunken p-4 text-left text-body-sm text-fg-secondary"><MessageCircle aria-hidden className="mt-0.5 size-5 shrink-0 text-icon" />Mientras tanto, tu tienda sigue recibiendo pedidos por WhatsApp.</p>
    <p className="text-caption text-fg-secondary">Solicitud {s.numero}. En esta demo no se enviaron mensajes ni confirmaciones.</p>
    <div className="flex w-full flex-col gap-2">
      <Link href="/panel/configuracion/pagos" className={cn(buttonVariants({ block: true }), "h-12 active:scale-[0.98]")}>Volver al panel</Link>
      <button type="button" onClick={verDetalle} className="min-h-11 text-body-sm font-semibold text-fg underline-offset-4 hover:underline">Ver detalle de la solicitud</button>
    </div>
  </div>;
}
