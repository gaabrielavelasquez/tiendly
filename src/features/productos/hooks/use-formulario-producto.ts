"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Categoria } from "../types";
import { guardarProducto } from "../lib/acciones";
import { fotoParaGuardar } from "../lib/foto";
import { VARIANTE_VACIA, validar, type Errores, type FormProducto, type ImagenForm, type VarianteForm } from "../lib/formulario";

const alternar = <T,>(lista: T[], v: T) => (lista.includes(v) ? lista.filter((x) => x !== v) : [...lista, v]);

/**
 * Estado del formulario de producto: valores, validación (se muestra recién al intentar guardar),
 * cambios sin guardar (avisa antes de salir) y guardado en el catálogo (simulado en el servidor).
 * `id`: el producto que se edita; al crear, se recuerda el id nuevo para no duplicarlo al volver a guardar.
 */
export function useFormularioProducto(inicial: FormProducto, id?: string) {
  const [form, setForm] = useState(inicial);
  const [base, setBase] = useState(() => JSON.stringify(inicial));
  const [intentoGuardar, setIntentoGuardar] = useState(false);
  const [guardando, setGuardando] = useState(false);
  /** Aviso tras guardar: null si no hay; si se guardó pausado, dice qué falta. */
  const [guardado, setGuardado] = useState<{ pausado: string | null } | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const idGuardado = useRef(id ?? null);
  /** Error al guardar (red o servidor); lo escrito no se pierde. */
  const [fallo, setFallo] = useState("");

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
  /** Cantidad solo enteros; precio con decimales; SKU en mayúsculas. */
  const setVariante = useCallback((k: string, campo: keyof VarianteForm, v: string) => {
    const limpio = campo === "stock" ? v.replace(/[^\d]/g, "") : campo === "precio" ? v.replace(/[^\d.,]/g, "") : v.toUpperCase();
    setForm((f) => ({ ...f, variantes: { ...f.variantes, [k]: { ...(f.variantes[k] ?? VARIANTE_VACIA), [campo]: limpio } } }));
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
      const primero = (["nombre", "precio", "precioAntes", "variantes"] as const).find((k) => e[k]);
      requestAnimationFrame(() => {
        // En la tabla de variantes, al precio que está mal (no a la primera fila).
        // Solo el visible: en móvil es el acordeón; desde 640 px, la planilla.
        const destino = primero === "variantes" ? [...document.querySelectorAll<HTMLElement>("[data-error-variante]")].find((el) => el.offsetParent) : null;
        (destino ?? document.getElementById(`campo-${primero}`))?.focus();
      });
      return cantidad;
    }
    setGuardando(true);
    setFallo("");
    let r: Awaited<ReturnType<typeof guardarProducto>>;
    let imagenes = form.imagenes;
    try {
      imagenes = await Promise.all(form.imagenes.map(async (i) => ({ ...i, url: await fotoParaGuardar(i.url) })));
      r = await guardarProducto(idGuardado.current, { ...form, imagenes });
    } catch {
      r = { error: "No pudimos guardar el producto. Revisa tu conexión e inténtalo de nuevo." };
    }
    setGuardando(false);
    if ("error" in r) {
      setFallo(r.error);
      return 0;
    }
    idGuardado.current = r.id;
    // Activo pero incompleto: se guardó pausado y se avisa qué falta (decisión 0028).
    const falta = r.pausado;
    const final: FormProducto = { ...form, imagenes, estado: falta ? "pausado" : form.estado };
    setForm(final);
    setBase(JSON.stringify(final));
    setGuardado({ pausado: falta });
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setGuardado(null), falta ? 9000 : 5000);
    return 0;
  }, [form]);

  return {
    form, set, alternarColor, alternarTalla, alternarCategoria, setVariante, agregarImagenes, quitarImagen,
    errores, guardar, guardando, guardado, sinGuardar, fallo,
  };
}
