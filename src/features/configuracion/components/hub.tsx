import { BadgeCheck, ChevronRight, CreditCard, Truck, UserRound } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui";
import { tiendaActual } from "@/lib/sesion";
import { formatoCelular } from "@/features/checkout/lib/reglas";
import type { ConfigCompra } from "../types";
import { metodosVisibles, vistaCliente } from "../lib/reglas";

/** Configuración (decisión 0027): Métodos de pago, Entregas, Cobros automáticos (Afiliación, módulo 4) y Cuenta. */
export function Hub({ config }: { config: ConfigCompra }) {
  const m = metodosVisibles(config.pagos);
  const entregas = vistaCliente(config.entregas);
  const filas = [
    { href: "/panel/configuracion/pagos", icono: CreditCard, titulo: "Métodos de pago", detalle: [...m.ahora, ...m.despues].join(" · ") || "Sin métodos activos" },
    { href: "/panel/configuracion/entregas", icono: Truck, titulo: "Entregas", detalle: entregas.length ? `${entregas.length} ${entregas.length === 1 ? "opción" : "opciones"} para tus clientes` : "Sin métodos de entrega activos" },
    { href: "/panel/configuracion/afiliacion", icono: BadgeCheck, titulo: "Cobros automáticos", detalle: "Solicita pagos con tarjeta y Yape, o revisa tu solicitud" },
  ];
  return (
    <div className="flex flex-col gap-4">
      <Card className="divide-y divide-line-subtle p-0 lg:p-0">
        {filas.map(({ href, icono: Icono, titulo, detalle }) => (
          <Link key={href} href={href} className="group flex min-h-16 items-center gap-4 px-5 py-4 transition-colors hover:bg-sunken">
            <span aria-hidden className="flex size-10 shrink-0 items-center justify-center rounded-full bg-sunken text-icon"><Icono strokeWidth={1.6} className="size-5" /></span>
            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="text-body font-semibold text-fg">{titulo}</span>
              <span className="text-caption text-fg-secondary">{detalle}</span>
            </span>
            <ChevronRight aria-hidden strokeWidth={1.6} className="size-6 shrink-0 text-icon transition-transform group-hover:translate-x-0.5" />
          </Link>
        ))}
      </Card>
      <Card as="section" aria-labelledby="cuenta" className="flex flex-col gap-3 p-5 lg:p-6">
        <h2 id="cuenta" className="flex items-center gap-3 encabezado-seccion text-fg">
          <UserRound aria-hidden strokeWidth={1.6} className="size-5 text-icon" /> Cuenta
        </h2>
        <dl className="grid gap-2 text-body-sm sm:grid-cols-3">
          {[["Tienda", tiendaActual.nombre], ["Link", `tiendly.pe/${tiendaActual.slug}`], ["WhatsApp de pedidos", formatoCelular(config.pagos.whatsapp.celular)]].map(([k, v]) => (
            <div key={k} className="flex flex-col"><dt className="text-caption text-fg-secondary">{k}</dt><dd className="font-semibold text-fg">{v}</dd></div>
          ))}
        </dl>
      </Card>
    </div>
  );
}
