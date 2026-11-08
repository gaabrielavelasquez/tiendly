"use client";

import { useCallback, useMemo, useState } from "react";
import { useOcultarBarraInferior } from "@/components/panel";
import type { Filtro, Producto } from "../types";
import { contarPorFiltro, filtrarProductos } from "../lib/reglas";
import { estadoOferta } from "../lib/ofertas";
import { useCatalogoAcciones } from "./use-catalogo-acciones";

/** Aviso tras una acción en lote, con los productos como estaban para "Deshacer". */
export type { Aviso } from "./use-catalogo-acciones";

/**
 * Estado del catálogo en el cliente: filtro en la URL (?estado=), búsqueda, selección (casillas en desktop; modo
 * selección en móvil, 0034) y acciones en lote con "Deshacer" (pausar, poner y quitar oferta). Todo se guarda en el
 * servidor. Mientras dura el modo selección, la barra inferior del panel se oculta (la tapa la barra de selección).
 */
export function useCatalogo(inicial: Producto[], filtroInicial: Filtro, hoy: string) {
  const [lista, setLista] = useState(inicial);
  const [filtro, setFiltroState] = useState<Filtro>(filtroInicial);
  const [busqueda, setBusqueda] = useState("");
  const [seleccion, setSeleccion] = useState<Set<string>>(() => new Set());
  const [modoSeleccion, setModoSeleccion] = useState(false);

  useOcultarBarraInferior(modoSeleccion);

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
  const acciones = useCatalogoAcciones(lista, setLista, elegidos, hoy, salirSeleccion);

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
    visibles, conteos, filtro, setFiltro, busqueda, setBusqueda,
    seleccion, elegidos, conOferta, alternar, alternarTodos, limpiarSeleccion: () => setSeleccion(new Set()),
    modoSeleccion, entrarSeleccion, salirSeleccion,
    ...acciones,
  };
}
