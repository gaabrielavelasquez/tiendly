"use client";

import { CircleCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { Buscador, FiltrosRapidos, NuevoProducto, PanelHeader, type OpcionFiltro } from "@/components/panel";
import { Button } from "@/components/ui";
import { plural } from "@/lib/formato";
import { catalogoGlow, stockTotal, type ProductoProto } from "../../lib/datos";
import { estadoOferta } from "../../lib/oferta";
import { CONTENEDOR } from "../comunes";
import { ControlPrototipo } from "../control-prototipo";
import { BarraSeleccionDesktop, BarraSeleccionMovil } from "./barras-seleccion";
import { FilaMovil } from "./fila-producto";
import { HojaOferta } from "./hoja-oferta";
import { TablaProto } from "./tabla-proto";

type Filtro = "todos" | "activos" | "en-oferta" | "agotados" | "pausados";
const FILTROS: OpcionFiltro<Filtro>[] = [
  { id: "todos", label: "Todos" }, { id: "activos", label: "Activos" }, { id: "en-oferta", label: "En oferta" }, { id: "agotados", label: "Agotados" }, { id: "pausados", label: "Pausados" },
];
const sinOferta = (p: ProductoProto): ProductoProto => ({ ...p, precio: p.precioAntes && p.precioAntes > p.precio ? p.precioAntes : p.precio, precioAntes: undefined, oferta: undefined });

/**
 * PROTOTIPO · Productos (0031 + 0034, ronda 2): filtro "En oferta" (activas y programadas, con "Programada"),
 * selección en desktop (casillas) y modo selección en móvil, con una sola salida ("Cancelar", arriba) y una barra
 * abajo: "Poner en oferta (3)" + "Más" (Pausar, Quitar oferta). Cada acción en lote se puede deshacer.
 */
export function ProductosProto({ hoy }: { hoy: string }) {
  const [lista, setLista] = useState<ProductoProto[]>(() => catalogoGlow(hoy));
  const [filtro, setFiltro] = useState<Filtro>("todos");
  const [busqueda, setBusqueda] = useState("");
  const [seleccion, setSeleccion] = useState<Set<string>>(new Set());
  const [modo, setModo] = useState(false);
  const [hoja, setHoja] = useState(false);
  const [aviso, setAviso] = useState<{ texto: string; previo: ProductoProto[] } | null>(null);

  const conOfertaHoy = (p: ProductoProto) => ["activa", "programada"].includes(estadoOferta(p, hoy));
  const cumple: Record<Filtro, (p: ProductoProto) => boolean> = {
    todos: () => true, activos: (p) => p.estado === "activo", agotados: (p) => stockTotal(p) === 0, pausados: (p) => p.estado === "pausado", "en-oferta": conOfertaHoy,
  };
  const conteos = Object.fromEntries(FILTROS.map((f) => [f.id, lista.filter(cumple[f.id]).length])) as Record<Filtro, number>;
  const visibles = useMemo(() => lista.filter((p) => cumple[filtro](p) && p.nombre.toLowerCase().includes(busqueda.toLowerCase())), [lista, filtro, busqueda]); // eslint-disable-line react-hooks/exhaustive-deps
  const elegidos = lista.filter((p) => seleccion.has(p.id));
  const conOferta = elegidos.filter((p) => estadoOferta(p, hoy) !== "sin-oferta").length;

  const alternar = (id: string) => setSeleccion((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  const todos = () => setSeleccion((s) => (visibles.every((p) => s.has(p.id)) ? new Set() : new Set(visibles.map((p) => p.id))));
  const salir = () => (setModo(false), setSeleccion(new Set()));
  /** Aplica un cambio a los seleccionados, avisa y guarda la lista anterior para "Deshacer". */
  const enLote = (cambio: (p: ProductoProto) => ProductoProto, texto: string) => {
    setAviso({ texto, previo: lista });
    setLista((l) => l.map((p) => (seleccion.has(p.id) ? cambio(p) : p)));
    setHoja(false); salir();
  };
  const acciones = {
    cantidad: seleccion.size, conOferta,
    onPausar: () => enLote((p) => ({ ...p, estado: "pausado" }), `${plural(seleccion.size, "producto pausado", "productos pausados")}.`),
    onQuitarOferta: () => enLote((p) => (estadoOferta(p, hoy) === "sin-oferta" ? p : sinOferta(p)), `Quitaste la oferta de ${plural(conOferta, "producto", "productos")}.`),
    onPonerEnOferta: () => setHoja(true),
  };

  return (
    <>
      <PanelHeader titulo="Productos" subtitulo={`${plural(lista.length, "producto", "productos")} · ${conteos["en-oferta"]} en oferta.`} accion={<NuevoProducto />} />
      <ControlPrototipo etiqueta="Datos de ejemplo"><span className="text-caption text-fg-secondary">En móvil: “Seleccionar” o mantén presionado un producto.</span></ControlPrototipo>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2 lg:flex-row-reverse lg:items-center lg:justify-between">
          <div className="flex items-center gap-2">
            <Buscador id="buscar" etiqueta="Buscar productos" placeholder="Buscar por nombre" valor={busqueda} onCambio={setBusqueda} className="min-w-0 flex-1 lg:w-72" />
            <Button variant="quiet" size="sm" className="shrink-0 rounded-full lg:hidden" onClick={() => (modo ? salir() : setModo(true))}>{modo ? "Cancelar" : "Seleccionar"}</Button>
          </div>
          <FiltrosRapidos etiqueta="Filtrar productos" opciones={FILTROS} valor={filtro} conteos={conteos} onCambio={setFiltro} />
        </div>
        <BarraSeleccionDesktop {...acciones} onLimpiar={() => setSeleccion(new Set())} />
        {modo && (
          <div className="flex items-center justify-between text-body-sm lg:hidden" aria-live="polite">
            <span className="font-semibold text-fg">{seleccion.size ? plural(seleccion.size, "seleccionado", "seleccionados") : "Toca los productos que quieres cambiar."}</span>
            <button type="button" onClick={todos} className="link-text min-h-11">{visibles.every((p) => seleccion.has(p.id)) ? "Ninguno" : "Todos"}</button>
          </div>
        )}
        <div className={`${CONTENEDOR} overflow-hidden`}>
          <div className="hidden lg:block"><TablaProto productos={visibles} hoy={hoy} seleccion={seleccion} onAlternar={alternar} onTodos={todos} /></div>
          <ul className="flex flex-col divide-y divide-line-subtle lg:hidden">
            {visibles.map((p) => <FilaMovil key={p.id} p={p} hoy={hoy} seleccionando={modo} marcado={seleccion.has(p.id)} onAlternar={() => alternar(p.id)} onMantener={() => (setModo(true), setSeleccion(new Set([p.id])))} />)}
          </ul>
        </div>
      </div>

      {modo && <BarraSeleccionMovil {...acciones} />}
      {hoja && <HojaOferta productos={elegidos} hoy={hoy} onCerrar={() => setHoja(false)}
        onAplicar={(c) => enLote((p) => (c[p.id] ? { ...p, ...c[p.id] } : p), `${plural(Object.keys(c).length, "producto quedó", "productos quedaron")} en oferta.`)} />}
      {aviso && (
        <div role="status" className="fixed inset-x-4 bottom-24 z-30 flex justify-center lg:inset-x-auto lg:right-8 lg:bottom-8">
          <p className="flex w-full max-w-sm items-center gap-3 rounded-card bg-inverse py-2 pr-2 pl-4 text-body-sm text-fg-inverse shadow-overlay">
            <CircleCheck aria-hidden strokeWidth={1.5} className="size-4 shrink-0" />
            <span className="flex-1">{aviso.texto}</span>
            <button type="button" onClick={() => (setLista(aviso.previo), setAviso(null))} className="h-9 rounded-theme px-3 font-semibold hover:bg-fg-inverse/10">Deshacer</button>
          </p>
        </div>
      )}
    </>
  );
}
