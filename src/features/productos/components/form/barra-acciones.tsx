"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ZonaUsuario } from "@/components/panel";
import { Button, buttonVariants } from "@/components/ui";
import { cn } from "@/lib/cn";

type BarraProps = { titulo: string; sinGuardar: boolean; guardando: boolean };

const cancelar = cn(buttonVariants({ variant: "ghost" }), "transition active:scale-98");

/**
 * Barra de acciones. Desktop: fija arriba, con volver, título y botones. Móvil: el título arriba (no fijo)
 * y los botones fijos abajo, al alcance del pulgar. "Guardar producto" es el único CTA cobalto.
 */
export function BarraAcciones({ titulo, sinGuardar, guardando }: BarraProps) {
  const estado = sinGuardar && <span className="text-caption text-fg-secondary">Cambios sin guardar</span>;
  return (
    <>
      <div className="sticky top-0 z-20 -mx-4 hidden items-center gap-4 border-b border-line-subtle bg-surface/80 px-4 py-3 backdrop-blur-md lg:-mx-12 lg:flex lg:px-12">
        <Link href="/panel/productos" aria-label="Volver a Productos" className="flex size-9 items-center justify-center rounded-theme text-icon transition-colors hover:bg-sunken">
          <ArrowLeft aria-hidden strokeWidth={1.6} className="size-5" />
        </Link>
        <h1 className="font-display-title text-h3 tracking-tight text-fg">{titulo}</h1>
        {estado}
        <div className="ml-auto flex items-center gap-2">
          <Link href="/panel/productos" className={cancelar}>
            Cancelar
          </Link>
          <Button type="submit" loading={guardando}>
            {guardando ? "Guardando…" : "Guardar producto"}
          </Button>
          {/* Misma zona de cuenta que el resto del panel (avatar → Configuración). */}
          <span aria-hidden className="mx-2 h-6 w-px bg-line-subtle" />
          <ZonaUsuario />
        </div>
      </div>

      <header className="flex items-center gap-2 lg:hidden">
        <Link href="/panel/productos" aria-label="Volver a Productos" className="-ml-2 flex size-11 items-center justify-center rounded-theme text-icon">
          <ArrowLeft aria-hidden strokeWidth={1.6} className="size-5" />
        </Link>
        <div className="flex flex-col">
          <h1 className="font-display-title text-h2 tracking-tight text-fg">{titulo}</h1>
          {estado}
        </div>
      </header>
      <div className="fixed inset-x-0 bottom-0 z-20 flex gap-2 border-t border-line-subtle bg-surface/95 px-4 pt-3 pb-[max(calc(var(--spacing)*3),env(safe-area-inset-bottom))] backdrop-blur-md lg:hidden">
        <Link href="/panel/productos" className={cn(cancelar, "flex-1")}>
          Cancelar
        </Link>
        <Button type="submit" loading={guardando} className="flex-2">
          {guardando ? "Guardando…" : "Guardar producto"}
        </Button>
      </div>
    </>
  );
}
