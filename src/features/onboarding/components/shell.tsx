import { BrandPanel } from "./brand-panel";
import type { Tema } from "../lib/rubros";

type ShellProps = { nombre: string; slug: string; tema: Tema; children: React.ReactNode };

/** Móvil: una columna (O1–O4). Desktop: panel de marca + tarjeta de 480 px (OD1–OD4). */
export function OnboardingShell({ nombre, slug, tema, children }: ShellProps) {
  return (
    <div className="min-h-dvh bg-page lg:grid lg:grid-cols-[5fr_4fr]">
      <BrandPanel nombre={nombre} slug={slug} tema={tema} />
      <main className="relative isolate flex min-h-dvh flex-col px-6 py-6 lg:items-center lg:justify-center lg:px-12 lg:py-12">
        {/* Halo glow-sky (DESIGN.md §1): profundidad sin bordes duros; se desvanece hacia el lienzo. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-80 bg-glow-sky [mask-image:linear-gradient(to_bottom,black,transparent)] lg:h-full"
        />
        <div className="flex w-full flex-1 flex-col lg:max-w-120 lg:flex-none lg:rounded-card lg:bg-surface lg:p-10 lg:shadow-card">
          {children}
        </div>
      </main>
    </div>
  );
}
