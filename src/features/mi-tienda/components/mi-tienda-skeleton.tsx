import { Card, Skeleton } from "@/components/ui";
export function MiTiendaSkeleton() {
  return <div role="status" aria-label="Cargando Mi tienda" className="grid gap-6 lg:grid-cols-2">
    <Card className="space-y-6"><Skeleton className="w-1/2" /><Skeleton shape="block" /><Skeleton /><Skeleton /><Skeleton shape="block" /></Card>
    <Card className="hidden space-y-6 lg:block"><Skeleton /><Skeleton shape="block" className="h-96" /></Card>
  </div>;
}
