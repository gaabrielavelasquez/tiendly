import { EncabezadoSeccion } from "@/components/panel";
import { Badge } from "@/components/ui";
import { cn } from "@/lib/cn";
import { formatoSoles } from "@/lib/formato";
import { descuento, vigencia, type ConPrecio } from "../lib/oferta";

/** Contenedor sereno de 0031: blanco, radio de tarjeta y anillo fino, sin borde extra. */
export const CONTENEDOR = "rounded-card bg-surface shadow-contenedor";

type SeccionProps = { id: string; titulo: string; descripcion?: string; accion?: React.ReactNode; className?: string; children: React.ReactNode };

/** Sección de 0031: el título va FUERA del contenedor; dentro, solo el contenido. */
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

type PrecioProps = { p: ConPrecio; hoy: string; tamano?: "lista" | "ficha"; conVigencia?: boolean; className?: string };

/**
 * Precio con oferta (0034): el nuevo, el de antes tachado y la etiqueta "−26 %" (Badge existente, tono de selección:
 * carbón o el del tema). Fuera de fechas se ve el precio normal, sin tachado. Montos serenos (0031): peso Regular/Medium.
 * `conVigencia` solo en el panel: la tienda no muestra fechas (0034, ronda 2).
 */
export function PrecioOferta({ p, hoy, tamano = "lista", conVigencia = false, className }: PrecioProps) {
  const v = vigencia(p, hoy);
  const activa = !!p.precioAntes && p.precioAntes > p.precio && (!v || !/^(Empieza|Terminó)/.test(v.texto));
  const pct = activa ? descuento(p.precio, p.precioAntes) : 0;
  const precio = activa || !p.precioAntes ? p.precio : Math.max(p.precio, p.precioAntes);
  return (
    <span className={cn("flex flex-col gap-1", className)}>
      <span className="flex flex-wrap items-center gap-x-2 gap-y-1 tabular-nums">
        <span className={cn("font-medium text-fg", tamano === "ficha" ? "text-body-lg" : "text-body-sm")}>{formatoSoles(precio)}</span>
        {activa && (
          <>
            <span className={cn("text-fg-tertiary line-through", tamano === "ficha" ? "text-body-sm" : "text-caption")}>
              <span className="sr-only">Precio anterior: </span>
              {formatoSoles(p.precioAntes!)}
            </span>
            <Badge tone="selected" className="h-5 px-1.5 tabular-nums">
              <span className="sr-only">Descuento de </span>−{pct} %
            </Badge>
          </>
        )}
      </span>
      {conVigencia && v && activa && <span className={cn("text-caption", v.urgente ? "text-warning" : "text-fg-secondary")}>{v.texto}.</span>}
    </span>
  );
}

/** "Programada" (0034, ronda 2): estado de una oferta que todavía no empieza. Badge neutro: es un estado, no una alerta. */
export function BadgeProgramada() {
  return <Badge className="h-5 px-1.5">Programada</Badge>;
}
