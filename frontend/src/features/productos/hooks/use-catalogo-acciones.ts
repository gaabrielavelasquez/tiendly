"use client";

import { useCallback, useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";
import { plural } from "@/lib/formato";
import type { Producto } from "../types";
import { cambiarEstados, duplicarProducto, ponerEnOferta, quitarOferta, restaurarProductos } from "../lib/acciones";
import type { OfertaEnLote } from "../lib/reglas";
import { estadoOferta } from "../lib/ofertas";

export type Aviso = { texto: string; previos: Producto[] };
const versiones = (productos: Producto[]) => Object.fromEntries(productos.flatMap(p => p.version === undefined ? [] : [[p.id, p.version]]));

/** Confirma cada escritura antes de mostrar éxito; Deshacer usa la nueva versión del servidor. */
export function useCatalogoAcciones(lista: Producto[], setLista: Dispatch<SetStateAction<Producto[]>>, elegidos: Producto[], hoy: string, salirSeleccion: () => void) {
  const [aviso, setAviso] = useState<Aviso | null>(null);
  const [fallo, setFallo] = useState("");
  const [guardando, setGuardando] = useState(false);
  const ocupado = useRef(false);
  const ultimoError = useRef("");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const ejecutar = useCallback(async <T extends object,>(command: () => Promise<T | { error: string }>): Promise<T | null> => {
    if (ocupado.current) return null;
    ocupado.current = true;
    setGuardando(true);
    setFallo("");
    ultimoError.current = "";
    try {
      const result = await command();
      if ("error" in result) { ultimoError.current = result.error; setFallo(result.error); return null; }
      return result;
    } catch {
      ultimoError.current = "No pudimos guardar los cambios. Revisa tu conexión e inténtalo de nuevo.";
      setFallo(ultimoError.current);
      return null;
    } finally {
      ocupado.current = false;
      setGuardando(false);
    }
  }, []);

  const reemplazar = useCallback((nuevos: Producto[]) => {
    const porId = new Map(nuevos.map(p => [p.id, p]));
    setLista(actual => actual.map(p => porId.get(p.id) ?? p));
  }, [setLista]);

  const aplicar = useCallback((nuevos: Producto[], previos: Producto[], texto: string) => {
    reemplazar(nuevos);
    setAviso({ texto, previos: previos.filter(p => nuevos.some(nuevo => nuevo.id === p.id)) });
    salirSeleccion();
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setAviso(null), 8000);
  }, [reemplazar, salirSeleccion]);

  const pausar = useCallback(async (productos: Producto[]) => {
    if (!productos.length) return;
    const nuevos = await ejecutar(() => cambiarEstados(Object.fromEntries(productos.map(p => [p.id, "pausado" as const])), versiones(productos)));
    if (nuevos) aplicar(nuevos, productos, productos.length === 1 ? `${productos[0].nombre} se pausó. Ya no se ve en tu tienda.` : `${productos.length} productos se pausaron. Ya no se ven en tu tienda.`);
  }, [ejecutar, aplicar]);

  const ofertar = useCallback(async (oferta: OfertaEnLote) => {
    const result = await ejecutar(() => ponerEnOferta(elegidos.map(p => p.id), oferta, versiones(elegidos)));
    if (!result) return ultimoError.current || "Espera a que termine el guardado e inténtalo de nuevo.";
    aplicar(result.productos, elegidos, `${plural(result.productos.length, "producto quedó", "productos quedaron")} en oferta.${result.saltados ? ` ${plural(result.saltados, "no cambió", "no cambiaron")}: el precio no bajaba.` : ""}`);
    return "";
  }, [ejecutar, elegidos, aplicar]);

  const quitar = useCallback(async () => {
    const previos = elegidos.filter(p => estadoOferta(p, hoy) !== "sin-oferta");
    if (!previos.length) return;
    const nuevos = await ejecutar(() => quitarOferta(previos.map(p => p.id), versiones(previos)));
    if (nuevos) aplicar(nuevos, previos, `Quitaste la oferta de ${plural(previos.length, "producto", "productos")}.`);
  }, [ejecutar, elegidos, hoy, aplicar]);

  const deshacer = useCallback(async () => {
    if (!aviso || ocupado.current) return;
    clearTimeout(timer.current);
    const ids = new Set(aviso.previos.map(p => p.id));
    const nuevos = await ejecutar(() => restaurarProductos(aviso.previos.map(({ id, precio, precioAntes, oferta, estado }) => ({ id, precio, precioAntes, oferta, estado })), versiones(lista.filter(p => ids.has(p.id)))));
    if (nuevos) { reemplazar(nuevos); setAviso(null); }
  }, [aviso, ejecutar, lista, reemplazar]);

  const duplicar = useCallback(async (id: string) => {
    const copia = await ejecutar(() => duplicarProducto(id));
    if (!copia) return;
    setLista(actual => {
      const index = actual.findIndex(p => p.id === id);
      return index < 0 ? [copia, ...actual] : [...actual.slice(0, index + 1), copia, ...actual.slice(index + 1)];
    });
  }, [ejecutar, setLista]);

  return { pausar, ponerEnOferta: ofertar, quitarOferta: quitar, deshacer, duplicar, aviso, guardando, fallo };
}
