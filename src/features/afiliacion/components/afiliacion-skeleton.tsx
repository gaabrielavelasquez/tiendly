import { Card, Skeleton } from "@/components/ui";
export function AfiliacionSkeleton() { return <Card role="status" aria-label="Cargando solicitud" className="mx-auto w-full max-w-2xl space-y-6"><Skeleton className="w-2/3" /><Skeleton /><Skeleton shape="block" /><Skeleton /><Skeleton /></Card>; }
