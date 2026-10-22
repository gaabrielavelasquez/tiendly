import { Mail, MapPin, Store } from "lucide-react";
import { TarjetaSeccion } from "@/components/panel";
import { buttonVariants } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { DetallePedido, Pedido } from "../../types";
import { celularVisible, iniciales, whatsappCliente } from "../../lib/reglas";

type Props = { pedido: Pedido; detalle: DetallePedido };

/** Cliente: avatar, nombre, WhatsApp con "Contactar" (mensaje con el número de pedido) y correo, solo si lo dejó (decisión 0027). */
export function TarjetaCliente({ pedido, detalle }: Props) {
  const { nombre, celular } = pedido.cliente;
  return (
    <TarjetaSeccion titulo="Cliente">
      <div className="flex items-center gap-3">
        <span aria-hidden className="flex size-10 shrink-0 items-center justify-center rounded-full border border-line-subtle bg-sunken text-body-sm font-semibold text-fg-secondary">
          {iniciales(nombre)}
        </span>
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-body-sm font-semibold text-fg">{nombre}</span>
          <span className="text-caption text-fg-secondary tabular-nums">+51 {celularVisible(celular)}</span>
        </div>
      </div>
      <a
        href={whatsappCliente(pedido)}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(buttonVariants({ variant: "secondary", block: true }), "transition active:scale-98")}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icons/whatsapp.svg" alt="" width={20} height={20} />
        <span>Contactar por WhatsApp</span>
      </a>
      {detalle.email && (
        <p className="flex items-center gap-2 text-body-sm">
          <Mail aria-hidden strokeWidth={1.6} className="size-4 shrink-0 text-icon" />
          <a href={`mailto:${detalle.email}`} className="link-text relative truncate after:absolute after:-inset-y-3 after:inset-x-0 after:content-['']">
            {detalle.email}
          </a>
        </p>
      )}
    </TarjetaSeccion>
  );
}

/** Entrega: delivery con dirección, distrito y referencia, o recojo en tienda. */
export function TarjetaEntrega({ pedido, detalle }: Props) {
  const recojo = pedido.entrega.metodo === "recojo";
  const Icono = recojo ? Store : MapPin;
  return (
    <TarjetaSeccion titulo="Entrega">
      <div className="flex gap-3">
        <Icono aria-hidden strokeWidth={1.6} className="mt-0.5 size-5 shrink-0 text-icon" />
        <div className="flex flex-col gap-0.5 text-body-sm">
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
    </TarjetaSeccion>
  );
}
