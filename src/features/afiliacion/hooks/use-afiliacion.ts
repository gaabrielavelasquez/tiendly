"use client";
import { useEffect, useRef, useState } from "react";
import { guardarRubros } from "@/features/onboarding/lib/acciones";
import type { RubroId } from "@/features/onboarding/lib/rubros";
import { consultarRuc, enviarSolicitud } from "../lib/acciones";
import { ejemplo, leerBorrador, STORAGE, VACIO } from "../lib/borrador";
import { validarCuenta, validarNegocio, validarRepresentante, validarRuc } from "../lib/reglas";
import type { Borrador, Datos, Errores } from "../types";

/** `rubros`: los del perfil del negocio (servidor). Mandan sobre el borrador: hay una sola fuente. */
export function useAfiliacion(escenario?: string, rubros: RubroId[] = []) {
  const [b, setB] = useState<Borrador>(VACIO);
  const [estado, setEstado] = useState<"cargando" | "lista" | "error">("cargando");
  const [errores, setErrores] = useState<Errores>({});
  const [mensaje, setMensaje] = useState("");
  const [buscando, setBuscando] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [acepto, setAcepto] = useState(false);
  const [editando, setEditando] = useState(false);
  const versionRuc = useRef(0);
  useEffect(() => {
    try {
      if (escenario === "error") throw new Error("Error simulado.");
      const guardado = sessionStorage.getItem(STORAGE);
      const datos = escenario === "vacio" ? VACIO : escenario === "observada" ? ejemplo("observada") : escenario === "revision" ? ejemplo("revision") : escenario === "aprobada" ? ejemplo("aprobada") : guardado ? leerBorrador(guardado) : VACIO;
      setB({ ...datos, datos: { ...datos.datos, rubros } }); setEstado("lista");
    } catch { setEstado("error"); }
  }, [escenario]); // los rubros del servidor solo se leen al cargar
  useEffect(() => {
    if (estado !== "lista") return;
    try { sessionStorage.setItem(STORAGE, JSON.stringify(b)); }
    catch { setMensaje("No pudimos guardar el borrador en este navegador. Conserva esta pantalla abierta."); }
  }, [b, estado]);
  useEffect(() => {
    if (b.paso < 1 || b.paso > 4) return;
    const salir = (e: BeforeUnloadEvent) => { e.preventDefault(); };
    window.addEventListener("beforeunload", salir);
    return () => window.removeEventListener("beforeunload", salir);
  }, [b.paso]);
  function cambiar<K extends keyof Datos>(key: K, value: Datos[K]) {
    if (key === "ruc") versionRuc.current++;
    setB(prev => ({ ...prev, datos: { ...prev.datos, [key]: value }, negocio: key === "ruc" ? null : prev.negocio }));
    setErrores(prev => ({ ...prev, [key]: undefined })); setMensaje("");
  }
  function ir(paso: number) { setB(prev => ({ ...prev, paso })); setErrores({}); setMensaje(""); }
  function editar(paso: number) { setEditando(true); setAcepto(false); ir(paso); }
  async function buscar() {
    const error = validarRuc(b.datos.ruc);
    if (error) { setErrores({ ruc: error }); return; }
    const actual = ++versionRuc.current;
    setBuscando(true); setErrores({}); setMensaje("");
    try {
      const resultado = await consultarRuc(b.datos.ruc);
      if (versionRuc.current !== actual) return;
      if (resultado.error || !resultado.negocio) { setErrores({ ruc: resultado.error || "No pudimos consultar tu RUC." }); return; }
      const negocio = resultado.negocio;
      // RUC 10: la persona es su propia representante (nombre y cargo «Titular» precargados; se pueden cambiar).
      setB(prev => ({ ...prev, negocio, datos: { ...prev.datos, nombre: negocio.tipo === "persona" ? negocio.razonSocial : prev.datos.nombre, cargo: negocio.tipo === "persona" && !prev.datos.cargo ? "Titular" : prev.datos.cargo } }));
    } catch { setErrores({ ruc: "No pudimos consultar tu RUC. Inténtalo de nuevo." }); }
    finally { setBuscando(false); }
  }
  async function continuar() {
    if (b.paso === 1 && !b.negocio) { await buscar(); return; }
    if (b.paso === 1 && b.negocio?.condicion !== "habido") return;
    const e = b.paso === 1 ? validarNegocio(b.datos) : b.paso === 2 ? validarRepresentante(b.datos) : b.paso === 3 ? validarCuenta(b.datos) : {};
    setErrores(e);
    if (Object.keys(e).length) return;
    if (b.paso === 1) {
      // Los rubros editados aquí actualizan el perfil del negocio (el mismo dato que eligió en el onboarding).
      const r = await guardarRubros(b.datos.rubros).catch(() => ({ error: "No pudimos guardar tus rubros. Inténtalo de nuevo." }));
      if ("error" in r) { setErrores({ rubros: r.error }); return; }
    }
    ir(editando ? 4 : b.paso + 1); setEditando(false);
  }
  async function enviar() {
    if (enviando || !acepto) return;
    setEnviando(true); setMensaje("");
    try {
      const result = await enviarSolicitud(b.datos, acepto);
      if (result.error || !result.solicitud) { setMensaje(result.error || "No pudimos enviar la solicitud. Inténtalo de nuevo."); return; }
      const solicitud = { ...result.solicitud, numero: b.solicitud?.estado === "observada" ? b.solicitud.numero : result.solicitud.numero };
      setB(prev => ({ ...prev, solicitud, paso: 5 }));
    } catch { setMensaje("No pudimos enviar la solicitud. No se perdió lo que escribiste. Inténtalo de nuevo."); }
    finally { setEnviando(false); }
  }
  function reiniciar() { setB(VACIO); setErrores({}); setMensaje(""); setAcepto(false); setEditando(false); setEstado("lista"); }
  return { ...b, estado, errores, mensaje, buscando, enviando, acepto, setAcepto, cambiar, ir, editar, continuar, enviar, reiniciar };
}
export type ModeloAfiliacion = ReturnType<typeof useAfiliacion>;
