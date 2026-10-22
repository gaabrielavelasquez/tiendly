import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { PanelMain } from "@/components/panel";
import { FormularioCupon } from "@/features/cupones/components/formulario-cupon";
import { obtenerCupones } from "@/features/cupones/lib/mock";
import { cuponesEnUso, limiteCupones } from "@/features/cupones/lib/reglas";
import { tiendaActual } from "@/lib/sesion";
import { AHORA } from "@/features/pedidos/lib/mock";

export const metadata: Metadata = { title: "Crear cupón · Tiendly" };

/** Crear cupón. Plan Free con el límite lleno: vuelve a la lista (que explica qué hacer). Pro: sin límite. */
export default async function NuevoCuponPage() {
  await connection(); // dinámica: el límite se revisa en cada visita, no al compilar
  const cupones = await obtenerCupones();
  const limite = limiteCupones(tiendaActual.plan);
  if (limite !== null && cuponesEnUso(cupones, AHORA.slice(0, 10)) >= limite) redirect("/panel/cupones");
  return (
    <PanelMain>
      <FormularioCupon otros={cupones} />
    </PanelMain>
  );
}
