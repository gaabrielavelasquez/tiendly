import { PanelMain } from "@/components/panel";
import { Card, Skeleton } from "@/components/ui";

/** Carga del detalle del pedido: mismo esqueleto de dos columnas. */
export default function DetallePedidoLoading() {
  return (
    <PanelMain aria-busy="true" aria-label="Cargando el pedido" className="lg:pt-6">
      <div className="flex items-center gap-3">
        <Skeleton className="h-8 w-28" />
        <Skeleton className="h-6 w-28 rounded-chip" />
        <Skeleton className="h-6 w-28 rounded-chip" />
      </div>
      <div className="grid items-start gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card className="flex flex-col gap-4">
            <Skeleton className="w-1/4" />
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton shape="block" className="size-12 rounded-theme" />
                <div className="flex flex-1 flex-col gap-2">
                  <Skeleton className="w-1/2" />
                  <Skeleton className="w-1/4" />
                </div>
                <Skeleton className="w-16" />
              </div>
            ))}
          </Card>
          <Card className="flex flex-col gap-4">
            <Skeleton className="w-1/5" />
            <Skeleton shape="block" className="h-32 rounded-theme" />
          </Card>
        </div>
        <div className="flex flex-col gap-6">
          {["h-24", "h-16", "h-24"].map((h, i) => (
            <Card key={i} className="flex flex-col gap-4">
              <Skeleton className="w-1/3" />
              <Skeleton shape="block" className={`${h} rounded-theme`} />
            </Card>
          ))}
        </div>
      </div>
    </PanelMain>
  );
}
