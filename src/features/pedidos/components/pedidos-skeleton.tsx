import { CONTENEDOR } from "@/components/panel";
import { Skeleton } from "@/components/ui";

/** Carga con filtros fuera del contenedor, igual que la lista de 0031. */
export function PedidosSkeleton() {
  return (
    <>
      <div className="flex flex-col gap-3">
        <Skeleton className="h-8 w-1/3 lg:h-10 lg:w-1/5" />
        <Skeleton className="w-1/2 lg:w-1/4" />
      </div>
      <div className="flex min-w-0 flex-col gap-3">
        <div className="flex min-w-0 flex-col gap-3 lg:flex-row-reverse lg:justify-between">
          <Skeleton className="h-10 w-full rounded-button lg:w-80" />
          <div className="flex min-w-0 gap-2 overflow-hidden py-2">
            {[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-7 w-24 shrink-0 rounded-chip" />)}
          </div>
        </div>
        <Skeleton className="h-7 w-24 lg:hidden" />
        <div className={`${CONTENEDOR} divide-y divide-line-subtle`}>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex min-w-0 items-center gap-6 px-4 py-4 lg:px-6">
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <Skeleton className="w-3/4" />
                <Skeleton className="w-1/2" />
              </div>
              <Skeleton className="hidden h-6 w-20 rounded-chip lg:block" />
              <Skeleton className="hidden h-6 w-20 rounded-chip lg:block" />
              <Skeleton className="w-14 shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
