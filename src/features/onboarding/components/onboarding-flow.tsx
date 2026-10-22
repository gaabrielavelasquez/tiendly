"use client";

import { AnimatePresence, motion } from "motion/react";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";
import { motionTokens } from "@/styles/tokens";
import { OnboardingShell } from "./shell";
import { StepCodigo } from "./step-codigo";
import { StepDatos } from "./step-datos";
import { StepLista } from "./step-lista";
import { StepRegistro } from "./step-registro";
import { OnboardingProvider, useOnboarding, type Paso } from "../hooks/use-onboarding";
import { aSlug } from "../lib/slug";

const PASOS: Record<Paso, () => React.ReactElement> = {
  registro: StepRegistro,
  codigo: StepCodigo,
  datos: StepDatos,
  lista: StepLista,
};

function Flujo() {
  const { state } = useOnboarding();
  const reduce = useReducedMotion();
  const Paso = PASOS[state.paso];
  const desplazamiento = reduce ? 0 : 16;

  return (
    <OnboardingShell nombre={state.nombre} slug={state.slug || aSlug(state.nombre)}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={state.paso}
          className="flex flex-1 flex-col"
          initial={{ opacity: 0, x: desplazamiento }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -desplazamiento }}
          transition={{ duration: motionTokens.durationFast * 1.5, ease: [...motionTokens.easing] as [number, number, number, number] }}
        >
          <Paso />
        </motion.div>
      </AnimatePresence>
    </OnboardingShell>
  );
}

/** Onboarding O1–O4 / OD1–OD4 (decisión 0013). Datos simulados hasta que exista el backend. */
export function OnboardingFlow() {
  return (
    <OnboardingProvider>
      <Flujo />
    </OnboardingProvider>
  );
}
