import type { Metadata } from "next";
import { PanelMain } from "@/components/panel";
import { VistaEntregas } from "@/features/configuracion/components/entregas/vista-entregas";
import { leerEscenario, obtenerConfig } from "@/features/configuracion/lib/mock";
import { herramientasDev } from "@/lib/entorno";

export const metadata: Metadata = { title: "Entregas · Tiendly" };

type PageProps = { searchParams: Promise<{ escenario?: string }> };

/** Entregas (Figma, módulo 2; decisión 0009). ?escenario=sin-entregas muestra la primera vez (nada activo). */
export default async function EntregasPage({ searchParams }: PageProps) {
  const { escenario } = await searchParams;
  const { entregas } = await obtenerConfig(leerEscenario(herramientasDev ? escenario : undefined));
  return (
    <PanelMain>
      <VistaEntregas inicial={entregas} />
    </PanelMain>
  );
}
