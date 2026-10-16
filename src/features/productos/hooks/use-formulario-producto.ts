"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Categoria } from "../types";
import { clave, validar, type Errores, type FormProducto, type ImagenForm } from "../lib/formulario";

const alternar = <T,>(lista: T[], v: T) => (lista.includes(v) ? lista.filter((x) => x !== v) : [...lista, v]);

/**
 * Estado del formulario de producto: valores, validación (se muestra recién al intentar guardar),
 * cambios sin guardar (avisa antes de salir) y guardado simulado hasta tener backend.
 */
export function useFormularioProducto(inicial: FormProducto) {
  const [form, setForm] = useState(inicial);
  const [base, setBase] = useState(() => JSON.stringify(inicial));
  const [intentoGuardar, setIntentoGuardar] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  const errores: Errores = useMemo(() => (intentoGuardar ? validar(form) : {}), [form, intentoGuardar]);
  const sinGuardar = JSON.stringify(form) !== base;

  // El navegador avisa si la persona cierra o recarga con cambios sin guardar.
  useEffect(() => {
    if (!sinGuardar) return;
    const onSalir = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", onSalir);
    return () => window.removeEventListener("beforeunload", onSalir);
  }, [sinGuardar]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const set = useCallback(<K extends keyof FormProducto>(k: K, v: FormProducto[K]) => setForm((f) => ({ ...f, [k]: v })), []);
  const alternarColor = useCallback((c: string) => setForm((f) => ({ ...f, colores: alternar(f.colores, c) })), []);
  const alternarTalla = useCallback((t: string) => setForm((f) => ({ ...f, tallas: alternar(f.tallas, t) })), []);
  const alternarCategoria = useCallback((c: Categoria) => setForm((f) => ({ ...f, categorias: alternar(f.categorias, c) })), []);
  const setStock = useCallback((color: string, talla: string, v: string) => {
    setForm((f) => ({ ...f, stock: { ...f.stock, [clave(color, talla)]: v.replace(/[^\d]/g, "") } }));
  }, []);
  const agregarImagenes = useCallback((nuevas: ImagenForm[]) => setForm((f) => ({ ...f, imagenes: [...f.imagenes, ...nuevas] })), []);
  const quitarImagen = useCallback((id: string) => setForm((f) => ({ ...f, imagenes: f.imagenes.filter((i) => i.id !== id) })), []);

  /** Devuelve la cantidad de errores; 0 si se guardó. */
  const guardar = useCallback(async () => {
    setIntentoGuardar(true);
    const e = validar(form);
    const cantidad = Object.keys(e).length;
    if (cantidad) {
      // Lleva el foco al primer campo con error para que no haya que buscarlo.
      const primero = (["nombre", "precio", "precioAntes", "stock"] as const).find((k) => e[k]);
      requestAnimationFrame(() => document.getElementById(`campo-${primero}`)?.focus());
      return cantidad;
    }
    setGuardando(true);
    await new Promise((r) => setTimeout(r, 800)); // simulación del guardado
    setGuardando(false);
    setBase(JSON.stringify(form));
    setGuardado(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setGuardado(false), 5000);
    return 0;
  }, [form]);

  return {
    form, set, alternarColor, alternarTalla, alternarCategoria, setStock, agregarImagenes, quitarImagen,
    errores, guardar, guardando, guardado, sinGuardar,
  };
}
