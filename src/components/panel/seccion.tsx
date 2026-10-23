import { cn } from "@/lib/cn";
import { EncabezadoSeccion } from "./encabezado-seccion";

/** Contenedor sereno de 0031: blanco, radio de tarjeta y anillo fino (`elevation/container`), sin borde extra. */
export const CONTENEDOR = "rounded-card bg-surface shadow-contenedor";

type SeccionProps = { id: string; titulo: string; descripcion?: string; accion?: React.ReactNode; className?: string; children: React.ReactNode };

/**
 * Sección de un formulario o detalle (decisión 0031): el título va FUERA del contenedor (EncabezadoSeccion, con su
 * acción silenciosa a la derecha) y adentro, solo el contenido. Reemplaza a TarjetaSeccion en las pantallas con el pase.
 */
export function Seccion({ id, titulo, descripcion, accion, className, children }: SeccionProps) {
  return (
    <section aria-labelledby={id} className={cn("flex flex-col gap-3", className)}>
      <div className="flex flex-col gap-1">
        <EncabezadoSeccion id={id} titulo={titulo} accion={accion} />
        {descripcion && <p className="text-body-sm text-fg-secondary">{descripcion}</p>}
      </div>
      <div className={cn(CONTENEDOR, "flex flex-col gap-5 p-5 lg:p-6")}>{children}</div>
    </section>
  );
}
