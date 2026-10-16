"use client";

import { useCallback, useMemo, useState } from "react";
import type { Filtro, Pedido } from "../types";
import { aCsv } from "../lib/format";
import { conReglas, contarPorFiltro, filtrarPedidos } from "../lib/reglas";

/**
 * Lista de pedidos en el cliente: aplica la auto-cancelación de reservas, filtra (sincronizado con
 * ?estado=), busca y exporta a CSV lo que se está viendo.
 */
export function usePedidos(inicial: Pedido[], ahora: string, filtroInicial: Filtro) {
  const lista = useMemo(
    () => inicial.map((p) => conReglas(p, ahora)).sort((a, b) => b.creadoEl.localeCompare(a.creadoEl)),
    [inicial, ahora],
  );
  const [filtro, setFiltroState] = useState<Filtro>(filtroInicial);
  const [busqueda, setBusqueda] = useState("");

  const setFiltro = useCallback((f: Filtro) => {
    setFiltroState(f);
    const url = new URL(window.location.href);
    if (f === "todos") url.searchParams.delete("estado");
    else url.searchParams.set("estado", f);
    window.history.replaceState(null, "", url);
  }, []);

  const visibles = useMemo(() => filtrarPedidos(lista, filtro, busqueda), [lista, filtro, busqueda]);
  const conteos = useMemo(() => contarPorFiltro(lista), [lista]);

  /** Descarga un CSV con los pedidos visibles (respeta filtro y búsqueda). */
  const exportar = useCallback(() => {
    const url = URL.createObjectURL(new Blob([aCsv(visibles)], { type: "text/csv;charset=utf-8" }));
    const a = Object.assign(document.createElement("a"), { href: url, download: `pedidos-${filtro}.csv` });
    a.click();
    URL.revokeObjectURL(url);
  }, [visibles, filtro]);

  return { visibles, conteos, filtro, setFiltro, busqueda, setBusqueda, exportar, total: lista.length };
}
