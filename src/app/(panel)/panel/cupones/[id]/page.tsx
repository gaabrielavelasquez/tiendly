import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PanelMain } from "@/components/panel";
import { FormularioCupon } from "@/features/cupones/components/formulario-cupon";
import { obtenerCupones } from "@/features/cupones/lib/mock";
import { estadoCupon } from "@/features/cupones/lib/reglas";
import { AHORA } from "@/features/pedidos/lib/mock";

export const metadata: Metadata = { title: "Editar cupón · Tiendly" };

type PageProps = { params: Promise<{ id: string }> };

/** Editar o eliminar un cupón (Figma, Cupones · eliminar). */
export default async function EditarCuponPage({ params }: PageProps) {
  const { id } = await params;
  const cupones = await obtenerCupones();
  const cupon = cupones.find((c) => c.id === id);
  if (!cupon) notFound();
  return (
    <PanelMain>
      <FormularioCupon cupon={cupon} estado={estadoCupon(cupon, AHORA.slice(0, 10))} otros={cupones.filter((c) => c.id !== id)} />
    </PanelMain>
  );
}
