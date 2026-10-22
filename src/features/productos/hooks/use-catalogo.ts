"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Filtro, Producto } from "../types";
import { contarPorFiltro, duplicar, filtrarProductos } from "../lib/reglas";

/** Lo último que se archivó (uno o varios), tal como estaba, para poder deshacer. */
export type Archivado = { productos: Producto[] };

/**
 * Estado del catálogo en el cliente (hasta tener backend): filtro sincronizado con la URL,
 * búsqueda, selección para acciones masivas, y archivar (con deshacer durante unos segundos) o duplicar.
 */
export function useCatalogo(inicial: Producto[], filtroInicial: Filtro) {
  const [lista, setLista] = useState(inicial);
  const [filtro, setFiltroState] = useState<Filtro>(filtroInicial);
  const [busqueda, setBusqueda] = useState("");
  const [archivado, setArchivado] = useState<Archivado | null>(null);
  const [seleccion, setSeleccion] = useState<Set<string>>(() => new Set());
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  /** Cambia el filtro y lo deja en la URL (?estado=) sin volver a pedir la página. */
  const setFiltro = useCallback((f: Filtro) => {
    setFiltroState(f);
    setSeleccion(new Set()); // al cambiar de vista, la selección deja de tener sentido
    const url = new URL(window.location.href);
    if (f === "todos") url.searchParams.delete("estado");
    else url.searchParams.set("estado", f);
    window.history.replaceState(null, "", url);
  }, []);

  /** Archiva uno o varios productos de una vez. */
  const archivar = useCallback(
    (ids: string[]) => {
      const productos = lista.filter((p) => ids.includes(p.id));
      if (!productos.length) return;
      setArchivado({ productos });
      setLista((prev) => prev.map((p) => (ids.includes(p.id) ? { ...p, estado: "archivado" } : p)));
      setSeleccion((prev) => new Set([...prev].filter((id) => !ids.includes(id))));
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setArchivado(null), 6000);
    },
    [lista],
  );

  /** Devuelve el producto tal como estaba (incluido su estado anterior). */
  const deshacer = useCallback(() => {
    if (!archivado) return;
    const antes = new Map(archivado.productos.map((p) => [p.id, p]));
    setLista((prev) => prev.map((p) => antes.get(p.id) ?? p));
    setArchivado(null);
    window.clearTimeout(timer.current);
  }, [archivado]);

  const duplicarProducto = useCallback((id: string) => {
    setLista((prev) => {
      const i = prev.findIndex((p) => p.id === id);
      return i < 0 ? prev : [...prev.slice(0, i + 1), duplicar(prev[i]), ...prev.slice(i + 1)];
    });
  }, []);

  const visibles = useMemo(() => filtrarProductos(lista, filtro, busqueda), [lista, filtro, busqueda]);
  const conteos = useMemo(() => contarPorFiltro(lista), [lista]);

  // Solo cuenta lo que se ve: si la búsqueda oculta un producto marcado, no se archiva "a ciegas".
  const seleccionVisible = useMemo(() => visibles.filter((p) => seleccion.has(p.id)).map((p) => p.id), [visibles, seleccion]);

  const alternar = useCallback((id: string) => {
    setSeleccion((prev) => {
      const sig = new Set(prev);
      if (sig.has(id)) sig.delete(id);
      else sig.add(id);
      return sig;
    });
  }, []);

  /** Maestro: si ya están todos los visibles, los quita; si no, los marca todos. */
  const alternarTodos = useCallback(() => {
    const ids = visibles.map((p) => p.id);
    setSeleccion((prev) => (ids.every((id) => prev.has(id)) ? new Set() : new Set(ids)));
  }, [visibles]);

  const limpiarSeleccion = useCallback(() => setSeleccion(new Set()), []);

  return {
    visibles, conteos, filtro, setFiltro, busqueda, setBusqueda, archivar, deshacer, archivado, duplicar: duplicarProducto,
    seleccion, seleccionVisible, alternar, alternarTodos, limpiarSeleccion,
  };
}
