import { PanelMain } from "@/components/panel";
import { InicioSkeleton } from "@/features/inicio/components/inicio-skeleton";

/** Carga de Inicio (CLAUDE.md §5). */
export default function PanelLoading() {
  return (
    <PanelMain aria-busy="true" aria-label="Cargando tu inicio">
      <InicioSkeleton />
    </PanelMain>
  );
}
