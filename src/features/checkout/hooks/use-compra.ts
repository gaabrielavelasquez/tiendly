"use client";

import { useState } from "react";
import type { Datos, Distrito, Entrega, MetodoPago } from "../types";
import { cobrarTarjeta, cobrarYape, FALLO_VENCIDA, validarTarjeta, type ErroresTarjeta, type FalloPago, type Tarjeta } from "../lib/pago";
import { soloDigitos, validarDatos, validarEntrega, type ErroresEntrega } from "../lib/reglas";

export type Paso = "datos" | "entrega" | "pago";

/**
 * Estado de "Finalizar compra" (Figma, una sola vista): tres pasos que se pliegan al completarse
 * y el pago, que se elige y se completa en la misma pantalla. `confirmar` cobra (simulado) y devuelve
 * lo necesario para crear el pedido; no navega, eso lo decide la vista.
 */
export function useCompra() {
  const [paso, setPaso] = useState<Paso>("datos");
  const [hechos, setHechos] = useState({ datos: false, entrega: false });
  const [datos, setDatos] = useState<Datos>({ nombre: "", celular: "" });
  const [erroresDatos, setErroresDatos] = useState<Partial<Record<keyof Datos, string>>>({});
  const [tipoEntrega, setTipoEntrega] = useState<"delivery" | "recojo">("delivery");
  const [distrito, setDistrito] = useState<Distrito | null>(null);
  const [direccion, setDireccion] = useState("");
  const [referencia, setReferencia] = useState("");
  const [erroresEntrega, setErroresEntrega] = useState<ErroresEntrega>({});
  const [metodo, setMetodo] = useState<MetodoPago | null>(null);
  const [tarjeta, setTarjeta] = useState<Tarjeta>({ numero: "", vencimiento: "", cvv: "" });
  const [erroresTarjeta, setErroresTarjeta] = useState<ErroresTarjeta>({});
  const [yape, setYape] = useState({ celular: "", codigo: "" });
  const [errorYape, setErrorYape] = useState<Partial<Record<"celular" | "codigo", string>>>({});
  const [fallo, setFallo] = useState<FalloPago | null>(null);
  const [procesando, setProcesando] = useState(false);

  const entrega: Entrega | null =
    tipoEntrega === "recojo" ? { tipo: "recojo" } : distrito ? { tipo: "delivery", distrito, direccion: direccion.trim(), referencia: referencia.trim() } : null;

  function continuarDatos() {
    const e = validarDatos(datos);
    setErroresDatos(e);
    if (Object.keys(e).length) return false;
    setHechos((h) => ({ ...h, datos: true }));
    setYape((y) => (y.celular ? y : { ...y, celular: soloDigitos(datos.celular) })); // Figma: se precarga
    setPaso(hechos.entrega ? "pago" : "entrega");
    return true;
  }

  function continuarEntrega() {
    const e = validarEntrega(tipoEntrega, distrito, direccion);
    setErroresEntrega(e);
    if (Object.keys(e).length) return false;
    setHechos((h) => ({ ...h, entrega: true }));
    setPaso("pago");
    return true;
  }

  function elegirMetodo(m: MetodoPago) {
    setMetodo(m);
    setFallo(null);
  }

  /** Valida y cobra. Devuelve el pago para el pedido, o null si algo falló (y deja el error a la vista). */
  async function confirmar(): Promise<{ metodo: "tarjeta"; ultimos4: string } | { metodo: "yape" } | { metodo: "whatsapp" } | null> {
    setFallo(null);
    if (metodo === "whatsapp") return { metodo };
    if (metodo === "tarjeta") {
      const e = validarTarjeta(tarjeta, new Date());
      setErroresTarjeta(e);
      if (e.vencimiento === "Esta tarjeta venció.") setFallo(FALLO_VENCIDA);
      if (Object.keys(e).length) return null;
      setProcesando(true);
      const f = await cobrarTarjeta(tarjeta);
      setProcesando(false);
      if (f) return setFallo(f), null;
      return { metodo, ultimos4: soloDigitos(tarjeta.numero).slice(-4) };
    }
    if (metodo === "yape") {
      const e: typeof errorYape = {};
      if (!/^9\d{8}$/.test(soloDigitos(yape.celular))) e.celular = "Revisa tu celular: son 9 dígitos y empieza con 9.";
      if (soloDigitos(yape.codigo).length !== 6) e.codigo = "Escribe los 6 dígitos del código de aprobación.";
      setErrorYape(e);
      if (Object.keys(e).length) return null;
      setProcesando(true);
      const error = await cobrarYape(yape.codigo);
      setProcesando(false);
      if (error) return setErrorYape({ codigo: error }), null;
      return { metodo };
    }
    return null;
  }

  return {
    paso, setPaso, hechos, datos, setDatos, erroresDatos, continuarDatos,
    tipoEntrega, setTipoEntrega, distrito, setDistrito, direccion, setDireccion, referencia, setReferencia, erroresEntrega, continuarEntrega, entrega,
    metodo, elegirMetodo, tarjeta, setTarjeta, erroresTarjeta, yape, setYape, errorYape, fallo, procesando, confirmar,
  };
}

export type Compra = ReturnType<typeof useCompra>;
