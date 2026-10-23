"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Categoria, TablaTallas } from "../types";
import { guardarProducto } from "../lib/acciones";
import { fotoParaGuardar } from "../lib/foto";
import { fotosPorDefecto, validar, type Errores, type FormProducto, type ImagenForm, type OpcionForm } from "../lib/formulario";

const alternar = <T,>(lista: T[], v: T) => (lista.includes(v) ? lista.filter((x) => x !== v) : [...lista, v]);
const CAMPOS: (keyof Errores)[] = ["nombre", "precio", "precioAntes", "ofertaHasta", "opciones"];

/**
 * Estado del formulario de producto: valores, validación (se muestra recién al intentar guardar), cambios sin
 * guardar (avisa antes de salir) y guardado en el catálogo. `id`: el producto que se edita; al crear, se recuerda
 * el id nuevo para no duplicarlo al volver a guardar. "Las fotos cambian según" sigue a Color o Tono hasta que
 * la persona la elige a mano.
 */
export function useFormularioProducto(inicial: FormProducto, id?: string) {
  const [form, setForm] = useState(inicial);
  const [base, setBase] = useState(() => JSON.stringify(inicial));
  const [intentoGuardar, setIntentoGuardar] = useState(false);
  const [guardando, setGuardando] = useState(false);
  /** Aviso tras guardar: null si no hay; si se guardó pausado, dice qué falta. */
  const [guardado, setGuardado] = useState<{ pausado: string | null } | null>(null);
  const [fotosManual, setFotosManual] = useState(!!id);
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
  const setOpciones = useCallback((opciones: OpcionForm[]) => setForm((f) => ({
    ...f, opciones, opcionFotos: fotosManual ? (f.opcionFotos < opciones.length ? f.opcionFotos : -1) : fotosPorDefecto(opciones),
  })), [fotosManual]);
  const setOpcionFotos = useCallback((i: number) => (setFotosManual(true), setForm((f) => ({ ...f, opcionFotos: i }))), []);
  const setStock = useCallback((clave: string, v: string) => setForm((f) => ({ ...f, stock: { ...f.stock, [clave]: v.replace(/\D/g, "") } })), []);
  const setTabla = useCallback((tabla: TablaTallas | null) => setForm((f) => ({ ...f, tabla })), []);
  const alternarCategoria = useCallback((c: Categoria) => setForm((f) => ({ ...f, categorias: alternar(f.categorias, c) })), []);
  const agregarCategoria = useCallback((c: Categoria) => setForm((f) => ({ ...f, categorias: f.categorias.includes(c) ? f.categorias : [...f.categorias, c] })), []);
  const alternarFotoValor = useCallback((valor: string, idImg: string) => setForm((f) => ({ ...f, fotosPorValor: { ...f.fotosPorValor, [valor]: alternar(f.fotosPorValor[valor] ?? [], idImg) } })), []);
  const agregarImagenes = useCallback((nuevas: ImagenForm[]) => setForm((f) => ({ ...f, imagenes: [...f.imagenes, ...nuevas] })), []);
  const quitarImagen = useCallback((idImg: string) => setForm((f) => ({
    ...f, imagenes: f.imagenes.filter((i) => i.id !== idImg),
    fotosPorValor: Object.fromEntries(Object.entries(f.fotosPorValor).map(([v, ids]) => [v, ids.filter((x) => x !== idImg)])),
  })), []);

  /** Devuelve la cantidad de errores; 0 si se guardó. */
  const guardar = useCallback(async () => {
    setIntentoGuardar(true);
    const e = validar(form);
    const cantidad = Object.keys(e).length;
    if (cantidad) {
      // Lleva el foco al primer campo con error para que no haya que buscarlo.
      const primero = CAMPOS.find((k) => e[k]);
      requestAnimationFrame(() => document.getElementById(`campo-${primero}`)?.focus());
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
    const urls = r.urls;
    imagenes = imagenes.map((i, n) => ({ ...i, url: urls[n] ?? i.url }));
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
    form, set, setOpciones, setOpcionFotos, setStock, setTabla, alternarCategoria, agregarCategoria, alternarFotoValor, agregarImagenes, quitarImagen,
    errores, guardar, guardando, guardado, sinGuardar, fallo,
  };
}
