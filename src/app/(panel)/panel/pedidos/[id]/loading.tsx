import { PanelMain, Seccion } from "@/components/panel";
import { Skeleton } from "@/components/ui";

/** Respeta el mismo orden móvil y la distribución desktop del detalle. */
export default function DetallePedidoLoading() {
  const secciones = [
    { titulo: "Productos", clase: "lg:col-span-2 lg:row-span-2" },
    { titulo: "Pago", clase: "lg:col-start-3 lg:row-start-1" },
    { titulo: "Cliente", clase: "lg:col-start-3 lg:row-start-2" },
    { titulo: "Historial", clase: "lg:col-span-2 lg:row-span-2 lg:row-start-3" },
    { titulo: "Entrega", clase: "lg:col-start-3 lg:row-start-3" },
    { titulo: "Notas", clase: "lg:col-start-3 lg:row-start-4" },
  ];
  return (
    <PanelMain aria-busy="true" aria-label="Cargando el pedido" className="gap-10 pb-36 lg:gap-12 lg:pb-16">
      <div className="flex flex-col gap-3"><Skeleton className="h-8 w-36" /><Skeleton className="w-40" /></div>
      <div className="grid min-w-0 grid-cols-1 items-start gap-10 lg:grid-cols-3 lg:gap-12">
        {secciones.map(({ titulo, clase }) => (
          <div key={titulo} className={`min-w-0 ${clase}`}>
            <Seccion id={`cargando-${titulo}`} titulo={titulo}>
              <Skeleton className="w-3/4" /><Skeleton className="w-1/2" />
              {titulo === "Productos" && <Skeleton shape="block" className="h-28 rounded-theme" />}
              {titulo === "Historial" && <Skeleton shape="block" className="h-32 rounded-theme" />}
            </Seccion>
          </div>
        ))}
      </div>
    </PanelMain>
  );
}
