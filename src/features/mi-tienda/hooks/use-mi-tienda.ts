"use client";

import { useEffect, useState } from "react";
import { guardarIdentidad } from "../lib/acciones";
import { VACIA, validarTienda } from "../lib/config";
import type { Errores, Tienda } from "../types";

/** El servidor es la fuente de identidad; un borrador antiguo del navegador nunca pisa datos publicados. */
export function useMiTienda(escenario: string | undefined, inicial: Tienda) {
  const [tienda, setTienda] = useState<Tienda>(inicial);
  const [guardada, setGuardada] = useState<Tienda>(inicial);
  const [estado, setEstado] = useState<"cargando" | "lista" | "error">("cargando");
  const [errores, setErrores] = useState<Errores>({});
  const [mensaje, setMensaje] = useState("");
  const [guardando, setGuardando] = useState(false);
  function cargar() {
    setEstado("cargando");
    try {
      if (escenario === "error") throw new Error("Error simulado.");
      const datos = escenario === "vacio" ? { ...VACIA, whatsapp: inicial.whatsapp } : inicial;
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
    if (Object.keys(errores).length) { setMensaje("Revisa los campos marcados antes de guardar."); return false; }
    setGuardando(true);
    try {
      const r = await guardarIdentidad(tienda);
      if ("error" in r) { setMensaje(r.error); return false; }
      setTienda(r.datos); setGuardada(r.datos); setMensaje("Cambios guardados y publicados.");
      return true;
    } catch { setMensaje("No pudimos guardar. Revisa tu conexión e inténtalo de nuevo."); return false; }
    finally { setGuardando(false); }
  }
  function descartar() { setTienda(guardada); setErrores({}); setMensaje(""); }
  return { tienda, estado, errores, mensaje, pendiente, guardando, cambiar, guardar, cargar, descartar };
}
