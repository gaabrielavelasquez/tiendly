import { Card, Skeleton } from "@/components/ui";

// Bloque de sección: título fuera y contenedor debajo (decisión 0031, ronda 4).
const Titulo = () => <Skeleton className="h-6 w-1/3 lg:w-1/5" />;

/** Carga de Inicio: misma estructura que la vista con actividad (decisiones 0012 y 0031), para que nada "salte" al llegar. */
export function InicioSkeleton() {
  return (
    <>
      <div className="flex flex-col gap-3 pt-4 pb-2 lg:pt-8">
        <Skeleton className="h-8 w-3/4 lg:h-10 lg:w-1/2" />
        <Skeleton className="w-1/3 lg:w-1/6" />
      </div>
      <div className="grid gap-10 lg:grid-cols-5 lg:items-start lg:gap-x-8 lg:gap-y-12">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <Titulo />
          <Card className="flex flex-col gap-8 border-0 shadow-contenedor lg:p-8">
            <Skeleton className="w-1/5" />
            <Skeleton className="h-10 w-1/2 lg:h-14" />
            <Skeleton className="w-3/4" />
          </Card>
        </div>
        <div className="flex flex-col gap-4 lg:col-span-3">
          <Titulo />
          <div className="flex flex-col divide-y divide-line-subtle rounded-card bg-surface shadow-contenedor">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-start gap-4 px-5 py-4 lg:px-6 lg:py-5">
                <Skeleton shape="block" className="size-5 rounded-theme" />
                <div className="flex w-full flex-1 flex-col gap-2">
                  <Skeleton className="w-2/3" />
                  <Skeleton className="w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4 lg:col-span-5">
          <Titulo />
          <Card className="flex flex-col gap-6 border-0 shadow-contenedor lg:p-10">
            <Skeleton className="h-7 w-1/3" />
            <div className="flex h-36 items-end gap-1 lg:h-32 lg:gap-4">
              {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex h-full flex-1 justify-center">
                  <Skeleton className="h-full w-2 rounded-full lg:w-2.5" />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
