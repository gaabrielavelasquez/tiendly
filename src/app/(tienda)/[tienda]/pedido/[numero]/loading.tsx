import { Skeleton } from "@/components/ui";

/** Esqueleto de la confirmación del pedido. */
export default function Cargando() {
  return (
    <div aria-busy className="mx-auto flex w-full max-w-xl flex-col gap-4 px-4 pt-24">
      <span className="sr-only">Cargando tu pedido</span>
      <Skeleton className="h-6 w-40" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}
