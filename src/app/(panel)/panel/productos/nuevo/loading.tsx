import { PanelMain } from "@/components/panel";
import { Card, Skeleton } from "@/components/ui";

/** Carga de Nuevo producto: mismo esqueleto de dos columnas que el formulario. */
export default function NuevoProductoLoading() {
  return (
    <PanelMain aria-busy="true" aria-label="Cargando el formulario" className="lg:pt-6">
      <Skeleton className="h-8 w-1/2 lg:w-1/4" />
      <div className="grid items-start gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          {["h-48", "h-40", "h-28", "h-64"].map((h) => (
            <Card key={h} className="flex flex-col gap-4">
              <Skeleton className="w-1/4" />
              <Skeleton shape="block" className={`${h} rounded-theme`} />
            </Card>
          ))}
        </div>
        <div className="flex flex-col gap-6">
          {["h-16", "h-24"].map((h) => (
            <Card key={h} className="flex flex-col gap-4">
              <Skeleton className="w-1/3" />
              <Skeleton shape="block" className={`${h} rounded-theme`} />
            </Card>
          ))}
        </div>
      </div>
    </PanelMain>
  );
}
