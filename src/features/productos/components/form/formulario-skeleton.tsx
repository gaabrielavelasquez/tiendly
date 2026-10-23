import { CONTENEDOR, PanelMain } from "@/components/panel";
import { Skeleton } from "@/components/ui";
import { cn } from "@/lib/cn";

/** Una sección cargando, con la forma de 0031: título afuera y un contenedor. */
function SeccionCargando({ alto }: { alto: string }) {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="h-6 w-32" />
      <div className={cn(CONTENEDOR, "p-5 lg:p-6")}>
        <Skeleton shape="block" className={cn(alto, "rounded-theme")} />
      </div>
    </div>
  );
}

/** Carga de crear / editar producto: mismas secciones y columnas que el formulario, para que nada salte al llegar. */
export function FormularioSkeleton() {
  return (
    <PanelMain aria-busy="true" aria-label="Cargando el producto" className="lg:pt-6">
      <Skeleton className="h-8 w-1/2 lg:w-1/4" />
      <div className="grid items-start gap-10 lg:grid-cols-3 lg:gap-12">
        <div className="flex flex-col gap-10 lg:col-span-2 lg:gap-12">
          {["h-40", "h-32", "h-24", "h-40", "h-32"].map((h, i) => <SeccionCargando key={i} alto={h} />)}
        </div>
        <div className="flex flex-col gap-10 lg:gap-12">
          {["h-12", "h-20"].map((h, i) => <SeccionCargando key={i} alto={h} />)}
        </div>
      </div>
    </PanelMain>
  );
}
