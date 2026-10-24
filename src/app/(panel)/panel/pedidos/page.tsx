import type { Metadata } from "next";
import { PanelMain } from "@/components/panel";
import { PedidosVista } from "@/features/pedidos/components/pedidos-vista";
import { leerEscenario, obtenerPedidos } from "@/features/pedidos/lib/mock";
import { prepararEscenario } from "@/features/pedidos/lib/escenarios";
import { ahoraIso } from "@/lib/reloj";
import { leerFiltro } from "@/features/pedidos/lib/reglas";

export const metadata: Metadata = { title: "Pedidos · Tiendly" };

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };
import { herramientasDev } from "@/lib/entorno";
import { slugPanel } from "@/lib/sesion";

/**
 * Pedidos (decisión 0010). Datos simulados: ?escenario=pedidos (por defecto), vacio o error.
 * Filtro en ?estado= (para-atender, por-cobrar, reservas, por-enviar): Inicio abre la lista ya filtrada.
 */
export default async function PanelPedidos({ searchParams }: PageProps) {
  const { escenario, estado } = await searchParams;
  await prepararEscenario(escenario);
  const ahora = ahoraIso();
  const pedidos = await obtenerPedidos(leerEscenario(herramientasDev ? escenario : undefined), await slugPanel(), ahora);
  return (
    <PanelMain className="gap-10 pb-10 lg:gap-12 lg:pb-16">
      <PedidosVista pedidos={pedidos} ahora={ahora} filtroInicial={leerFiltro(Array.isArray(estado) ? estado[0] : estado)} />
    </PanelMain>
  );
}
