import { Card, Skeleton } from "@/components/ui";

/** Carga de Pedidos: misma estructura que la lista para que nada "salte" al llegar. */
export function PedidosSkeleton() {
  return (
    <>
      <div className="flex flex-col gap-3">
        <Skeleton className="h-8 w-1/3 lg:h-10 lg:w-1/5" />
        <Skeleton className="w-1/2 lg:w-1/4" />
      </div>
      <Card className="overflow-hidden p-0 lg:p-0">
        <div className="flex flex-col gap-3 border-b border-line-subtle px-4 py-4 lg:flex-row lg:justify-between lg:px-6">
          <div className="flex gap-2">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-7 w-24 rounded-chip" />
            ))}
          </div>
          <Skeleton className="h-10 w-full rounded-button lg:w-80" />
        </div>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-6 border-b border-line-subtle px-4 py-4 last:border-b-0 lg:px-6">
            <div className="flex w-24 flex-col gap-2">
              <Skeleton className="w-3/4" />
              <Skeleton className="w-full" />
            </div>
            <div className="flex flex-1 items-center gap-3">
              <Skeleton shape="circle" className="size-8" />
              <div className="flex flex-1 flex-col gap-2">
                <Skeleton className="w-1/2" />
                <Skeleton className="w-1/3" />
              </div>
            </div>
            <Skeleton className="hidden h-6 w-20 rounded-chip lg:block" />
            <Skeleton className="hidden h-6 w-20 rounded-chip lg:block" />
            <Skeleton className="w-14" />
          </div>
        ))}
      </Card>
    </>
  );
}
