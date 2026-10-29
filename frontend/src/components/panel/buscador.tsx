"use client";

import { Search, X } from "lucide-react";
import { cn } from "@/lib/cn";

type BuscadorProps = {
  id: string;
  /** Etiqueta para lector de pantalla (termina sin punto: es un nombre). */
  etiqueta: string;
  placeholder: string;
  valor: string;
  onCambio: (v: string) => void;
  className?: string;
};

/** Buscador de listas del panel. Escape lo borra. Sin atajo de teclado global (decisión 0027). */
export function Buscador({ id, etiqueta, placeholder, valor, onCambio, className }: BuscadorProps) {
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
        id={id}
        type="search"
        value={valor}
        onChange={(e) => onCambio(e.target.value)}
        onKeyDown={(e) => e.key === "Escape" && onCambio("")}
        placeholder={placeholder}
        autoComplete="off"
        className="h-full min-w-0 flex-1 bg-transparent text-body text-fg outline-none placeholder:text-fg-tertiary [&::-webkit-search-cancel-button]:hidden"
      />
      {valor && (
        <button
          type="button"
          aria-label="Borrar búsqueda"
          onClick={() => onCambio("")}
          className="relative flex size-6 items-center justify-center rounded-theme text-icon hover:bg-sunken after:absolute after:-inset-2.5 after:content-['']"
        >
          <X aria-hidden strokeWidth={1.6} className="size-4" />
        </button>
      )}
    </div>
  );
}
