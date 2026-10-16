import { Bell } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/cn";

type ZonaUsuarioProps = { nombre: string; avisos: number; className?: string };

const tocable = "relative flex size-12 items-center justify-center rounded-button transition-colors hover:bg-sunken active:scale-98";

/**
 * Zona de cuenta: avisos + avatar. Cada uno ocupa 48 × 48 aunque el ícono sea chico (Botón ícono).
 * El punto de avisos va en indicator/fill y siempre acompañado de texto para lector de pantalla.
 */
export function ZonaUsuario({ nombre, avisos, className }: ZonaUsuarioProps) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <Link href="/panel/avisos" className={tocable} aria-label={avisos ? `Avisos: ${avisos} sin leer` : "Avisos"}>
        <Bell aria-hidden strokeWidth={1.6} className="size-6 text-icon" />
        {avisos > 0 && <span aria-hidden className="absolute top-3 right-3 size-2 rounded-full bg-indicator ring-2 ring-surface" />}
      </Link>
      <Link href="/panel/configuracion" className={tocable} aria-label={`Tu cuenta, ${nombre}`}>
        <span
          aria-hidden
          className="flex size-9 items-center justify-center rounded-full bg-selected font-display-title text-body-sm text-on-selected shadow-soft"
        >
          {nombre.charAt(0).toUpperCase()}
        </span>
      </Link>
    </div>
  );
}
