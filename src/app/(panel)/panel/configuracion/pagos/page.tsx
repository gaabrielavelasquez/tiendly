import type { Metadata } from "next";
import { PanelMain } from "@/components/panel";
import { VistaPagos } from "@/features/configuracion/components/pagos/vista-pagos";
import { leerEscenario, obtenerConfig } from "@/features/configuracion/lib/mock";
import { herramientasDev } from "@/lib/entorno";
import { slugPanel } from "@/lib/sesion";

export const metadata: Metadata = { title: "Métodos de pago · Tiendly" };

type PageProps = { searchParams: Promise<{ escenario?: string }> };

/** Métodos de pago (Figma, módulo 2; decisión 0007). ?escenario=sin-pasarela muestra los cobros sin activar. */
export default async function PagosPage({ searchParams }: PageProps) {
  const { escenario } = await searchParams;
  const { pagos } = await obtenerConfig(await slugPanel(), leerEscenario(herramientasDev ? escenario : undefined));
  return (
    <PanelMain>
      <VistaPagos inicial={pagos} />
    </PanelMain>
  );
}
