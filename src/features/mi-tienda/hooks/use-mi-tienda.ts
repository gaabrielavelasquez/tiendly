"use client";

import { useEffect, useState } from "react";
import { guardarWhatsappVentas } from "@/features/configuracion/lib/acciones";
import { INICIAL, leerTienda, storageDe, VACIA, validarTienda } from "../lib/config";
import type { Errores, Tienda } from "../types";

/**
 * `whatsappVentas`: el número guardado en la configuración de la tienda; manda sobre lo guardado en el navegador.
 * `sesion`: Heather (demo) arranca con su portada y textos; una tienda nueva, vacía.
 */
export function useMiTienda(escenario: string | undefined, whatsappVentas: string, sesion: { slug: string; demo: boolean }) {
  const STORAGE = storageDe(sesion.slug);
  const PRIMERA = sesion.demo ? INICIAL : VACIA;
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
      const base = escenario === "vacio" ? VACIA : valor ? leerTienda(valor) : PRIMERA;
      const datos = escenario === "vacio" ? base : { ...base, whatsapp: whatsappVentas };
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
      if (tienda.whatsapp !== guardada.whatsapp) {
        const r = await guardarWhatsappVentas(tienda.whatsapp);
        if ("error" in r) { setErrores({ whatsapp: r.error }); setMensaje("Revisa los campos marcados antes de guardar."); return false; }
      }
      localStorage.setItem(STORAGE, JSON.stringify(tienda));
      setGuardada(tienda); setMensaje("Cambios guardados en este navegador.");
      return true;
    } catch { setMensaje("No pudimos guardar. Revisa el espacio disponible de tu navegador e inténtalo de nuevo."); return false; }
    finally { setGuardando(false); }
  }
  function descartar() { setTienda(guardada); setErrores({}); setMensaje(""); }
  return { tienda, estado, errores, mensaje, pendiente, guardando, cambiar, guardar, cargar, descartar };
}
