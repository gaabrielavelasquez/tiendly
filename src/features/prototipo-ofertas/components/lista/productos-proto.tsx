"use client";

import { CircleCheck, Pause } from "lucide-react";
import { useMemo, useState } from "react";
import { Buscador, FiltrosRapidos, NuevoProducto, PanelHeader, type OpcionFiltro } from "@/components/panel";
import { Button } from "@/components/ui";
import { plural } from "@/lib/formato";
import { catalogoGlow, stockTotal, type ProductoProto } from "../../lib/datos";
import { estadoOferta } from "../../lib/oferta";
import { CONTENEDOR } from "../comunes";
import { ControlPrototipo } from "../control-prototipo";
import { FilaMovil } from "./fila-producto";
import { HojaOferta } from "./hoja-oferta";
import { TablaProto } from "./tabla-proto";

type Filtro = "todos" | "activos" | "en-oferta" | "agotados" | "pausados";
const FILTROS: OpcionFiltro<Filtro>[] = [
  { id: "todos", label: "Todos" }, { id: "activos", label: "Activos" }, { id: "en-oferta", label: "En oferta" }, { id: "agotados", label: "Agotados" }, { id: "pausados", label: "Pausados" },
];

/**
 * PROTOTIPO · Productos con el pase 0031 y 0034: filtro "En oferta" (activas y programadas), selección en desktop
 * (casillas, como hoy) y modo selección en móvil ("Seleccionar" o mantener presionado) con barra fija abajo.
 */
export function ProductosProto({ hoy }: { hoy: string }) {
  const [lista, setLista] = useState<ProductoProto[]>(() => catalogoGlow(hoy));
  const [filtro, setFiltro] = useState<Filtro>("todos");
  const [busqueda, setBusqueda] = useState("");
  const [seleccion, setSeleccion] = useState<Set<string>>(new Set());
  const [modo, setModo] = useState(false);
  const [hoja, setHoja] = useState(false);
  const [aviso, setAviso] = useState("");

  const cumple: Record<Filtro, (p: ProductoProto) => boolean> = {
    todos: () => true, activos: (p) => p.estado === "activo", agotados: (p) => stockTotal(p) === 0, pausados: (p) => p.estado === "pausado",
    "en-oferta": (p) => ["activa", "programada"].includes(estadoOferta(p, hoy)),
  };
  const conteos = Object.fromEntries(FILTROS.map((f) => [f.id, lista.filter(cumple[f.id]).length])) as Record<Filtro, number>;
  const visibles = useMemo(() => lista.filter((p) => cumple[filtro](p) && p.nombre.toLowerCase().includes(busqueda.toLowerCase())), [lista, filtro, busqueda]); // eslint-disable-line react-hooks/exhaustive-deps
  const elegidos = lista.filter((p) => seleccion.has(p.id));

  const alternar = (id: string) => setSeleccion((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  const todos = () => setSeleccion((s) => (visibles.every((p) => s.has(p.id)) ? new Set() : new Set(visibles.map((p) => p.id))));
  const salir = () => (setModo(false), setSeleccion(new Set()));
  const aplicar = (c: Record<string, Partial<ProductoProto>>) => {
    setLista((l) => l.map((p) => (c[p.id] ? { ...p, ...c[p.id] } : p)));
    setAviso(`${plural(Object.keys(c).length, "producto quedó", "productos quedaron")} en oferta.`);
    setHoja(false); salir();
  };

  return (
    <>
      <PanelHeader titulo="Productos" subtitulo={`${plural(lista.length, "producto", "productos")} · ${plural(conteos["en-oferta"], "en oferta", "en oferta")}.`} accion={<NuevoProducto />} />
      <ControlPrototipo etiqueta="Datos de ejemplo"><span className="text-caption text-fg-secondary">En móvil: “Seleccionar” o mantén presionado un producto.</span></ControlPrototipo>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2 lg:flex-row-reverse lg:items-center lg:justify-between">
          <div className="flex items-center gap-2">
            <Buscador id="buscar" etiqueta="Buscar productos" placeholder="Buscar por nombre" valor={busqueda} onCambio={setBusqueda} className="flex-1 lg:w-72" />
            <Button variant="quiet" size="sm" className="rounded-full lg:hidden" onClick={() => (modo ? salir() : setModo(true))}>{modo ? "Listo" : "Seleccionar"}</Button>
          </div>
          <FiltrosRapidos etiqueta="Filtrar productos" opciones={FILTROS} valor={filtro} conteos={conteos} onCambio={setFiltro} />
        </div>

        {seleccion.size > 0 && (
          <div role="region" aria-label="Acciones para los seleccionados" className="hidden items-center gap-3 rounded-card bg-sunken px-4 py-2 lg:flex">
            <p className="flex-1 text-body-sm font-semibold text-fg" aria-live="polite">{plural(seleccion.size, "seleccionado", "seleccionados")}</p>
            <Button variant="ghost" size="sm" onClick={salir}>Quitar selección</Button>
            <Button variant="secondary" size="sm"><span className="flex items-center gap-1.5"><Pause aria-hidden strokeWidth={1.5} className="size-4" />Pausar</span></Button>
            <Button variant="secondary" size="sm" onClick={() => setHoja(true)}>Poner en oferta</Button>
          </div>
        )}
        {modo && (
          <div className="flex items-center justify-between text-body-sm lg:hidden" aria-live="polite">
            <span className="font-semibold text-fg">{seleccion.size ? plural(seleccion.size, "seleccionado", "seleccionados") : "Toca los productos que quieres poner en oferta."}</span>
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

      {modo && (
        <div className="fixed inset-x-0 bottom-0 z-45 flex gap-2 border-t border-line-subtle bg-surface px-4 pt-3 pb-[max(calc(var(--spacing)*3),env(safe-area-inset-bottom))] lg:hidden">
          <Button variant="ghost" className="flex-1" onClick={salir}>Cancelar</Button>
          <Button className="flex-[2]" disabled={!seleccion.size} onClick={() => setHoja(true)}>Poner en oferta{seleccion.size ? ` (${seleccion.size})` : ""}</Button>
        </div>
      )}
      {hoja && <HojaOferta productos={elegidos} hoy={hoy} onCerrar={() => setHoja(false)} onAplicar={aplicar} />}
      {aviso && (
        <div role="status" className="fixed inset-x-4 bottom-24 z-30 flex justify-center lg:inset-x-auto lg:right-8 lg:bottom-8">
          <p className="flex w-full max-w-sm items-center gap-3 rounded-card bg-inverse px-4 py-3 text-body-sm text-fg-inverse shadow-overlay">
            <CircleCheck aria-hidden strokeWidth={1.5} className="size-4 shrink-0" />{aviso}
            <button type="button" onClick={() => setAviso("")} className="ml-auto font-semibold">Ok</button>
          </p>
        </div>
      )}
    </>
  );
}
