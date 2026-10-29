"use client";

import { createContext, useContext } from "react";

// Quien lleva la tienda de la sesión, leída en el servidor (layout del panel). Los componentes de cliente
// no pueden leer la sesión simulada directamente: en el navegador siempre sería la tienda de demo.
const DuenaContext = createContext("");

export function SesionPanel({ duena, children }: { duena: string; children: React.ReactNode }) {
  return <DuenaContext.Provider value={duena}>{children}</DuenaContext.Provider>;
}

export const useDuena = () => useContext(DuenaContext);
