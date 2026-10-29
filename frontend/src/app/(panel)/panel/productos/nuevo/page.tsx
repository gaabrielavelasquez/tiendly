import type { Metadata } from "next";
import { PanelMain } from "@/components/panel";
import { FormularioProducto } from "@/features/productos/components/form/formulario-producto";
import { formVacio } from "@/features/productos/lib/formulario";
import { categoriasDeTienda, tablasDeTienda } from "@/features/productos/lib/mock";
import { hoyLima } from "@/lib/reloj";
import { slugPanel } from "@/lib/sesion";

export const metadata: Metadata = { title: "Nuevo producto · Tiendly" };

/** Crear producto. Se publica al guardar si tiene foto, precio y stock (decisión 0028); si no, queda pausado. */
export default async function NuevoProductoPage() {
  const slug = await slugPanel();
  const [categorias, tablas] = await Promise.all([categoriasDeTienda(slug), tablasDeTienda(slug)]);
  return (
    <PanelMain className="lg:pt-0">
      <FormularioProducto titulo="Nuevo producto" inicial={formVacio()} hoy={hoyLima()} categorias={categorias} tablas={tablas} />
    </PanelMain>
  );
}
