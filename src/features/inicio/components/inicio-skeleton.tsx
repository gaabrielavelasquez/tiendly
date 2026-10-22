import { Card, Skeleton } from "@/components/ui";

/** Carga de Inicio: misma estructura que la vista con actividad (decisiones 0012 y 0031), para que nada "salte" al llegar. */
export function InicioSkeleton() {
  return (
    <>
      <div className="flex flex-col gap-3 pt-4 pb-2 lg:pt-8">
        <Skeleton className="h-10 w-2/3 lg:h-14 lg:w-1/3" />
        <Skeleton className="w-1/2 lg:w-1/5" />
      </div>
      <div className="grid gap-10 lg:grid-cols-5 lg:items-start lg:gap-x-8 lg:gap-y-12">
        <Card className="flex flex-col gap-8 lg:col-span-2">
          <Skeleton className="w-1/5" />
          <Skeleton className="h-10 w-1/2 lg:h-14" />
          <Skeleton className="w-3/4" />
        </Card>
        <div className="flex flex-col gap-4 lg:col-span-3 lg:gap-5">
          <Skeleton className="h-6 w-1/3" />
          <div className="flex flex-col divide-y divide-line-card rounded-card border border-line-card bg-surface shadow-card lg:grid lg:grid-cols-3 lg:gap-4 lg:divide-y-0 lg:border-0 lg:bg-transparent lg:shadow-none">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4 lg:flex-col lg:items-start lg:rounded-card lg:border lg:border-line-card lg:bg-surface lg:p-5 lg:shadow-card">
                <Skeleton shape="block" className="size-10 rounded-full" />
                <div className="flex w-full flex-1 flex-col gap-2">
                  <Skeleton className="w-2/3" />
                  <Skeleton className="w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <Card className="flex flex-col gap-6 lg:col-span-5 lg:p-10">
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-7 w-1/3" />
          <div className="flex h-36 items-end gap-1 lg:h-40 lg:gap-4">
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex h-full flex-1 justify-center">
                <Skeleton className="h-full w-2 rounded-full lg:w-2.5" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
