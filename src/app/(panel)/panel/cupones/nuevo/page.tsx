import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { PanelMain } from "@/components/panel";
import { FormularioCupon } from "@/features/cupones/components/formulario-cupon";
import { obtenerCupones } from "@/features/cupones/lib/mock";
import { cuponesEnUso, LIMITE_FREE } from "@/features/cupones/lib/reglas";
import { AHORA } from "@/features/pedidos/lib/mock";

export const metadata: Metadata = { title: "Crear cupón · Tiendly" };

/** Crear cupón. Con el límite del Plan Free lleno, vuelve a la lista (que explica qué hacer). */
export default async function NuevoCuponPage() {
  await connection(); // dinámica: el límite se revisa en cada visita, no al compilar
  const cupones = await obtenerCupones();
  if (cuponesEnUso(cupones, AHORA.slice(0, 10)) >= LIMITE_FREE) redirect("/panel/cupones");
  return (
    <PanelMain>
      <FormularioCupon otros={cupones} />
    </PanelMain>
  );
}
