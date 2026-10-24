import { PanelMain } from "@/components/panel";
import { Skeleton } from "@/components/ui";
import { MiTiendaSkeleton } from "@/features/mi-tienda/components/mi-tienda-skeleton";
export default function Loading() {
  return <PanelMain aria-busy="true" className="gap-10 lg:gap-12"><Skeleton className="h-10 w-48" /><MiTiendaSkeleton /></PanelMain>;
}
