import { CONTENEDOR, EncabezadoSeccion } from "@/components/panel";
import { cn } from "@/lib/cn";

/** Icono neutro sin contenedor + nombre + "● Activo / Apagado / Sin activar" (Figma, cabecera de cada método). */
export function CabeceraMetodo({ icono, titulo, estado }: { icono: React.ReactNode; titulo: string; estado: "Activo" | "En revisión" | "Apagado" | "Sin activar" | "Inactivo" }) {
  const verde = estado === "Activo" || estado === "En revisión"; // Figma A7: «● En revisión» en verde
  return (
    <span className="flex items-center gap-3">
      <span aria-hidden className="shrink-0 text-icon">
        {icono}
      </span>
      <span className="flex flex-col gap-0.5">
        <span className="text-body font-semibold text-fg">{titulo}</span>
        <span className={cn("flex items-center gap-1.5 text-caption font-normal", verde ? "text-success" : "text-fg-secondary")}>
          <span aria-hidden className={cn("size-1.5 rounded-full", verde ? "bg-success" : "bg-fg-tertiary")} />
          {estado}
        </span>
      </span>
    </span>
  );
}

/** Pie de las vistas: "Al pagar / Al comprar, tu cliente verá" (vista previa de la vitrina). */
export function VistaCliente({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section aria-label={titulo} className="flex min-w-0 flex-col gap-3">
      <EncabezadoSeccion id={titulo.startsWith("Al pagar") ? "preview-pagos" : "preview-entregas"} titulo={titulo} />
      <div className={`${CONTENEDOR} flex min-w-0 flex-col gap-3 p-5`}>{children}</div>
    </section>
  );
}
