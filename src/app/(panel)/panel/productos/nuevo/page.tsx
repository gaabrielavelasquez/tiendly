import type { Metadata } from "next";
import { PanelMain } from "@/components/panel";
import { FormularioProducto } from "@/features/productos/components/form/formulario-producto";
import { formVacio } from "@/features/productos/lib/formulario";

export const metadata: Metadata = { title: "Nuevo producto · Tiendly" };

/** Crear producto. Arranca como borrador: no se ve en la tienda hasta activarlo. */
export default function NuevoProductoPage() {
  return (
    <PanelMain className="lg:pt-0">
      <FormularioProducto titulo="Nuevo producto" inicial={formVacio()} />
    </PanelMain>
  );
}
