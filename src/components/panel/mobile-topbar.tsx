"use client";

import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";
import { useEffect, useState } from "react";
import { Pressable } from "@/components/motion/pressable";
import { motionTokens } from "@/styles/tokens";
import { PanelNav } from "./panel-nav";
import { ZonaUsuario } from "./zona-usuario";

const transicion = { duration: motionTokens.durationFast, ease: [...motionTokens.easing] as [number, number, number, number] };
const iconButton = "flex size-12 items-center justify-center rounded-button text-icon transition-colors hover:bg-sunken";

type MobileTopbarProps = { nombreTienda: string; duena: string; avisos: number };

/** Barra superior del panel en móvil: menú, nombre de la tienda y zona de cuenta. El menú se abre como panel lateral. */
export function MobileTopbar({ nombreTienda, duena, avisos }: MobileTopbarProps) {
  const [abierto, setAbierto] = useState(false);
  const reduce = useReducedMotion();
  const cerrar = () => setAbierto(false);

  useEffect(() => {
    if (!abierto) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setAbierto(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [abierto]);

  return (
    <>
      <header className="flex items-center gap-2 border-b border-line-subtle bg-surface px-2 py-2 lg:hidden">
        <Pressable type="button" aria-label="Abrir menú" aria-expanded={abierto} onClick={() => setAbierto(true)} className={iconButton}>
          <Menu aria-hidden strokeWidth={1.6} className="size-6" />
        </Pressable>
        <p className="flex-1 truncate text-body font-bold text-fg">{nombreTienda}</p>
        <ZonaUsuario nombre={duena} avisos={avisos} />
      </header>

      <AnimatePresence>
        {abierto && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <motion.div
              aria-hidden
              className="absolute inset-0 bg-scrim"
              onClick={cerrar}
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduce ? undefined : { opacity: 0 }}
              transition={transicion}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Menú del panel"
              className="absolute inset-y-0 left-0 flex w-62 flex-col gap-6 bg-surface px-4 py-6 shadow-overlay"
              initial={reduce ? false : { x: "-100%" }}
              animate={{ x: 0 }}
              exit={reduce ? undefined : { x: "-100%" }}
              transition={transicion}
            >
              <div className="flex items-center justify-between">
                <p className="font-display-hero text-h2 tracking-tight text-accent">tiendly</p>
                <Pressable type="button" aria-label="Cerrar menú" onClick={cerrar} autoFocus className={iconButton}>
                  <X aria-hidden strokeWidth={1.6} className="size-6" />
                </Pressable>
              </div>
              <PanelNav onNavigate={cerrar} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
