import { Check } from "lucide-react";
import { MiniTienda } from "./mini-tienda";
import { Sparkles } from "./sparkles";
import { Wordmark } from "./wordmark";
import type { Tema } from "../lib/rubros";

const BENEFICIOS = [
  "Gratis para empezar. Sin tarjeta.",
  "Pedidos directo a tu WhatsApp.",
  "Cobra con tarjeta y Yape cuando quieras.",
];

type BrandPanelProps = { nombre: string; slug: string; tema: Tema };

/** Panel de marca de desktop (OD1–OD4): la vista previa se arma en vivo desde el paso de datos. */
export function BrandPanel({ nombre, slug, tema }: BrandPanelProps) {
  return (
    <aside className="relative hidden flex-col gap-8 overflow-hidden bg-highlight px-16 py-12 lg:flex">
      <Wordmark />
      <h2 className="max-w-2xl font-display-hero text-h1 text-fg">Tu tienda online, lista en 2 minutos.</h2>
      <div className="flex items-center gap-8">
        <div className="relative">
          <MiniTienda nombre={nombre} slug={slug} tema={tema} />
          <Sparkles count={3} className="-inset-6" />
        </div>
        <ul className="flex flex-col gap-4">
          {BENEFICIOS.map((b) => (
            <li key={b} className="flex items-center gap-2.5 text-body font-semibold text-fg">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-surface shadow-card">
                <Check aria-hidden className="size-4 text-success" />
              </span>
              {b}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
