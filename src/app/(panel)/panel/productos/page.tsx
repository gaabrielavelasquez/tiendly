import type { Metadata } from "next";
import { PanelMain } from "@/components/panel";
import { ProductosVista } from "@/features/productos/components/productos-vista";
import { leerEscenario, obtenerProductos } from "@/features/productos/lib/mock";
import { leerFiltro } from "@/features/productos/lib/reglas";

export const metadata: Metadata = { title: "Productos · Tiendly" };

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

/**
 * Productos (decisión 0011). Datos simulados: ?escenario=catalogo (por defecto), vacio o error.
 * El filtro va en ?estado= (todos, activos, bajo-stock, agotados), así Inicio puede abrir la lista ya filtrada.
 */
export default async function PanelProductos({ searchParams }: PageProps) {
  const { escenario, estado } = await searchParams;
  const productos = await obtenerProductos(leerEscenario(escenario));
  return (
    <PanelMain>
      <ProductosVista productos={productos} filtroInicial={leerFiltro(Array.isArray(estado) ? estado[0] : estado)} />
    </PanelMain>
  );
}
