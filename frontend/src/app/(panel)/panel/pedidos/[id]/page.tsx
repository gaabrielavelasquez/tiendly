import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PanelMain } from "@/components/panel";
import { DetallePedidoVista } from "@/features/pedidos/components/detalle/detalle-pedido";
import { obtenerPedido } from "@/features/pedidos/lib/mock";
import { prepararEscenario } from "@/features/pedidos/lib/escenarios";
import { ahoraIso } from "@/lib/reloj";
import { slugPanel } from "@/lib/sesion";

export const metadata: Metadata = { title: "Pedido · Tiendly" };

type PageProps = { params: Promise<{ id: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

/** Detalle de un pedido (tl-1035 a tl-1047). Si el id no existe, 404. */
export default async function DetallePedidoPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  await prepararEscenario((await searchParams).escenario, true);
  const ahora = ahoraIso();
  const datos = await obtenerPedido(await slugPanel(), id, ahora);
  if (!datos) notFound();
  return (
    <PanelMain className="lg:pt-0">
      <DetallePedidoVista pedido={datos.pedido} detalle={datos.detalle} ahora={ahora} />
    </PanelMain>
  );
}
