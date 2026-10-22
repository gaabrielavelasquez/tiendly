import { cn } from "@/lib/cn";

/** Icono en un círculo + nombre + "● Activo / Apagado / Sin activar" (Figma, cabecera de cada método). */
export function CabeceraMetodo({ icono, titulo, estado }: { icono: React.ReactNode; titulo: string; estado: "Activo" | "Apagado" | "Sin activar" | "Inactivo" }) {
  return (
    <span className="flex items-center gap-3">
      <span aria-hidden className="flex size-10 shrink-0 items-center justify-center rounded-full bg-sunken text-icon">
        {icono}
      </span>
      <span className="flex flex-col gap-0.5">
        <span className="text-body font-semibold text-fg">{titulo}</span>
        <span className={cn("flex items-center gap-1.5 text-caption font-normal", estado === "Activo" ? "text-success" : "text-fg-secondary")}>
          <span aria-hidden className={cn("size-1.5 rounded-full", estado === "Activo" ? "bg-success" : "bg-fg-tertiary")} />
          {estado}
        </span>
      </span>
    </span>
  );
}

/** Pie de las vistas: "Al pagar / Al comprar, tu cliente verá" (vista previa de la vitrina). */
export function VistaCliente({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section aria-label={titulo} className="flex flex-col gap-3 rounded-card bg-sunken p-4 lg:p-5">
      <h2 className="text-body-sm font-semibold text-fg">{titulo}</h2>
      {children}
    </section>
  );
}
