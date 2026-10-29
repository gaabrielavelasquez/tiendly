"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Button, buttonVariants } from "@/components/ui";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";
import { useCopiar } from "@/features/inicio/hooks/use-copiar";
import { whatsappCompartir } from "@/features/inicio/lib/format";
import { motionTokens } from "@/styles/tokens";
import { cn } from "@/lib/cn";
import { TituloAcceso } from "./titulo-acceso";
import { TiendaDatosPreview } from "./tienda-datos-preview";
import { useOnboarding } from "../hooks/use-onboarding";
import { EXPLICACION_TEMA } from "../lib/rubros";

/** Logro: la tienda propia es protagonista, halo acotado y entrada suave sin destellos. */
export function StepLista() {
  const { state, baseTienda } = useOnboarding();
  const reduce = useReducedMotion();
  const router = useRouter();
  const { estado, copiar } = useCopiar();
  const [yendo, setYendo] = useState(false);
  const url = `${baseTienda}${state.slug}`;
  return <div className="flex min-w-0 flex-col items-center gap-6 text-center">
    <TituloAcceso titulo="Tu tienda está lista." contexto="Empieza con tu primer producto." />
    <motion.div className="relative isolate w-full min-w-0 max-w-100" initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduce ? 0 : motionTokens.durationFast * 2, ease: [...motionTokens.easing] as [number, number, number, number] }}>
      <TiendaDatosPreview nombre={state.nombre} url={url} rubros={state.rubros} celebracion />
    </motion.div>
    <p className="text-body-sm text-pretty text-fg-secondary">{EXPLICACION_TEMA}</p>
    <div className="flex w-full flex-col gap-3">
      <Button block loading={yendo} disabled={yendo} onClick={() => { setYendo(true); router.push("/panel/productos/nuevo"); }}>Agregar mi primer producto</Button>
      <Link href="/panel" className={buttonVariants({ variant: "secondary", block: true })}>Ir a mi panel</Link>
    </div>
    <div className="flex w-full flex-wrap justify-center gap-x-6 gap-y-2">
      <Button variant="ghost" onClick={() => copiar(url)}>Copiar link</Button>
      <a href={whatsappCompartir(url)} target="_blank" rel="noopener noreferrer" className={cn(buttonVariants({ variant: "ghost" }))}>Compartir por WhatsApp</a>
    </div>
    <p role="status" className={cn("text-body-sm", estado === "error" ? "text-error" : "text-fg-secondary")}>{estado === "copiado" ? "Link copiado." : estado === "error" ? "No pudimos copiar el link. Puedes copiarlo desde la vista de tu tienda." : ""}</p>
  </div>;
}
