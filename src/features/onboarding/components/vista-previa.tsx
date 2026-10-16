"use client";

import { Check, ShoppingBag, type LucideIcon } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";
import { MiniTienda } from "./mini-tienda";
import { Sparkles } from "./sparkles";
import { TEMA_INICIAL } from "../lib/rubros";

type FlotanteProps = { icon: LucideIcon; tono: "neutral" | "success"; texto: string; className: string; desfase: number };

/** Aviso de vidrio que flota despacio: hace que la vista previa se sienta viva. Quieto si se reduce el movimiento. */
function Flotante({ icon: Icon, tono, texto, className, desfase }: FlotanteProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      aria-hidden
      className={cn("glass absolute flex h-11 items-center gap-2 rounded-chip pr-4 pl-1.5 text-body-sm font-semibold whitespace-nowrap text-fg", className)}
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={reduce ? { opacity: 1 } : { opacity: 1, y: [0, -6, 0] }}
      // Movimiento ambiental: lento y continuo a propósito (no es feedback de interacción).
      transition={reduce ? undefined : { opacity: { delay: desfase }, y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: desfase } }}
    >
      <span className={cn("flex size-8 items-center justify-center rounded-full", tono === "success" ? "bg-success-surface text-success" : "bg-sunken text-icon")}>
        <Icon strokeWidth={2} className="size-4" />
      </span>
      {texto}
    </motion.div>
  );
}

/** Vista previa en vivo del panel de marca: la mini tienda sobre una plataforma de vidrio con halos. */
export function VistaPrevia({ nombre, slug }: { nombre: string; slug: string }) {
  return (
    <div className="relative shrink-0">
      <div aria-hidden className="absolute -inset-16 -z-10 bg-orb-sky" />
      <div className="glass rounded-xl p-4">
        <MiniTienda nombre={nombre} slug={slug} tema={TEMA_INICIAL} />
      </div>
      <Flotante icon={ShoppingBag} tono="neutral" texto="Nuevo pedido · S/ 180" className="-top-6 -right-12" desfase={0.3} />
      <Flotante icon={Check} tono="success" texto="Pagado con Yape" className="-bottom-6 -left-10" desfase={0.9} />
      <Sparkles count={3} className="-inset-8" />
    </div>
  );
}
