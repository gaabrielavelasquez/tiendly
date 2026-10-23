"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { RubroId } from "../lib/rubros";

export type Paso = "registro" | "codigo" | "datos" | "lista";
export type Modo = "crear" | "ingresar";

export type OnboardingState = {
  paso: Paso;
  modo: Modo;
  celular: string;
  nombre: string;
  slug: string;
  rubros: RubroId[];
  celularVentas: string;
  /** Nombre de pila que da Google al entrar con Google (todavía no conectado). Sin él, el saludo es "¡Hola! 👋". */
  nombreGoogle?: string;
};

const INICIAL: OnboardingState = {
  paso: "registro",
  modo: "crear",
  celular: "",
  nombre: "",
  slug: "",
  rubros: [],
  celularVentas: "",
};
const KEY = "tiendly:onboarding";

/** `linksEjemplo`: el link de cada tienda de ejemplo con el formato real (TIENDLY_URL_TIENDAS), para la vista previa. */
type Ctx = { state: OnboardingState; set: (p: Partial<OnboardingState>) => void; reset: () => void; linksEjemplo: string[] };
const OnboardingContext = createContext<Ctx | null>(null);

/** Estado del onboarding. Se guarda en sessionStorage para sobrevivir a un refresh (si se puede). */
export function OnboardingProvider({ linksEjemplo, children }: { linksEjemplo: string[]; children: React.ReactNode }) {
  const [state, setState] = useState<OnboardingState>(INICIAL);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(KEY);
      if (raw) setState({ ...INICIAL, ...JSON.parse(raw) });
    } catch {
      /* sin storage: el flujo funciona igual en memoria */
    }
  }, []);

  const set = useCallback((p: Partial<OnboardingState>) => {
    setState((prev) => {
      const next = { ...prev, ...p };
      try {
        sessionStorage.setItem(KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    try {
      sessionStorage.removeItem(KEY);
    } catch {}
    setState(INICIAL);
  }, []);

  return <OnboardingContext.Provider value={{ state, set, reset, linksEjemplo }}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error("useOnboarding va dentro de <OnboardingProvider>.");
  return ctx;
}
