import { Skeleton } from "@/components/ui";

/** Esqueleto del carrito mientras llega el catálogo. */
export default function Cargando() {
  return (
    <div aria-busy className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 pt-6 lg:pt-28">
      <span className="sr-only">Cargando tu carrito</span>
      <Skeleton className="h-8 w-40" />
      <Skeleton className="h-36 lg:w-2/3" />
      <Skeleton className="h-36 lg:w-2/3" />
    </div>
  );
}
