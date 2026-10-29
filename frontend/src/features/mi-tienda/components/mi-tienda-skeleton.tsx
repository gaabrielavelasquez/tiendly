import { CONTENEDOR } from "@/components/panel";
import { Skeleton } from "@/components/ui";

export function MiTiendaSkeleton() {
  return <div role="status" aria-busy="true" aria-label="Cargando Mi tienda" className="grid min-w-0 gap-10 xl:grid-cols-2 xl:gap-12">
    <div className="flex flex-col gap-3"><Skeleton className="h-7 w-32" /><div className={`${CONTENEDOR} space-y-6 p-5`}><Skeleton shape="block" /><Skeleton /><Skeleton /><Skeleton shape="block" /></div></div>
    <div className="hidden flex-col gap-3 xl:flex"><Skeleton className="h-7 w-48" /><div className={`${CONTENEDOR} p-5`}><Skeleton shape="block" className="h-96" /></div></div>
  </div>;
}
