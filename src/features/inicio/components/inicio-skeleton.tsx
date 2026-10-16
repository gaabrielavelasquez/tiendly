import { Card, Skeleton } from "@/components/ui";

/** Carga de Inicio: misma estructura que la vista con actividad, para que nada "salte" al llegar. */
export function InicioSkeleton() {
  return (
    <>
      <div className="flex flex-col gap-3">
        <Skeleton className="h-8 w-1/2 lg:h-10 lg:w-1/3" />
        <Skeleton className="w-1/3 lg:w-1/5" />
      </div>
      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="flex flex-col gap-3 lg:col-span-2">
          <Skeleton className="w-1/5" />
          <Skeleton className="h-10 w-1/2" />
          <Skeleton className="w-3/4" />
        </Card>
        <Card className="flex flex-col gap-4 lg:col-span-3">
          <Skeleton className="w-1/3" />
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton shape="block" className="size-10 rounded-theme" />
              <div className="flex flex-1 flex-col gap-2">
                <Skeleton className="w-1/2" />
                <Skeleton className="w-1/3" />
              </div>
            </div>
          ))}
        </Card>
      </div>
      <Card className="flex flex-col gap-3">
        <Skeleton className="w-1/4" />
        <Skeleton className="h-7 w-1/3" />
        <div className="flex h-32 items-end gap-1 lg:h-48 lg:gap-3">
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex h-full flex-1 justify-center">
              <Skeleton className="h-full w-6 rounded-sm lg:w-8" />
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
