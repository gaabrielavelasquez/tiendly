"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "./use-onboarding";
import { useCountdown } from "./use-countdown";

/** Verificación simulada: 0000 no coincide; el código dura cinco minutos. No envía mensajes reales. */
export function useCodigo() {
  const router = useRouter();
  const { state, set } = useOnboarding();
  const inicial = useRef(Date.now());
  const enviado = state.codigoEnviadoEl ?? inicial.current;
  const [codigo, setCodigo] = useState("");
  const [error, setError] = useState("");
  const [vencido, setVencido] = useState(false);
  const [verificando, setVerificando] = useState(false);
  const [aviso, setAviso] = useState("");
  const ocupado = useRef(false);
  const cuenta = useCountdown(60);
  const expirar = () => { setVencido(true); setError("Este código venció. Pide uno nuevo para continuar."); setCodigo(""); };
  useEffect(() => {
    const t = setTimeout(expirar, Math.max(0, enviado + 300000 - Date.now()));
    return () => clearTimeout(t);
  }, [enviado]);
  async function verificar(valor = codigo) {
    if (valor.length !== 4 || ocupado.current || vencido) return;
    ocupado.current = true;
    setVerificando(true);
    setError("");
    await new Promise((r) => setTimeout(r, 700));
    ocupado.current = false;
    setVerificando(false);
    if (Date.now() >= enviado + 300000) return expirar();
    if (valor === "0000") { setError("El código no coincide. Revisa el mensaje de WhatsApp e inténtalo otra vez."); setCodigo(""); return; }
    if (state.modo === "ingresar") router.push("/panel");
    else set({ paso: "datos" });
  }
  useEffect(() => {
    if (codigo.length === 4) void verificar(codigo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codigo]);
  const reenviar = () => {
    set({ codigoEnviadoEl: Date.now() }); cuenta.reiniciar(); setCodigo(""); setError(""); setVencido(false); setAviso("Te mandamos un código nuevo.");
  };
  return { codigo, setCodigo, error, vencido, verificando, aviso, cuenta, verificar, reenviar };
}
