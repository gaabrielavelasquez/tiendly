import { useId } from "react";
import { Card } from "@/components/ui";
import { cn } from "@/lib/cn";

type TarjetaProps = { titulo: string; descripcion?: string; className?: string; children: React.ReactNode };

/** Sección del formulario: tarjeta (12 px, borde nítido, elevation/card) con título y ayuda opcional. */
export function Tarjeta({ titulo, descripcion, className, children }: TarjetaProps) {
  const id = useId();
  return (
    <Card as="section" aria-labelledby={id} className={cn("flex flex-col gap-5 lg:p-6", className)}>
      <header className="flex flex-col gap-1">
        <h2 id={id} className="font-display-title text-body text-fg">
          {titulo}
        </h2>
        {descripcion && <p className="text-caption text-fg-secondary">{descripcion}</p>}
      </header>
      {children}
    </Card>
  );
}
