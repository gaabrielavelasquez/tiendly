import { RefreshCw, Tag, Truck, type LucideIcon } from "lucide-react";

const FILAS: { icono: LucideIcon; titulo: string; texto: string }[] = [
  { icono: Truck, titulo: "Envío en Lima por motorizado", texto: "De S/ 10 a S/ 15 según el distrito. Lo pagado antes de las 11 a. m. sale el mismo día." },
  { icono: Tag, titulo: "Yape, Plin o transferencia", texto: "Coordinamos el pago por WhatsApp antes de despachar." },
  { icono: RefreshCw, titulo: "Cambios dentro de 7 días", texto: "Si la talla no te queda, la cambiamos sin costo." },
];

/** Lo que el cliente pregunta antes de comprar: envío, pago y cambios (Figma). */
export function Beneficios() {
  return (
    <ul className="flex flex-col gap-4 border-t border-line-subtle pt-6">
      {FILAS.map(({ icono: Icono, titulo, texto }) => (
        <li key={titulo} className="flex gap-3">
          <Icono aria-hidden strokeWidth={1.6} className="mt-0.5 size-4 shrink-0 text-icon" />
          <div className="flex flex-col gap-0.5">
            <span className="text-caption font-semibold text-fg">{titulo}</span>
            <span className="text-caption text-fg-secondary">{texto}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
