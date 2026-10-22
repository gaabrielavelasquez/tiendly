import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PanelMain } from "@/components/panel";
import { FormularioProducto } from "@/features/productos/components/form/formulario-producto";
import { desdeProducto } from "@/features/productos/lib/formulario";
import { obtenerProducto } from "@/features/productos/lib/mock";
import { slugPanel } from "@/lib/sesion";

export const metadata: Metadata = { title: "Editar producto · Tiendly" };

type PageProps = { params: Promise<{ id: string }> };

/** Editar producto: el mismo formulario, prellenado. Si el id no existe, 404. */
export default async function EditarProductoPage({ params }: PageProps) {
  const { id } = await params;
  const producto = await obtenerProducto(await slugPanel(), id);
  if (!producto) notFound();
  return (
    <PanelMain className="lg:pt-0">
      <FormularioProducto titulo={producto.nombre} inicial={desdeProducto(producto)} id={producto.id} />
    </PanelMain>
  );
}
