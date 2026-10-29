import { PanelMain } from "@/components/panel";
import { ProductosSkeleton } from "@/features/productos/components/productos-skeleton";

/** Carga de Productos (CLAUDE.md §5). */
export default function ProductosLoading() {
  return (
    <PanelMain aria-busy="true" aria-label="Cargando tus productos">
      <ProductosSkeleton />
    </PanelMain>
  );
}
