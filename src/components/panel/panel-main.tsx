import { cn } from "@/lib/cn";

/**
 * Contenedor de cada página del panel: márgenes de Figma (16 px móvil · 48 px desktop) y un halo
 * glow-sky que nace detrás del saludo para que el lienzo no quede plano.
 */
export function PanelMain({ className, children, ...rest }: React.HTMLAttributes<HTMLElement>) {
  return (
    <main className={cn("relative isolate mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 lg:px-12 lg:pt-10 lg:pb-16", className)} {...rest}>
      <div aria-hidden className="pointer-events-none absolute -top-40 -left-24 -z-10 h-112 w-3/4 bg-orb-sky lg:-left-32" />
      {children}
    </main>
  );
}
