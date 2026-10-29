import { PanelMain } from "@/components/panel";
import { InicioSkeleton } from "@/features/inicio/components/inicio-skeleton";

/** Carga de Inicio (CLAUDE.md §5). */
export default function PanelLoading() {
  return (
    <PanelMain className="gap-10 lg:gap-12" aria-busy="true" aria-label="Cargando tu inicio">
      <InicioSkeleton />
    </PanelMain>
  );
}
