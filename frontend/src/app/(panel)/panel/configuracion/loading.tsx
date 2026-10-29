import { PanelMain } from "@/components/panel";
import { Skeleton } from "@/components/ui";

/** Carga de Configuración y sus subpáginas (CLAUDE.md §5). */
export default function ConfiguracionLoading() {
  return (
    <PanelMain aria-busy="true" aria-label="Cargando la configuración">
      <Skeleton className="h-9 w-56" />
      <Skeleton className="h-5 w-80 max-w-full" />
      <Skeleton shape="block" className="h-48" />
      <Skeleton shape="block" className="h-40" />
    </PanelMain>
  );
}
