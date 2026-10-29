"use client";

import { PackageOpen, SearchX } from "lucide-react";
import { useState } from "react";
import { Buscador, CONTENEDOR, FiltrosRapidos, NuevoProducto, PanelHeader, type OpcionFiltro } from "@/components/panel";
import { Button, Card, EmptyState } from "@/components/ui";
import { cn } from "@/lib/cn";
import { plural } from "@/lib/formato";
import type { Filtro, Producto } from "../types";
import { useCatalogo } from "../hooks/use-catalogo";
import { AvisoDeshacer } from "./aviso-deshacer";
import { BarraSeleccion } from "./barra-seleccion";
import { BarraSeleccionMovil } from "./barra-seleccion-movil";
import { HojaOferta } from "./hoja-oferta";
import { ListaMovil } from "./lista-movil";
import { TablaProductos } from "./tabla-productos";

const FILTROS: OpcionFiltro<Filtro>[] = [
  { id: "todos", label: "Todos" },
  { id: "activos", label: "Activos" },
  { id: "en-oferta", label: "En oferta" },
  { id: "bajo-stock", label: "Bajo stock" },
  { id: "agotados", label: "Agotados" },
  { id: "pausados", label: "Pausados" },
];

type VistaProps = { productos: Producto[]; filtroInicial: Filtro; hoy: string };

/**
 * Productos (pase 0031 + 0034): cabecera con CTA; buscador y filtros fuera del contenedor; la lista en UN contenedor
 * (tabla en desktop, filas en móvil). Selección: casillas en desktop; en móvil, modo selección con "Seleccionar" o
 * manteniendo presionado, y una sola salida ("Cancelar"). Acciones en lote: Poner en oferta, Quitar oferta y Pausar.
 */
export function ProductosVista({ productos, filtroInicial, hoy }: VistaProps) {
  const c = useCatalogo(productos, filtroInicial, hoy);
  const [hoja, setHoja] = useState(false);
  const atencion = c.conteos["bajo-stock"] + c.conteos.agotados;
  const subtitulo = c.conteos.todos
    ? `${plural(c.conteos.todos, "producto", "productos")}${atencion ? ` · ${plural(atencion, "necesita", "necesitan")} reposición` : ""}.`
    : "Aquí vas a ver tu catálogo, con stock y precios.";
  const acciones = { cantidad: c.elegidos.length, conOferta: c.conOferta, onPausar: () => c.pausar(c.elegidos), onQuitarOferta: c.quitarOferta, onPonerEnOferta: () => setHoja(true) };
  const todosMarcados = c.visibles.length > 0 && c.visibles.every((p) => c.seleccion.has(p.id));

  return (
    <>
      {/* Un solo CTA por vista: con el catálogo vacío, el botón vive dentro del estado vacío. */}
      <PanelHeader titulo="Productos" subtitulo={subtitulo} accion={c.conteos.todos ? <NuevoProducto /> : undefined} />
      {c.conteos.todos > 0 && !c.modoSeleccion && <NuevoProducto className="w-full lg:hidden" />}

      {c.conteos.todos === 0 ? (
        <Card className="border-0 shadow-contenedor">
          <EmptyState icon={PackageOpen} title="Todavía no tienes productos" description="Agrega tu primer producto. Si tiene opciones como color, talla o tamaño, van en el mismo producto." action={<NuevoProducto />} />
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2 lg:flex-row-reverse lg:items-center lg:justify-between">
            <div className="flex items-center gap-2">
              <Buscador id="buscar-productos" etiqueta="Buscar productos por nombre o SKU" placeholder="Buscar por nombre o SKU" valor={c.busqueda} onCambio={c.setBusqueda} className="min-w-0 flex-1 lg:w-80" />
              <Button variant="quiet" size="sm" className="shrink-0 rounded-full lg:hidden" onClick={() => (c.modoSeleccion ? c.salirSeleccion() : c.entrarSeleccion())}>
                {c.modoSeleccion ? "Cancelar" : "Seleccionar"}
              </Button>
            </div>
            <FiltrosRapidos etiqueta="Filtrar productos" opciones={FILTROS} valor={c.filtro} conteos={c.conteos} onCambio={c.setFiltro} />
          </div>
          <div className="hidden lg:block"><BarraSeleccion {...acciones} onLimpiar={c.limpiarSeleccion} /></div>
          {c.modoSeleccion && (
            <div className="flex items-center justify-between text-body-sm lg:hidden" aria-live="polite">
              <span className="font-semibold text-fg">{c.elegidos.length ? plural(c.elegidos.length, "seleccionado", "seleccionados") : "Toca los productos que quieres cambiar."}</span>
              <button type="button" onClick={c.alternarTodos} className="link-text min-h-11">{todosMarcados ? "Ninguno" : "Todos"}</button>
            </div>
          )}
          <div className={cn(CONTENEDOR, "overflow-hidden")}>
            {c.visibles.length === 0 ? (
              <EmptyState icon={SearchX} title="No encontramos productos"
                description={c.busqueda ? `Nada coincide con "${c.busqueda}" en este filtro.` : "No hay productos en este filtro."}
                action={<Button variant="secondary" onClick={() => (c.setBusqueda(""), c.setFiltro("todos"))}>Ver todos los productos</Button>} />
            ) : (
              <>
                <div className="hidden lg:block">
                  <TablaProductos productos={c.visibles} hoy={hoy} seleccion={c.seleccion} onAlternar={c.alternar} onAlternarTodos={c.alternarTodos} onDuplicar={c.duplicar} />
                </div>
                <div className="lg:hidden">
                  <ListaMovil productos={c.visibles} hoy={hoy} onDuplicar={c.duplicar} seleccionando={c.modoSeleccion} seleccion={c.seleccion} onAlternar={c.alternar} onMantener={c.entrarSeleccion} />
                </div>
              </>
            )}
          </div>
        </div>
      )}
      {c.modoSeleccion && <BarraSeleccionMovil {...acciones} />}
      {hoja && (
        <HojaOferta productos={c.elegidos} hoy={hoy} onCerrar={() => setHoja(false)}
          onAplicar={async (o) => { const e = await c.ponerEnOferta(o); if (!e) setHoja(false); return e; }} />
      )}
      <AvisoDeshacer aviso={c.aviso} onDeshacer={c.deshacer} />
    </>
  );
}
