"use client";

import { useEffect, useState } from "react";
import { INICIAL, leerTienda, STORAGE, VACIA, validarTienda } from "../lib/config";
import type { Errores, Tienda } from "../types";

export function useMiTienda(escenario?: string) {
  const [tienda, setTienda] = useState<Tienda>(INICIAL);
  const [guardada, setGuardada] = useState<Tienda>(INICIAL);
  const [estado, setEstado] = useState<"cargando" | "lista" | "error">("cargando");
  const [errores, setErrores] = useState<Errores>({});
  const [mensaje, setMensaje] = useState("");
  const [guardando, setGuardando] = useState(false);
  function cargar() {
    setEstado("cargando");
    try {
      if (escenario === "error") throw new Error("Error simulado.");
      const valor = localStorage.getItem(STORAGE);
      const datos = escenario === "vacio" ? VACIA : valor ? leerTienda(valor) : INICIAL;
      setTienda(datos); setGuardada(datos); setEstado("lista");
    } catch { setEstado("error"); }
  }
  useEffect(() => { cargar(); }, [escenario]); // eslint-disable-line react-hooks/exhaustive-deps
  const pendiente = JSON.stringify(tienda) !== JSON.stringify(guardada);
  useEffect(() => {
    if (!pendiente) return;
    const salir = (e: BeforeUnloadEvent) => { e.preventDefault(); };
    window.addEventListener("beforeunload", salir);
    return () => window.removeEventListener("beforeunload", salir);
  }, [pendiente]);
  function cambiar<K extends keyof Tienda>(key: K, valor: Tienda[K]) {
    setTienda(t => ({ ...t, [key]: valor })); setMensaje("");
    setErrores(e => ({ ...e, [key]: undefined }));
  }
  async function guardar() {
    const errores = validarTienda(tienda);
    setErrores(errores); setMensaje("");
    if (Object.keys(errores).length) return false;
    setGuardando(true);
    try {
      localStorage.setItem(STORAGE, JSON.stringify(tienda));
      setGuardada(tienda); setMensaje("Cambios guardados en este navegador.");
      return true;
    } catch { setMensaje("No pudimos guardar. Revisa el espacio disponible de tu navegador e inténtalo de nuevo."); return false; }
    finally { setGuardando(false); }
  }
  return { tienda, estado, errores, mensaje, pendiente, guardando, cambiar, guardar, cargar };
}
