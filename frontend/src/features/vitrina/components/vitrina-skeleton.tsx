import { Skeleton } from "@/components/ui";

/** Carga de la vitrina: cabecera, categorías y grilla con la misma forma. */
export function VitrinaSkeleton() {
  return (
    <div className="flex min-h-dvh flex-col" aria-busy="true" aria-label="Cargando la tienda">
      <div className="flex h-14 items-center justify-center border-b border-line-subtle">
        <Skeleton className="h-6 w-28" />
      </div>
      <div className="mx-auto w-full max-w-6xl px-4">
        <div className="flex gap-2 py-3">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-7 w-20 rounded-chip" />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-6 pt-2 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex flex-col gap-2">
              <Skeleton shape="block" className="aspect-4/5 h-auto rounded-card" />
              <Skeleton className="w-3/4" />
              <Skeleton className="w-1/3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
