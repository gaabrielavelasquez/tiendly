import { Skeleton } from "@/components/ui";

/** Esqueleto de "Finalizar compra" mientras llega el catálogo. */
export default function Cargando() {
  return (
    <div aria-busy className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-6 lg:gap-12 lg:py-12">
      <span className="sr-only">Cargando tu pedido</span>
      <Skeleton className="h-8 w-40" />
      <div className="flex flex-col gap-3 lg:w-2/3"><Skeleton className="h-6 w-32" /><Skeleton className="h-36" /></div>
      <div className="flex flex-col gap-3 lg:w-2/3"><Skeleton className="h-6 w-32" /><Skeleton className="h-36" /></div>
    </div>
  );
}
