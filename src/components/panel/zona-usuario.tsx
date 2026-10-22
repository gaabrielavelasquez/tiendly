import Link from "next/link";
import { cn } from "@/lib/cn";

type ZonaUsuarioProps = { nombre: string; className?: string };

/**
 * Zona de cuenta: el avatar lleva a Configuración (Pagos, Entregas y Cuenta). Ocupa 48 × 48 aunque
 * el círculo sea chico (Botón ícono). Sin campana de avisos (decisión 0027).
 */
export function ZonaUsuario({ nombre, className }: ZonaUsuarioProps) {
  return (
    <Link
      href="/panel/configuracion"
      aria-label={`Tu cuenta, ${nombre}`}
      className={cn("relative flex size-12 items-center justify-center rounded-button transition-colors hover:bg-sunken active:scale-98", className)}
    >
      <span aria-hidden className="flex size-9 items-center justify-center rounded-full bg-selected font-display-title text-body-sm text-on-selected shadow-card">
        {nombre.charAt(0).toUpperCase()}
      </span>
    </Link>
  );
}
