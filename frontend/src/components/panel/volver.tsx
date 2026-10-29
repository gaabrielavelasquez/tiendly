import { ChevronLeft } from "lucide-react";
import Link from "next/link";

/** "‹ Configuración" arriba de una subpágina (Figma, módulos 2 y 3). Zona táctil de 44 px. */
export function Volver({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="-ml-2 flex min-h-11 w-fit items-center gap-1 rounded-theme px-2 text-body-sm font-semibold text-fg-secondary transition-colors hover:bg-sunken hover:text-fg">
      <ChevronLeft aria-hidden strokeWidth={1.6} className="size-5" />
      {children}
    </Link>
  );
}
