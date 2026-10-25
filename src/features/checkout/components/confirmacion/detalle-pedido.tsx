import { MontoPedido as Monto } from "@/features/pedidos/components/monto-pedido";
import type { PedidoCreado } from "../../types";

/** Entrega, dirección o recojo, pago y, si hubo cupón, el desglose (Figma 3a, 3a-R, 3a-C y 3b). */
export function DetallePedido({ p }: { p: PedidoCreado }) {
  const filas: [string, string][] = [];
  if (p.entrega.tipo === "delivery") {
    const { zona } = p.entrega.distrito;
    filas.push(["Entrega", zona === "lima" ? "Delivery en Lima" : zona === "callao" ? "Delivery en Callao" : "Delivery a provincia"]);
    filas.push(["Dirección", `${p.entrega.direccion}, ${p.entrega.distrito.nombre}`]);
    if (p.pago.metodo !== "whatsapp") filas.push(["Llega en", p.entrega.distrito.plazo]);
  } else if (p.entrega.tipo === "coordinar") {
    filas.push(["Entrega", "Por coordinar por WhatsApp (el envío va aparte)"]);
  } else {
    filas.push(["Entrega", "Recojo en tienda"]);
    if (p.recojo) filas.push(["Recoges en", `${p.recojo.direccion}, ${p.recojo.distrito}`], ["Horario", p.recojo.horario]);
  }
  if (p.pago.metodo === "whatsapp") filas.push(["Productos", String(p.totales.unidades)], ["Pago", "Pendiente, se coordina por WhatsApp"]);
  else filas.push(["Pagaste con", p.pago.metodo === "tarjeta" ? `Tarjeta ···· ${p.pago.ultimos4}` : "Yape"]);

  return (
    <section aria-labelledby="detalle-pedido" className="flex min-w-0 flex-col gap-3">
      <h2 id="detalle-pedido" className="font-display-light text-h3 text-fg">Detalle del pedido</h2>
      <div className="min-w-0 rounded-card bg-surface p-5 shadow-contenedor lg:p-6">
      <dl className="divide-y divide-line-subtle">
        {filas.map(([k, v]) => (
          <div key={k} className="flex min-w-0 flex-col gap-1 py-4 first:pt-0 last:pb-0 sm:flex-row sm:justify-between sm:gap-6">
            <dt className="text-body-sm text-fg-secondary">{k}</dt>
            <dd className="min-w-0 break-words text-body-sm text-fg sm:max-w-sm sm:text-right">{v}</dd>
          </div>
        ))}
      </dl>
      {p.totales.descuento > 0 && (
        <dl className="flex flex-col gap-2 border-t border-line-subtle pt-4 text-body-sm">
          <div className="flex justify-between"><dt className="text-fg-secondary">Productos ({p.totales.unidades})</dt><dd className="tabular-nums"><Monto valor={p.totales.productos} /></dd></div>
          <div className="flex justify-between"><dt className="text-fg-secondary">Cupón {p.cupon}</dt><dd className="text-success tabular-nums">−<Monto valor={p.totales.descuento} /></dd></div>
          <div className="flex justify-between"><dt className="text-fg-secondary">Envío</dt><dd className="tabular-nums">{p.totales.envioPorCoordinar ? "Por coordinar" : p.totales.envio ? <Monto valor={p.totales.envio} /> : "Gratis"}</dd></div>
          <div className="flex justify-between font-semibold"><dt>{p.pago.metodo === "whatsapp" ? "Total" : "Total pagado"}</dt><dd className="tabular-nums"><Monto valor={p.totales.total} /></dd></div>
        </dl>
      )}
      </div>
    </section>
  );
}
