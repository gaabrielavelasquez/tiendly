import { Card, Skeleton } from "@/components/ui";

/** Carga de Inicio: misma estructura que la vista con actividad (decisión 0031), para que nada "salte" al llegar. */
export function InicioSkeleton() {
  return (
    <>
      <div className="flex flex-col gap-3 pt-4 pb-2 lg:pt-8">
        <Skeleton className="h-10 w-2/3 lg:h-14 lg:w-1/3" />
        <Skeleton className="w-1/2 lg:w-1/5" />
      </div>
      <div className="grid gap-10 lg:grid-cols-5 lg:gap-x-8 lg:gap-y-12">
        <Card className="flex flex-col gap-8 lg:col-span-2 lg:row-start-1 lg:p-10">
          <Skeleton className="w-1/5" />
          <Skeleton className="h-10 w-1/2 lg:h-14" />
          <Skeleton className="w-3/4" />
        </Card>
        <div className="flex flex-col gap-4 lg:col-span-5 lg:row-start-2">
          <Skeleton className="w-1/3 lg:w-1/6" />
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {[0, 1, 2].map((i) => (
              <Card key={i} className="flex items-center gap-4 p-5 lg:p-5">
                <Skeleton shape="block" className="size-10 rounded-full" />
                <div className="flex flex-1 flex-col gap-2">
                  <Skeleton className="w-2/3" />
                  <Skeleton className="w-1/2" />
                </div>
              </Card>
            ))}
          </div>
        </div>
        <Card className="flex flex-col gap-6 lg:col-span-3 lg:row-start-1 lg:p-10">
          <Skeleton className="w-1/4" />
          <Skeleton className="h-7 w-1/3" />
          <div className="flex h-36 items-end gap-1 lg:h-40 lg:gap-4">
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex h-full flex-1 justify-center">
                <Skeleton className="h-full w-3 rounded-full lg:w-3.5" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
