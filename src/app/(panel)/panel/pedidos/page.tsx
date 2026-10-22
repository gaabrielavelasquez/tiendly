import type { Metadata } from "next";
import { PanelMain } from "@/components/panel";
import { PedidosVista } from "@/features/pedidos/components/pedidos-vista";
import { AHORA, leerEscenario, obtenerPedidos } from "@/features/pedidos/lib/mock";
import { leerFiltro } from "@/features/pedidos/lib/reglas";

export const metadata: Metadata = { title: "Pedidos · Tiendly" };

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

/**
 * Pedidos (decisión 0010). Datos simulados: ?escenario=pedidos (por defecto), vacio o error.
 * Filtro en ?estado= (para-atender, por-cobrar, reservas, por-enviar): Inicio abre la lista ya filtrada.
 */
export default async function PanelPedidos({ searchParams }: PageProps) {
  const { escenario, estado } = await searchParams;
  const pedidos = await obtenerPedidos(leerEscenario(escenario));
  return (
    <PanelMain>
      <PedidosVista pedidos={pedidos} ahora={AHORA} filtroInicial={leerFiltro(Array.isArray(estado) ? estado[0] : estado)} />
    </PanelMain>
  );
}
