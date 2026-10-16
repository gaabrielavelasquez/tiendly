"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Filtro, Producto } from "../types";
import { contarPorFiltro, duplicar, filtrarProductos } from "../lib/reglas";

export type Archivado = { producto: Producto };

/**
 * Estado del catálogo en el cliente (hasta tener backend): filtro sincronizado con la URL,
 * búsqueda, y archivar (con deshacer durante unos segundos) o duplicar.
 */
export function useCatalogo(inicial: Producto[], filtroInicial: Filtro) {
  const [lista, setLista] = useState(inicial);
  const [filtro, setFiltroState] = useState<Filtro>(filtroInicial);
  const [busqueda, setBusqueda] = useState("");
  const [archivado, setArchivado] = useState<Archivado | null>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  /** Cambia el filtro y lo deja en la URL (?estado=) sin volver a pedir la página. */
  const setFiltro = useCallback((f: Filtro) => {
    setFiltroState(f);
    const url = new URL(window.location.href);
    if (f === "todos") url.searchParams.delete("estado");
    else url.searchParams.set("estado", f);
    window.history.replaceState(null, "", url);
  }, []);

  const archivar = useCallback(
    (id: string) => {
      const producto = lista.find((p) => p.id === id);
      if (!producto) return;
      setArchivado({ producto });
      setLista((prev) => prev.map((p) => (p.id === id ? { ...p, estado: "archivado" } : p)));
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setArchivado(null), 6000);
    },
    [lista],
  );

  /** Devuelve el producto tal como estaba (incluido su estado anterior). */
  const deshacer = useCallback(() => {
    if (!archivado) return;
    setLista((prev) => prev.map((p) => (p.id === archivado.producto.id ? archivado.producto : p)));
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

  return { visibles, conteos, filtro, setFiltro, busqueda, setBusqueda, archivar, deshacer, archivado, duplicar: duplicarProducto };
}
