import { BadgeCheck, ChevronRight, CreditCard, Truck } from "lucide-react";
import Link from "next/link";
import { CONTENEDOR, EncabezadoSeccion } from "@/components/panel";
import { sinProtocolo } from "@/lib/link-tienda";
import { formatoCelular } from "@/features/checkout/lib/reglas";
import type { ConfigCompra } from "../types";
import { metodosVisibles, vistaCliente } from "../lib/reglas";

/** Configuración (decisión 0027): Métodos de pago, Entregas, Cobros automáticos (Afiliación, módulo 4) y Cuenta. */
/** `tienda`: su nombre; `link`: URL pública de la vitrina (lib/link-tienda). */
export function Hub({ config, tienda, link }: { config: ConfigCompra; tienda: string; link: string }) {
  const m = metodosVisibles(config.pagos);
  const entregas = vistaCliente(config.entregas);
  const filas = [
    { href: "/panel/configuracion/pagos", icono: CreditCard, titulo: "Métodos de pago", detalle: [...m.ahora, ...m.despues].join(" · ") || "Sin métodos activos" },
    { href: "/panel/configuracion/entregas", icono: Truck, titulo: "Entregas", detalle: entregas.length ? `${entregas.length} ${entregas.length === 1 ? "opción" : "opciones"} para tus clientes` : "Sin métodos de entrega activos" },
    // Cobros automáticos (módulo 4): activos se gestionan en Pagos; si no, se piden o se sigue la solicitud.
    config.pagos.cobros.estado === "activo"
      ? { href: "/panel/configuracion/pagos", icono: BadgeCheck, titulo: "Cobros automáticos", detalle: "Activos: tarjeta y Yape en tu tienda" }
      : config.pagos.cobros.estado === "en-revision"
        ? { href: "/panel/configuracion/afiliacion", icono: BadgeCheck, titulo: "Cobros automáticos", detalle: "Solicitud en revisión" }
        : { href: "/panel/configuracion/afiliacion", icono: BadgeCheck, titulo: "Cobros automáticos", detalle: "Solicita pagos con tarjeta y Yape" },
  ];
  return (
    <div className="flex min-w-0 flex-col gap-10 lg:gap-12">
      <section aria-labelledby="preferencias" className="flex min-w-0 flex-col gap-3">
      <EncabezadoSeccion id="preferencias" titulo="Cobros y entregas" />
      <div className={`${CONTENEDOR} divide-y divide-line-subtle`}>
        {filas.map(({ href, icono: Icono, titulo, detalle }) => (
          <Link key={titulo} href={href} className="group flex min-h-16 items-center gap-4 px-5 py-4 transition-colors hover:bg-sunken">
            <span aria-hidden className="shrink-0 text-icon"><Icono strokeWidth={1.5} className="size-5" /></span>
            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="text-body font-medium text-fg">{titulo}</span>
              <span className="text-caption text-fg-secondary">{detalle}</span>
            </span>
            <ChevronRight aria-hidden strokeWidth={1.5} className="size-6 shrink-0 text-icon transition-transform group-hover:translate-x-0.5" />
          </Link>
        ))}
      </div>
      </section>
      <section aria-labelledby="cuenta" className="flex min-w-0 flex-col gap-3">
        <EncabezadoSeccion id="cuenta" titulo="Cuenta" />
        <dl className={`${CONTENEDOR} divide-y divide-line-subtle text-body-sm`}>
          {[["Tienda", tienda], ["Link", sinProtocolo(link)], ["WhatsApp de pedidos", formatoCelular(config.pagos.whatsapp.celular)]].map(([k, v]) => (
            <div key={k} className="flex min-w-0 flex-col gap-1 px-5 py-4 sm:flex-row sm:gap-6"><dt className="shrink-0 text-fg-secondary sm:w-48">{k}</dt><dd className="min-w-0 break-words text-fg">{k === "Link" ? <a href={link} target="_blank" rel="noopener noreferrer" className="link-text block truncate py-3">{v}</a> : v}</dd></div>
          ))}
        </dl>
      </section>
    </div>
  );
}
