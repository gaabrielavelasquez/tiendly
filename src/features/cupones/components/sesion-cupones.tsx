"use client";

import { createContext, useContext, useState } from "react";
import type { Cupon } from "../types";

type Cambios = Record<string, Cupon | null>;
type Sesion = { cambios: Cambios; recordar: (c: Cupon) => void; quitar: (id: string) => void };
const Contexto = createContext<Sesion | null>(null);

/** Confirmaciones del servidor durante este recorrido por Cupones; se reinician al salir o cambiar de tienda. */
export function SesionCupones({ children }: { children: React.ReactNode }) {
  const [cambios, setCambios] = useState<Cambios>({});
  const recordar = (c: Cupon) => setCambios((previos) => ({ ...previos, [c.id]: c }));
  const quitar = (id: string) => setCambios((previos) => ({ ...previos, [id]: null }));
  return <Contexto.Provider value={{ cambios, recordar, quitar }}>{children}</Contexto.Provider>;
}

export function useSesionCupones() {
  const sesion = useContext(Contexto);
  if (!sesion) throw new Error("Falta la sesión de Cupones.");
  return sesion;
}

/** La respuesta de guardar tiene prioridad sobre una lectura de lista anterior o de otra instancia. */
export function conConfirmados(inicial: Cupon[], cambios: Cambios): Cupon[] {
  return [...Object.values(cambios).reverse().filter((c): c is Cupon => c !== null), ...inicial.filter((c) => !(c.id in cambios))];
}
