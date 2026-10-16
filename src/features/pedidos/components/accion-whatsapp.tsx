import { cn } from "@/lib/cn";
import type { Pedido } from "../types";
import { whatsappCliente } from "../lib/reglas";

/**
 * Escribirle al cliente por WhatsApp con el número de pedido ya escrito. Con mouse aparece al pasar
 * por la fila o al enfocarla; en pantallas táctiles se ve siempre.
 */
export function AccionWhatsApp({ p, className }: { p: Pedido; className?: string }) {
  return (
    <a
      href={whatsappCliente(p)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Escribirle a ${p.cliente.nombre} por WhatsApp sobre el pedido #${p.numero}`}
      title="Escribir por WhatsApp"
      className={cn(
        "relative flex size-9 items-center justify-center rounded-theme transition hover:bg-sunken after:absolute after:-inset-1 after:content-['']",
        "pointer-fine:opacity-0 pointer-fine:group-hover:opacity-100 pointer-fine:group-focus-within:opacity-100",
        className,
      )}
    >
      {/* Icono/whatsapp de Figma (20 × 20). */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/icons/whatsapp.svg" alt="" width={20} height={20} />
    </a>
  );
}
