import { PanelMain } from "@/components/panel";
import { PedidosSkeleton } from "@/features/pedidos/components/pedidos-skeleton";

/** Carga de Pedidos (CLAUDE.md §5). */
export default function PedidosLoading() {
  return (
    <PanelMain aria-busy="true" aria-label="Cargando tus pedidos">
      <PedidosSkeleton />
    </PanelMain>
  );
}
