import { Mail, MapPin, Store, MessageCircle, UserRound, ChevronRight } from "lucide-react";
import { Seccion } from "@/components/panel";
import type { DetallePedido, Pedido } from "../../types";
import { celularVisible, whatsappCliente } from "../../lib/reglas";

type Props = { pedido: Pedido; detalle: DetallePedido };

/** Cliente: avatar, nombre, WhatsApp con "Contactar" (mensaje con el número de pedido) y correo, solo si lo dejó (decisión 0027). */
export function TarjetaCliente({ pedido, detalle }: Props) {
  const { nombre, celular } = pedido.cliente;
  return (
    <Seccion id="cliente-pedido" titulo="Cliente">
      <div className="flex items-center gap-3">
        <UserRound aria-hidden strokeWidth={1.5} className="size-5 shrink-0 text-icon" />
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-body-sm font-semibold text-fg">{nombre}</span>
          <span className="text-caption text-fg-secondary tabular-nums">+51 {celularVisible(celular)}</span>
        </div>
      </div>
      <a
        href={whatsappCliente(pedido)}
        target="_blank"
        rel="noopener noreferrer"
        className="-mx-5 flex min-h-11 items-center gap-3 border-t border-line-subtle px-5 pt-4 text-body-sm font-medium text-fg transition-colors hover:bg-sunken lg:-mx-6 lg:px-6"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icons/whatsapp.svg" alt="" width={20} height={20} />
        <span className="min-w-0 flex-1">Contactar por WhatsApp</span>
        <ChevronRight aria-hidden strokeWidth={1.5} className="size-4 shrink-0 text-icon" />
      </a>
      {detalle.email && (
        <p className="min-w-0 text-body-sm">
          <a href={`mailto:${detalle.email}`} className="flex min-h-11 min-w-0 items-center gap-3 text-fg transition-colors hover:text-accent-text">
            <Mail aria-hidden strokeWidth={1.5} className="size-4 shrink-0 text-icon" />
            <span className="truncate">{detalle.email}</span>
          </a>
        </p>
      )}
    </Seccion>
  );
}

/** Entrega: delivery con dirección, distrito y referencia, recojo en tienda o por coordinar (WhatsApp). */
export function TarjetaEntrega({ pedido, detalle }: Props) {
  if (pedido.entrega.metodo === "coordinar") {
    return (
      <Seccion id="entrega-pedido" titulo="Entrega">
        <div className="flex gap-3">
          <MessageCircle aria-hidden strokeWidth={1.5} className="mt-0.5 size-5 shrink-0 text-icon" />
          <div className="flex min-w-0 flex-col gap-0.5 break-words text-body-sm">
            <span className="font-semibold text-fg">Por coordinar</span>
            <span className="text-fg-secondary">Acuérdala con tu cliente por WhatsApp: cómo le llega y cuánto cuesta el envío.</span>
          </div>
        </div>
      </Seccion>
    );
  }
  const recojo = pedido.entrega.metodo === "recojo";
  const Icono = recojo ? Store : MapPin;
  return (
    <Seccion id="entrega-pedido" titulo="Entrega">
      <div className="flex gap-3">
        <Icono aria-hidden strokeWidth={1.5} className="mt-0.5 size-5 shrink-0 text-icon" />
        <div className="flex min-w-0 flex-col gap-0.5 break-words text-body-sm">
          <span className="font-semibold text-fg">{recojo ? "Recojo en tienda" : "Delivery"}</span>
          {recojo ? (
            <span className="text-fg-secondary">Lo recoge en tu tienda. Avísale por WhatsApp cuando esté listo.</span>
          ) : (
            <>
              <span className="text-fg">{detalle.direccion}</span>
              <span className="text-fg-secondary">{pedido.entrega.distrito}, Lima</span>
              {detalle.referencia && <span className="text-caption text-fg-secondary">Referencia: {detalle.referencia}</span>}
            </>
          )}
        </div>
      </div>
    </Seccion>
  );
}
