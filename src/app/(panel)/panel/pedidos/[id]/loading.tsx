import { PanelMain, Seccion } from "@/components/panel";
import { Skeleton } from "@/components/ui";

/** Mismos encabezados externos, columnas y ritmo de la ficha de Pedidos. */
export default function DetallePedidoLoading() {
  return (
    <PanelMain aria-busy="true" aria-label="Cargando el pedido" className="gap-10 lg:gap-12">
      <div className="flex flex-col gap-3">
        <Skeleton className="h-8 w-36" />
        <Skeleton className="w-40" />
      </div>
      <div className="grid min-w-0 grid-cols-1 items-start gap-10 lg:grid-cols-3 lg:gap-12">
        <div className="flex min-w-0 flex-col gap-10 lg:col-span-2 lg:gap-12">
          <Seccion id="cargando-productos" titulo="Productos">
            {[0, 1].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton shape="block" className="size-12 shrink-0 rounded-theme" />
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <Skeleton className="w-3/4" /><Skeleton className="w-1/2" />
                </div>
                <Skeleton className="w-16 shrink-0" />
              </div>
            ))}
            <Skeleton shape="block" className="h-28 rounded-theme" />
          </Seccion>
          <Seccion id="cargando-historial" titulo="Historial">
            <Skeleton shape="block" className="h-32 rounded-theme" />
          </Seccion>
        </div>
        <div className="flex min-w-0 flex-col gap-10 lg:gap-12">
          {["Pago", "Cliente", "Entrega", "Notas"].map((titulo) => (
            <Seccion key={titulo} id={`cargando-${titulo}`} titulo={titulo}>
              <Skeleton className="w-3/4" /><Skeleton className="w-1/2" />
            </Seccion>
          ))}
        </div>
      </div>
    </PanelMain>
  );
}
