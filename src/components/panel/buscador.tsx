"use client";

import { Search, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { useAtajoBusqueda } from "./use-atajo-busqueda";

type BuscadorProps = {
  id: string;
  /** Etiqueta para lector de pantalla (termina sin punto: es un nombre). */
  etiqueta: string;
  placeholder: string;
  valor: string;
  onCambio: (v: string) => void;
  className?: string;
};

/** Buscador de listas del panel. ⌘K / Ctrl K lo enfoca desde cualquier parte de la página. */
export function Buscador({ id, etiqueta, placeholder, valor, onCambio, className }: BuscadorProps) {
  const { ref, pista } = useAtajoBusqueda<HTMLInputElement>();
  return (
    <div
      className={cn(
        "flex h-10 items-center gap-2 rounded-button border border-line-strong bg-surface px-3 transition",
        "outline-2 outline-offset-2 outline-transparent focus-within:outline-focus",
        className,
      )}
    >
      <Search aria-hidden strokeWidth={1.6} className="size-4 shrink-0 text-icon" />
      <label htmlFor={id} className="sr-only">
        {etiqueta}
      </label>
      <input
        ref={ref}
        id={id}
        type="search"
        value={valor}
        onChange={(e) => onCambio(e.target.value)}
        onKeyDown={(e) => e.key === "Escape" && onCambio("")}
        placeholder={placeholder}
        autoComplete="off"
        className="h-full min-w-0 flex-1 bg-transparent text-body text-fg outline-none placeholder:text-fg-tertiary [&::-webkit-search-cancel-button]:hidden"
      />
      {valor ? (
        <button
          type="button"
          aria-label="Borrar búsqueda"
          onClick={() => onCambio("")}
          className="relative flex size-6 items-center justify-center rounded-sm text-icon hover:bg-sunken after:absolute after:-inset-2.5 after:content-['']"
        >
          <X aria-hidden strokeWidth={1.6} className="size-4" />
        </button>
      ) : (
        <kbd className="hidden h-6 items-center rounded-sm border border-line-subtle bg-sunken px-1.5 font-body text-label text-fg-secondary lg:flex">
          {pista}
        </kbd>
      )}
    </div>
  );
}
