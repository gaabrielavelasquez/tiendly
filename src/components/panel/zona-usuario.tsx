"use client";

import Link from "next/link";
import { LogOut, Settings } from "lucide-react";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui";
import { HojaModal } from "@/features/afiliacion/components/hoja-modal";
import { useCerrarSesion } from "@/features/cuenta/hooks/use-cerrar-sesion";
import { cn } from "@/lib/cn";
import { useDuena } from "./sesion-panel";

type ZonaUsuarioProps = { nombre?: string; className?: string };
const fila = "flex min-h-11 w-full items-center gap-3 px-4 py-3 text-left text-body-sm text-fg hover:bg-sunken focus-visible:bg-sunken";

/** Cuenta con disclosure nativo: Configuración y cierre confirmado, sin borrar los datos de la tienda. */
export function ZonaUsuario({ nombre: propio, className }: ZonaUsuarioProps) {
  const deSesion = useDuena();
  const nombre = propio ?? deSesion;
  const menu = useRef<HTMLDetailsElement>(null);
  const boton = useRef<HTMLElement>(null);
  const s = useCerrarSesion();
  useEffect(() => {
    const fuera = (e: PointerEvent) => { if (menu.current?.open && !menu.current.contains(e.target as Node)) menu.current.open = false; };
    const escape = (e: KeyboardEvent) => { if (e.key === "Escape" && menu.current?.open) { menu.current.open = false; boton.current?.focus(); } };
    document.addEventListener("pointerdown", fuera);
    document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", fuera); document.removeEventListener("keydown", escape); };
  }, []);
  const cerrarHoja = () => { s.cerrar(); if (!s.saliendo) requestAnimationFrame(() => boton.current?.focus()); };
  return (
    <>
      <details ref={menu} className={cn("relative z-30 shrink-0", className)}>
        <summary ref={boton} aria-label={`Tu cuenta${nombre ? `, ${nombre}` : ""}`} className="relative flex size-12 cursor-pointer list-none items-center justify-center rounded-button transition-colors hover:bg-sunken active:scale-98 [&::-webkit-details-marker]:hidden">
          <span aria-hidden className="flex size-9 items-center justify-center rounded-full bg-selected font-display-title text-body-sm text-on-selected shadow-card">{nombre.charAt(0).toUpperCase() || "T"}</span>
        </summary>
        <nav aria-label="Opciones de tu cuenta" className="absolute top-full right-0 z-30 w-56 max-w-[calc(100vw-var(--spacing)*8)] divide-y divide-line-subtle overflow-hidden rounded-card bg-surface shadow-overlay">
          <Link href="/panel/configuracion" className={fila} onClick={() => { if (menu.current) menu.current.open = false; }}><Settings aria-hidden strokeWidth={1.5} className="size-4 shrink-0 text-icon" />Configuración</Link>
          <button type="button" className={fila} onClick={() => { if (menu.current) menu.current.open = false; s.abrir(); }}><LogOut aria-hidden strokeWidth={1.5} className="size-4 shrink-0 text-icon" />Cerrar sesión</button>
        </nav>
      </details>
      <HojaModal titulo="Cerrar sesión" subtitulo="Vuelve cuando quieras" abierto={s.abierto} cerrar={cerrarHoja} ocupado={s.saliendo}>
        <p className="text-body text-fg-secondary">Volverás al registro. Los datos de tu tienda se conservan.</p>
        {s.error && <p role="alert" className="mt-4 text-body-sm text-error">{s.error}</p>}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button autoFocus data-foco-inicial variant="secondary" disabled={s.saliendo} onClick={cerrarHoja}>Seguir en la tienda</Button>
          <Button loading={s.saliendo} disabled={s.saliendo} onClick={s.confirmar}>{s.saliendo ? "Cerrando sesión…" : "Sí, cerrar sesión"}</Button>
        </div>
      </HojaModal>
    </>
  );
}
