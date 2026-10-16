import { cn } from "@/lib/cn";

/** Contenedor de cada página del panel: márgenes de Figma (16 px móvil · 48 px desktop). */
export function PanelMain({ className, ...rest }: React.HTMLAttributes<HTMLElement>) {
  return <main className={cn("mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 lg:px-12 lg:pt-10 lg:pb-16", className)} {...rest} />;
}
