import { Card, Skeleton } from "@/components/ui";

/** Carga del panel (CLAUDE.md §5): misma estructura que Inicio para que no "salte" al llegar. */
export default function PanelLoading() {
  return (
    <main aria-busy="true" aria-label="Cargando tu panel" className="mx-auto flex max-w-xl flex-col gap-4 px-4 py-8">
      <Skeleton className="h-8 w-1/2" />
      <Card className="flex flex-col gap-3">
        <Skeleton className="w-1/3" />
        <Skeleton className="h-10 w-2/3" />
      </Card>
      <Card className="flex flex-col gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton shape="circle" className="size-10" />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className="w-3/4" />
              <Skeleton className="w-1/2" />
            </div>
          </div>
        ))}
      </Card>
    </main>
  );
}
