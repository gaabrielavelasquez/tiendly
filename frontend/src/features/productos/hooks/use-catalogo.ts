"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useOcultarBarraInferior } from "@/components/panel";
import { plural } from "@/lib/formato";
import type { Filtro, Producto } from "../types";
import { cambiarEstados, duplicarProducto as duplicarEnServidor, ponerEnOferta as ponerEnServidor, quitarOferta as quitarEnServidor, restaurarProductos } from "../lib/acciones";
import { contarPorFiltro, filtrarProductos, type OfertaEnLote } from "../lib/reglas";
import { estadoOferta } from "../lib/ofertas";

/** Aviso tras una acción en lote, con los productos como estaban para "Deshacer". */
export type Aviso = { texto: string; previos: Producto[] };

/**
 * Estado del catálogo en el cliente: filtro en la URL (?estado=), búsqueda, selección (casillas en desktop; modo
 * selección en móvil, 0034) y acciones en lote con "Deshacer" (pausar, poner y quitar oferta). Todo se guarda en el
 * servidor. Mientras dura el modo selección, la barra inferior del panel se oculta (la tapa la barra de selección).
 */
export function useCatalogo(inicial: Producto[], filtroInicial: Filtro, hoy: string) {
  const [lista, setLista] = useState(inicial);
  const [filtro, setFiltroState] = useState<Filtro>(filtroInicial);
  const [busqueda, setBusqueda] = useState("");
  const [aviso, setAviso] = useState<Aviso | null>(null);
  const [seleccion, setSeleccion] = useState<Set<string>>(() => new Set());
  const [modoSeleccion, setModoSeleccion] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useOcultarBarraInferior(modoSeleccion);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  /** Cambia el filtro y lo deja en la URL sin volver a pedir la página. */
  const setFiltro = useCallback((f: Filtro) => {
    setFiltroState(f);
    setSeleccion(new Set()); // al cambiar de vista, la selección deja de tener sentido
    const url = new URL(window.location.href);
    if (f === "todos") url.searchParams.delete("estado");
    else url.searchParams.set("estado", f);
    window.history.replaceState(null, "", url);
  }, []);

  const visibles = useMemo(() => filtrarProductos(lista, filtro, busqueda, hoy), [lista, filtro, busqueda, hoy]);
  const conteos = useMemo(() => contarPorFiltro(lista, hoy), [lista, hoy]);
  // Solo cuenta lo que se ve: si la búsqueda oculta un producto marcado, no se cambia "a ciegas".
  const elegidos = useMemo(() => visibles.filter((p) => seleccion.has(p.id)), [visibles, seleccion]);
  const conOferta = elegidos.filter((p) => estadoOferta(p, hoy) !== "sin-oferta").length;

  const salirSeleccion = useCallback(() => (setModoSeleccion(false), setSeleccion(new Set())), []);
  /** Aplica el resultado de una acción en lote, avisa con "Deshacer" (8 s) y sale de la selección. */
  const aplicar = useCallback((nuevos: Producto[], previos: Producto[], texto: string) => {
    const porId = new Map(nuevos.map((p) => [p.id, p]));
    setLista((l) => l.map((p) => porId.get(p.id) ?? p));
    setAviso({ texto, previos });
    salirSeleccion();
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setAviso(null), 8000);
  }, [salirSeleccion]);

  const pausar = useCallback((productos: Producto[]) => {
    if (!productos.length) return;
    aplicar(productos.map((p) => ({ ...p, estado: "pausado" })), productos,
      productos.length === 1 ? `${productos[0].nombre} se pausó. Ya no se ve en tu tienda.` : `${productos.length} productos se pausaron. Ya no se ven en tu tienda.`);
    void cambiarEstados(Object.fromEntries(productos.map((p) => [p.id, "pausado" as const])));
  }, [aplicar]);

  /** Devuelve "" si salió bien o el mensaje de error, para mostrarlo en la hoja. */
  const ponerEnOferta = useCallback(async (o: OfertaEnLote) => {
    const previos = elegidos;
    const r = await ponerEnServidor(previos.map((p) => p.id), o).catch(() => ({ error: "No pudimos guardar la oferta. Inténtalo de nuevo." }));
    if ("error" in r) return r.error;
    aplicar(r.productos, previos, `${plural(r.productos.length, "producto quedó", "productos quedaron")} en oferta.${r.saltados ? ` ${plural(r.saltados, "no cambió", "no cambiaron")}: el precio no bajaba.` : ""}`);
    return "";
  }, [elegidos, aplicar]);

  const quitarOferta = useCallback(async () => {
    const previos = elegidos.filter((p) => estadoOferta(p, hoy) !== "sin-oferta");
    if (!previos.length) return;
    const nuevos = await quitarEnServidor(previos.map((p) => p.id)).catch(() => null);
    if (nuevos) aplicar(nuevos, previos, `Quitaste la oferta de ${plural(previos.length, "producto", "productos")}.`);
  }, [elegidos, hoy, aplicar]);

  const deshacer = useCallback(() => {
    if (!aviso) return;
    const antes = new Map(aviso.previos.map((p) => [p.id, p]));
    setLista((l) => l.map((p) => antes.get(p.id) ?? p));
    void restaurarProductos(aviso.previos.map(({ id, precio, precioAntes, oferta, estado }) => ({ id, precio, precioAntes, oferta, estado })));
    setAviso(null);
    window.clearTimeout(timer.current);
  }, [aviso]);

  /** La copia la crea el servidor (pausada y sin stock) y aparece debajo del original. */
  const duplicar = useCallback(async (id: string) => {
    const copia = await duplicarEnServidor(id).catch(() => null);
    if (!copia || "error" in copia) return;
    setLista((prev) => {
      const i = prev.findIndex((p) => p.id === id);
      return i < 0 ? [copia, ...prev] : [...prev.slice(0, i + 1), copia, ...prev.slice(i + 1)];
    });
  }, []);

  const alternar = useCallback((id: string) => setSeleccion((prev) => {
    const sig = new Set(prev);
    if (sig.has(id)) sig.delete(id);
    else sig.add(id);
    return sig;
  }), []);

  /** Maestro: si ya están todos los visibles, los quita; si no, los marca todos. */
  const alternarTodos = useCallback(() => {
    const ids = visibles.map((p) => p.id);
    setSeleccion((prev) => (ids.every((id) => prev.has(id)) ? new Set() : new Set(ids)));
  }, [visibles]);

  /** Móvil: "Seleccionar" (sin nada marcado) o mantener presionado un producto (queda marcado). */
  const entrarSeleccion = useCallback((id?: string) => (setModoSeleccion(true), setSeleccion(new Set(id ? [id] : []))), []);

  return {
    visibles, conteos, filtro, setFiltro, busqueda, setBusqueda, duplicar,
    seleccion, elegidos, conOferta, alternar, alternarTodos, limpiarSeleccion: () => setSeleccion(new Set()),
    modoSeleccion, entrarSeleccion, salirSeleccion,
    pausar, ponerEnOferta, quitarOferta, aviso, deshacer,
  };
}
