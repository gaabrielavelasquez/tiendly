"use client";

import { Ellipsis } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";
import { cn } from "@/lib/cn";
import { motionTokens } from "@/styles/tokens";
import { useBarraInferiorOculta } from "./barra-oculta";
import { esActivo, ITEMS } from "./panel-nav";

const transicion = { duration: motionTokens.durationFast, ease: [...motionTokens.easing] as [number, number, number, number] };
const PRINCIPALES = ["/panel", "/panel/pedidos", "/panel/productos", "/panel/mi-tienda"];
const principales = ITEMS.filter((i) => PRINCIPALES.includes(i.href));
const resto = ITEMS.filter((i) => !PRINCIPALES.includes(i.href));
/** Subpáginas (detalle, edición, Pagos, Entregas, cupón): tienen "Volver" arriba y, varias, su barra de acciones abajo. */
const sinBarra = (path: string) => /^\/panel\/(pedidos|productos|configuracion|cupones)\/.+/.test(path);
const tab = "flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 text-label transition-colors";

/**
 * Barra inferior del panel en móvil (decisión 0029): Inicio, Pedidos, Productos, Mi tienda y "Más"
 * (Cupones y Configuración). Activo en text/primary (sin cobalto, 0019). Desde 1024 px manda la barra lateral.
 */
export function TabBar() {
  const path = usePathname();
  const [mas, setMas] = useState(false);
  const reduce = useReducedMotion();
  const masActivo = resto.some((i) => esActivo(i.href, path));

  useEffect(() => {
    if (!mas) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMas(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mas]);

  const oculta = useBarraInferiorOculta();
  if (sinBarra(path) || oculta) return null;
  return (
    <>
      {/* Reserva el alto de la barra (56 px + borde) más la zona segura de iPhone, para que nunca tape contenido (0031). */}
      <div aria-hidden className="box-content h-16 pb-[env(safe-area-inset-bottom)] lg:hidden" />
      <AnimatePresence>
        {mas && (
          <div className="fixed inset-0 z-30 lg:hidden">
            <motion.div aria-hidden className="absolute inset-0 bg-scrim" onClick={() => setMas(false)} initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={reduce ? undefined : { opacity: 0 }} transition={transicion} />
            <motion.nav
              id="menu-mas"
              aria-label="Más opciones del panel"
              className="absolute inset-x-0 bottom-14 flex flex-col gap-1 border-t border-line-subtle bg-surface p-3 shadow-overlay"
              initial={reduce ? false : { y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={reduce ? undefined : { y: 16, opacity: 0 }}
              transition={transicion}
            >
              {resto.map(({ href, label, icon: Icon }) => (
                <Link key={href} href={href} onClick={() => setMas(false)} aria-current={esActivo(href, path) ? "page" : undefined} className={cn("flex h-12 items-center gap-3 rounded-theme px-3 text-body-sm", esActivo(href, path) ? "bg-sunken font-bold text-fg" : "text-fg-secondary hover:bg-sunken")}>
                  <Icon aria-hidden strokeWidth={1.6} className="size-6 text-icon" />
                  {label}
                </Link>
              ))}
            </motion.nav>
          </div>
        )}
      </AnimatePresence>
      <nav aria-label="Panel" className="fixed inset-x-0 bottom-0 z-40 flex border-t border-line-subtle bg-surface pb-[env(safe-area-inset-bottom)] lg:hidden">
        {principales.map(({ href, label, icon: Icon }) => {
          const activo = esActivo(href, path);
          return (
            <Link key={href} href={href} aria-current={activo ? "page" : undefined} className={cn(tab, activo ? "font-bold text-fg" : "text-fg-secondary")}>
              <Icon aria-hidden strokeWidth={activo ? 2 : 1.6} className="size-6" />
              {label}
            </Link>
          );
        })}
        <button type="button" aria-expanded={mas} aria-controls="menu-mas" onClick={() => setMas((v) => !v)} className={cn(tab, mas || masActivo ? "font-bold text-fg" : "text-fg-secondary")}>
          <Ellipsis aria-hidden strokeWidth={1.6} className="size-6" />
          Más
        </button>
      </nav>
    </>
  );
}
