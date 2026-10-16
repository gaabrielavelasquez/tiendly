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
          <Skeleton className="h-9 w-1/2" />
          <Skeleton className="w-3/4" />
        </Card>
        <Card className="flex flex-col gap-4 lg:col-span-3">
          <Skeleton className="w-1/3" />
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton shape="circle" className="size-2.5" />
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
        <div className="flex h-27.5 items-end gap-2 lg:h-40">
          {["h-1/3", "h-1/2", "h-1/4", "h-2/3", "h-1/5", "h-1/5", "h-1/5"].map((h, i) => (
            <Skeleton key={i} className={`flex-1 rounded-t-sm rounded-b-none ${h}`} />
          ))}
        </div>
      </Card>
    </>
  );
}
