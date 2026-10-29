import { Card, Skeleton } from "@/components/ui";
export function AfiliacionSkeleton() { return <div role="status" aria-label="Cargando solicitud" className="mx-auto w-full max-w-2xl space-y-10 rounded-card bg-surface p-5 shadow-contenedor"><Skeleton className="w-2/3" /><Skeleton /><Skeleton shape="block" /><Skeleton /><Skeleton /></div>; }
