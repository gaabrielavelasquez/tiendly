import { useId } from "react";
import { Card } from "@/components/ui";
import { cn } from "@/lib/cn";

type TarjetaProps = { titulo: string; descripcion?: string; className?: string; children: React.ReactNode };

/** Sección del formulario: tarjeta plana (borde de 1 px, editorial 0023) con título en mayúsculas y ayuda opcional. */
export function Tarjeta({ titulo, descripcion, className, children }: TarjetaProps) {
  const id = useId();
  return (
    <Card as="section" aria-labelledby={id} className={cn("flex flex-col gap-5 lg:p-6", className)}>
      <header className="flex flex-col gap-1">
        <h2 id={id} className="encabezado-seccion text-fg">
          {titulo}
        </h2>
        {descripcion && <p className="text-caption text-fg-secondary">{descripcion}</p>}
      </header>
      {children}
    </Card>
  );
}
