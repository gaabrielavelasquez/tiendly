import { useId } from "react";
import { Card } from "@/components/ui";
import { cn } from "@/lib/cn";

type TarjetaSeccionProps = { titulo: string; descripcion?: string; accion?: React.ReactNode; className?: string; children: React.ReactNode };

/** Sección de una vista de detalle o formulario: tarjeta (0024) con título en Outfit SemiBold, ayuda opcional y acción opcional. */
export function TarjetaSeccion({ titulo, descripcion, accion, className, children }: TarjetaSeccionProps) {
  const id = useId();
  return (
    <Card as="section" aria-labelledby={id} className={cn("flex flex-col gap-5 lg:p-6", className)}>
      <header className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2 id={id} className="encabezado-seccion text-fg">
            {titulo}
          </h2>
          {descripcion && <p className="text-caption text-fg-secondary">{descripcion}</p>}
        </div>
        {accion}
      </header>
      {children}
    </Card>
  );
}
