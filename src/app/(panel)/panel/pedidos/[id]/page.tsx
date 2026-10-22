import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PanelMain } from "@/components/panel";
import { DetallePedidoVista } from "@/features/pedidos/components/detalle/detalle-pedido";
import { AHORA, obtenerPedido } from "@/features/pedidos/lib/mock";
import { slugPanel } from "@/lib/sesion";

export const metadata: Metadata = { title: "Pedido · Tiendly" };

type PageProps = { params: Promise<{ id: string }> };

/** Detalle de un pedido (tl-1035 a tl-1047). Si el id no existe, 404. */
export default async function DetallePedidoPage({ params }: PageProps) {
  const { id } = await params;
  const datos = await obtenerPedido(await slugPanel(), id);
  if (!datos) notFound();
  return (
    <PanelMain className="lg:pt-0">
      <DetallePedidoVista pedido={datos.pedido} detalle={datos.detalle} ahora={AHORA} />
    </PanelMain>
  );
}
