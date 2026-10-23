"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ZonaUsuario } from "@/components/panel";
import { Button, buttonVariants } from "@/components/ui";
import { cn } from "@/lib/cn";

const VOLVER = "/panel/prototipo/productos";
const cancelar = cn(buttonVariants({ variant: "ghost" }), "transition active:scale-98");

/**
 * PROTOTIPO · Barra de guardar (ronda 2). Desktop: fija arriba, como hoy. Móvil: "Guardar producto" fijo abajo y
 * SIEMPRE visible: va por encima de la barra de pestañas (z-45), que en el formulario no hace falta. En la implementación
 * real, la barra de pestañas se oculta en crear/editar producto (hoy tapa la barra de BarraAcciones).
 */
export function BarraGuardar({ titulo }: { titulo: string }) {
  return (
    <>
      <div className="sticky top-0 z-20 -mx-4 hidden items-center gap-4 border-b border-line-subtle bg-surface/80 px-4 py-3 backdrop-blur-md lg:-mx-12 lg:flex lg:px-12">
        <Link href={VOLVER} aria-label="Volver a Productos" className="flex size-9 items-center justify-center rounded-theme text-icon transition-colors hover:bg-sunken">
          <ArrowLeft aria-hidden strokeWidth={1.5} className="size-5" />
        </Link>
        <h1 className="font-display-title text-h3 tracking-tight text-fg">{titulo}</h1>
        <div className="ml-auto flex items-center gap-2">
          <Link href={VOLVER} className={cancelar}>Cancelar</Link>
          <Button type="submit">Guardar producto</Button>
          <span aria-hidden className="mx-2 h-6 w-px bg-line-subtle" />
          <ZonaUsuario />
        </div>
      </div>

      <header className="flex items-center gap-2 lg:hidden">
        <Link href={VOLVER} aria-label="Volver a Productos" className="-ml-2 flex size-11 items-center justify-center rounded-theme text-icon">
          <ArrowLeft aria-hidden strokeWidth={1.5} className="size-5" />
        </Link>
        <h1 className="font-display-title text-h2 tracking-tight text-fg">{titulo}</h1>
      </header>
      <div className="fixed inset-x-0 bottom-0 z-45 flex gap-2 border-t border-line-subtle bg-surface px-4 pt-3 pb-[max(calc(var(--spacing)*3),env(safe-area-inset-bottom))] lg:hidden">
        <Link href={VOLVER} className={cn(cancelar, "flex-1")}>Cancelar</Link>
        <Button type="submit" className="flex-[2]">Guardar producto</Button>
      </div>
    </>
  );
}
