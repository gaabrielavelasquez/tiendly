import { Check } from "lucide-react";
import { VistaPrevia } from "./vista-previa";
import { Wordmark } from "./wordmark";

const BENEFICIOS = [
  "Gratis para empezar. Sin tarjeta.",
  "Pedidos directo a tu WhatsApp.",
  "Cobra con tarjeta y Yape cuando quieras.",
];

type BrandPanelProps = { nombre: string; slug: string };

/**
 * Panel de marca de desktop (OD1–OD4). Composición centrada en vertical (sin aire muerto abajo),
 * halos radiales de fondo y la vista previa en vivo sobre vidrio.
 */
export function BrandPanel({ nombre, slug }: BrandPanelProps) {
  return (
    <aside className="relative isolate hidden flex-col overflow-hidden bg-highlight px-16 py-12 lg:flex">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-1/4 -right-1/4 size-3/4 bg-orb-sky" />
        <div className="absolute -bottom-1/3 -left-1/4 size-3/4 bg-orb-lilac" />
        <div className="absolute right-0 bottom-0 size-1/2 bg-orb-warm" />
      </div>
      <Wordmark />
      <div className="flex flex-1 flex-col justify-center gap-14 py-10">
        <h2 className="max-w-xl font-display-hero text-display tracking-tight text-fg">Tu tienda online, lista en 2 minutos.</h2>
        <div className="flex items-center gap-16 pl-6">
          <VistaPrevia nombre={nombre} slug={slug} />
          <ul className="flex flex-col gap-5">
            {BENEFICIOS.map((b) => (
              <li key={b} className="flex items-center gap-3 text-body font-semibold text-fg">
                <span className="glass flex size-8 shrink-0 items-center justify-center rounded-full">
                  <Check aria-hidden strokeWidth={2} className="size-4 text-success" />
                </span>
                {b}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
}
