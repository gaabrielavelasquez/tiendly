"use client";

import { Download, Inbox, SearchX } from "lucide-react";
import { Buscador, CONTENEDOR, FiltrosRapidos, PanelHeader, type OpcionFiltro } from "@/components/panel";
import { Button } from "@/components/ui";
import { plural } from "@/lib/formato";
import type { Filtro, Pedido } from "../types";
import { usePedidos } from "../hooks/use-pedidos";
import { ListaMovilPedidos } from "./lista-movil";
import { EstadoPedidos } from "./estado-pedidos";
import { TablaPedidos } from "./tabla-pedidos";

const FILTROS: OpcionFiltro<Filtro>[] = [
  { id: "todos", label: "Todos" },
  { id: "para-atender", label: "Para atender" },
  { id: "por-cobrar", label: "Por cobrar" },
  { id: "reservas", label: "Vencen hoy" },
  { id: "por-enviar", label: "Por enviar" },
];

type VistaProps = { pedidos: Pedido[]; ahora: string; filtroInicial: Filtro };

/** Pedidos: búsqueda + filtros por flujo de trabajo, y tabla con doble estado (pago y entrega). */
export function PedidosVista({ pedidos, ahora, filtroInicial }: VistaProps) {
  const v = usePedidos(pedidos, ahora, filtroInicial);
  const atender = v.conteos["para-atender"];
  const subtitulo = v.total
    ? `${plural(v.total, "pedido", "pedidos")}${atender ? ` · ${plural(atender, "para atender", "para atender")}` : " · todo al día"}.`
    : "Aquí vas a ver los pedidos que te hagan por tu tienda y por WhatsApp.";

  const exportar = (
    // Solo desktop (decisión 0027): una planilla no se trabaja en el celular.
    <Button variant="secondary" onClick={v.exportar} disabled={v.visibles.length === 0} className="hidden lg:inline-flex">
      <span className="flex items-center gap-2">
        <Download aria-hidden strokeWidth={1.6} className="size-4" />
        Exportar
      </span>
    </Button>
  );

  return (
    <>
      <div className="min-w-0 [&_h1]:font-display-light">
        <PanelHeader titulo="Pedidos" subtitulo={subtitulo} accion={v.total ? exportar : undefined} />
      </div>

      {v.total === 0 ? (
        <div className={CONTENEDOR}>
          <EstadoPedidos
            icon={Inbox}
            title="Todavía no tienes pedidos"
            description="Comparte el link de tu tienda por WhatsApp e Instagram. Cada pedido nuevo aparece aquí, con su pago y su entrega."
          />
        </div>
      ) : (
        <div className="flex min-w-0 flex-col gap-3">
          <div className="flex min-w-0 flex-col gap-2 lg:flex-row-reverse lg:items-center lg:justify-between">
            <Buscador
              id="buscar-pedidos"
              etiqueta="Buscar pedidos por número, cliente o celular"
              placeholder="Buscar por pedido, cliente o celular"
              valor={v.busqueda}
              onCambio={v.setBusqueda}
              className="min-w-0 lg:w-80"
            />
            <FiltrosRapidos etiqueta="Filtrar pedidos" opciones={FILTROS} valor={v.filtro} conteos={v.conteos} onCambio={v.setFiltro} />
          </div>
          {v.visibles.length === 0 ? (
            <div className={CONTENEDOR}><EstadoPedidos
              icon={SearchX}
              title={v.busqueda ? "No encontramos pedidos" : "Nada por aquí"}
              description={v.busqueda ? `Nada coincide con "${v.busqueda}" en este filtro.` : "No hay pedidos en este filtro. Todo al día."}
              action={
                <Button variant="secondary" onClick={() => (v.setBusqueda(""), v.setFiltro("todos"))}>
                  Ver todos los pedidos
                </Button>
              }
            /></div>
          ) : (
            <>
              <div className={`${CONTENEDOR} hidden overflow-hidden lg:block`}>
                <TablaPedidos pedidos={v.visibles} ahora={ahora} />
              </div>
              <div className="lg:hidden">
                <ListaMovilPedidos pedidos={v.visibles} ahora={ahora} />
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
