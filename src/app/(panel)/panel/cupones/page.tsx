import type { Metadata } from "next";
import { PanelMain } from "@/components/panel";
import { VistaCupones } from "@/features/cupones/components/vista-cupones";
import { leerEscenario, obtenerCupones } from "@/features/cupones/lib/mock";
import { AHORA } from "@/features/pedidos/lib/mock";
import { herramientasDev } from "@/lib/entorno";

export const metadata: Metadata = { title: "Cupones · Tiendly" };

type PageProps = { searchParams: Promise<{ escenario?: string; guardado?: string }> };

/** Cupones (Figma, módulo 3; decisión 0008). ?escenario=vacio | limite | error muestra los otros estados. */
export default async function CuponesPage({ searchParams }: PageProps) {
  const { escenario, guardado } = await searchParams;
  const cupones = await obtenerCupones(leerEscenario(herramientasDev ? escenario : undefined));
  return (
    <PanelMain>
      <VistaCupones key={guardado ?? "lista"} inicial={cupones} hoy={AHORA.slice(0, 10)} creado={guardado} />
    </PanelMain>
  );
}
