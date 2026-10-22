"use client";

import { PackageOpen, SearchX } from "lucide-react";
import { Buscador, FiltrosRapidos, NuevoProducto, PanelHeader, type OpcionFiltro } from "@/components/panel";
import { Button, Card, EmptyState } from "@/components/ui";
import { plural } from "@/lib/formato";
import type { Filtro, Producto } from "../types";
import { useCatalogo } from "../hooks/use-catalogo";
import { AvisoDeshacer } from "./aviso-deshacer";
import { BarraSeleccion } from "./barra-seleccion";
import { ListaMovil } from "./lista-movil";
import { TablaProductos } from "./tabla-productos";

const FILTROS: OpcionFiltro<Filtro>[] = [
  { id: "todos", label: "Todos" },
  { id: "activos", label: "Activos" },
  { id: "bajo-stock", label: "Bajo stock" },
  { id: "agotados", label: "Agotados" },
  { id: "pausados", label: "Pausados" },
];

type VistaProps = { productos: Producto[]; filtroInicial: Filtro };

/** Productos: cabecera con CTA, buscador + filtros rápidos, y tabla (desktop) o tarjetas (móvil). */
export function ProductosVista({ productos, filtroInicial }: VistaProps) {
  const c = useCatalogo(productos, filtroInicial);
  const atencion = c.conteos["bajo-stock"] + c.conteos.agotados;
  const subtitulo = c.conteos.todos
    ? `${plural(c.conteos.todos, "producto", "productos")}${atencion ? ` · ${plural(atencion, "necesita", "necesitan")} reposición` : ""}.`
    : "Aquí vas a ver tu catálogo, con stock y precios.";

  return (
    <>
      {/* Un solo CTA por vista: con el catálogo vacío, el botón vive dentro del estado vacío. */}
      <PanelHeader titulo="Productos" subtitulo={subtitulo} accion={c.conteos.todos ? <NuevoProducto /> : undefined} />
      {c.conteos.todos > 0 && <NuevoProducto className="w-full lg:hidden" />}

      {c.conteos.todos === 0 ? (
        <Card>
          <EmptyState
            icon={PackageOpen}
            title="Todavía no tienes productos"
            description="Agrega tu primer modelo con sus colores y tallas. Tus clientes lo verán en tu tienda apenas lo publiques."
            action={<NuevoProducto />}
          />
        </Card>
      ) : (
        <Card className="overflow-hidden p-0 lg:p-0">
          <div className="flex flex-col gap-2 border-b border-line-subtle px-4 pt-4 pb-2 lg:flex-row-reverse lg:items-center lg:justify-between lg:px-6 lg:py-3">
            <Buscador
              id="buscar-productos"
              etiqueta="Buscar productos por nombre o SKU"
              placeholder="Buscar por nombre o SKU"
              valor={c.busqueda}
              onCambio={c.setBusqueda}
              className="lg:w-80"
            />
            <FiltrosRapidos etiqueta="Filtrar productos" opciones={FILTROS} valor={c.filtro} conteos={c.conteos} onCambio={c.setFiltro} />
          </div>
          <div className="hidden lg:block">
            <BarraSeleccion cantidad={c.seleccionVisible.length} onPausar={() => c.pausar(c.seleccionVisible)} onLimpiar={c.limpiarSeleccion} />
          </div>
          {c.visibles.length === 0 ? (
            <EmptyState
              icon={SearchX}
              title="No encontramos productos"
              description={c.busqueda ? `Nada coincide con "${c.busqueda}" en este filtro.` : "No hay productos en este filtro."}
              action={
                <Button variant="secondary" onClick={() => (c.setBusqueda(""), c.setFiltro("todos"))}>
                  Ver todos los productos
                </Button>
              }
            />
          ) : (
            <>
              <div className="hidden lg:block">
                <TablaProductos
                  productos={c.visibles}
                  seleccion={c.seleccion}
                  onAlternar={c.alternar}
                  onAlternarTodos={c.alternarTodos}
                  onDuplicar={c.duplicar}
                />
              </div>
              <div className="lg:hidden">
                <ListaMovil productos={c.visibles} onDuplicar={c.duplicar} />
              </div>
            </>
          )}
        </Card>
      )}
      <AvisoDeshacer pausado={c.pausado} onDeshacer={c.deshacer} />
    </>
  );
}
