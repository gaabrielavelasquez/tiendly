"use client";

import { Archive, Copy, Pencil } from "lucide-react";
import Link from "next/link";
import { Pressable } from "@/components/motion/pressable";
import { cn } from "@/lib/cn";

type AccionesFilaProps = { id: string; nombre: string; onDuplicar: () => void; onArchivar: () => void; className?: string };

const boton =
  "relative flex size-9 items-center justify-center rounded-theme text-icon transition-colors hover:bg-sunken hover:text-fg after:absolute after:-inset-1 after:content-['']";

/**
 * Acciones secundarias de la fila (editar, duplicar, archivar). Con mouse aparecen al pasar por la
 * fila o al enfocarla con teclado; en pantallas táctiles (sin hover) se ven siempre.
 */
export function AccionesFila({ id, nombre, onDuplicar, onArchivar, className }: AccionesFilaProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-0.5 transition-opacity",
        "pointer-fine:opacity-0 pointer-fine:group-hover:opacity-100 pointer-fine:group-focus-within:opacity-100",
        className,
      )}
    >
      <Link href={`/panel/productos/${id}`} aria-label={`Editar ${nombre}`} title="Editar" className={boton}>
        <Pencil aria-hidden strokeWidth={1.6} className="size-4" />
      </Link>
      <Pressable type="button" aria-label={`Duplicar ${nombre}`} title="Duplicar" onClick={onDuplicar} className={boton}>
        <Copy aria-hidden strokeWidth={1.6} className="size-4" />
      </Pressable>
      <Pressable type="button" aria-label={`Archivar ${nombre}`} title="Archivar" onClick={onArchivar} className={boton}>
        <Archive aria-hidden strokeWidth={1.6} className="size-4" />
      </Pressable>
    </div>
  );
}
