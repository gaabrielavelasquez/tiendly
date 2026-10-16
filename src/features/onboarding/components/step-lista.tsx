"use client";

import { Check } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui";
import { MiniTienda } from "./mini-tienda";
import { Sparkles } from "./sparkles";
import { useOnboarding } from "../hooks/use-onboarding";
import { EXPLICACION_TEMA, TEMA_INICIAL } from "../lib/rubros";

/** O4 / OD4 · Celebración. Móvil muestra la mini tienda; desktop, el sello de éxito (la tienda ya está a la izquierda). */
export function StepLista() {
  const router = useRouter();
  const reduce = useReducedMotion();
  const { state } = useOnboarding();
  const [yendo, setYendo] = useState(false);
  const entrada = reduce ? false : { opacity: 0, scale: 0.85, y: 12 };

  return (
    <div className="flex flex-1 flex-col items-center gap-6 text-center lg:items-start lg:text-left">
      <div className="relative mt-auto flex justify-center px-10 py-6 lg:hidden">
        <motion.div initial={entrada} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ type: "spring", stiffness: 220, damping: 20 }}>
          <MiniTienda nombre={state.nombre} slug={state.slug} tema={TEMA_INICIAL} className="shadow-celebration" />
        </motion.div>
        <Sparkles />
      </div>
      <div className="relative hidden lg:block">
        <motion.div
          initial={entrada}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
          className="flex size-18 items-center justify-center rounded-full bg-success-surface shadow-celebration"
        >
          <Check aria-hidden className="size-9 text-success" />
        </motion.div>
        <Sparkles count={3} className="-inset-8" />
      </div>
      <header className="flex flex-col gap-2">
        <h1 className="font-display-hero text-h1">¡Tu tienda está lista!</h1>
        <p className="text-body text-fg-secondary">{EXPLICACION_TEMA}</p>
      </header>
      <Button
        className="mt-auto lg:mt-2"
        block
        loading={yendo}
        onClick={() => {
          setYendo(true);
          router.push("/panel");
        }}
      >
        Ir a mi panel
      </Button>
    </div>
  );
}
