"use client";

import { AnimatePresence, motion } from "motion/react";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";
import { motionTokens } from "@/styles/tokens";
import { TiendaDatosPreview } from "./tienda-datos-preview";
import { useSlugCheck } from "../hooks/use-slug-check";
import { aSlug } from "../lib/slug";
import { ShellRegistro } from "./shell-registro";
import { StepCodigo } from "./step-codigo";
import { StepDatos } from "./step-datos";
import { StepLista } from "./step-lista";
import { StepRegistro } from "./step-registro";
import { OnboardingProvider, useOnboarding, type Paso } from "../hooks/use-onboarding";

const PASOS: Record<Exclude<Paso, "datos">, () => React.ReactElement> = {
  registro: StepRegistro,
  codigo: StepCodigo,
  lista: StepLista,
};

function Flujo() {
  const { state, linksEjemplo, baseTienda } = useOnboarding();
  const reduce = useReducedMotion();
  const slug = useSlugCheck(state.paso === "datos" ? state.nombre : "");
  const Paso = state.paso === "datos" ? null : PASOS[state.paso];
  const linkDatos = slug.estado === "listo" ? (slug.libre ? slug.slug : slug.sugerencia ?? slug.slug) : aSlug(state.nombre);
  const desplazamiento = reduce ? 0 : 16;

  const contenido = (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={state.paso}
        className="flex flex-1 flex-col"
        initial={{ opacity: 0, x: desplazamiento }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -desplazamiento }}
        transition={{ duration: motionTokens.durationFast * 1.5, ease: [...motionTokens.easing] as [number, number, number, number] }}
      >
        {Paso ? <Paso /> : <StepDatos slug={slug} />}
      </motion.div>
    </AnimatePresence>
  );
  return <ShellRegistro paso={state.paso} linksEjemplo={linksEjemplo} preview={state.paso === "datos" ? <TiendaDatosPreview nombre={state.nombre} url={`${baseTienda}${linkDatos || "tu-tienda"}`} rubros={state.rubros} /> : undefined}>{contenido}</ShellRegistro>;
}

/** Onboarding O1–O4 / OD1–OD4 (decisión 0013). Datos simulados hasta que exista el backend. */
export function OnboardingFlow({ linksEjemplo, baseTienda }: { linksEjemplo: string[]; baseTienda: string }) {
  return (
    <OnboardingProvider linksEjemplo={linksEjemplo} baseTienda={baseTienda}>
      <Flujo />
    </OnboardingProvider>
  );
}
