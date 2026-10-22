import { Skeleton } from "@/components/ui";

/** Carga de la página de producto: misma forma (foto a la izquierda, compra a la derecha). */
export default function ProductoLoading() {
  return (
    <div className="flex min-h-dvh flex-col" aria-busy="true" aria-label="Cargando el producto">
      <div className="h-16 border-b border-line-subtle" />
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-6 lg:grid-cols-2 lg:gap-14 lg:py-12">
        <Skeleton shape="block" className="aspect-4/5 h-auto rounded-card" />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-5 w-24" />
          <Skeleton className="w-1/2" />
          <Skeleton shape="block" className="h-24 rounded-theme" />
          <Skeleton shape="block" className="h-12 rounded-button" />
          <Skeleton shape="block" className="h-12 rounded-button" />
        </div>
      </div>
    </div>
  );
}
