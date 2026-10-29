import type { LucideIcon } from "lucide-react";

/** Vacío o error de Pedidos: icono neutro sin círculo y un siguiente paso, siguiendo 0031. */
export function EstadoPedidos({ icon: Icon, title, description, action }: { icon: LucideIcon; title: string; description: string; action?: React.ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-3 px-5 py-10 text-center">
      <Icon aria-hidden strokeWidth={1.5} className="size-7 text-icon" />
      <h2 className="font-titulo-seccion text-h3 text-fg">{title}</h2>
      <p className="max-w-sm break-words text-body text-fg-secondary">{description}</p>
      {action}
    </div>
  );
}
