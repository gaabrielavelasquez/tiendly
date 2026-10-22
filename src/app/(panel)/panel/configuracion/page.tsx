import type { Metadata } from "next";
import { PanelHeader, PanelMain } from "@/components/panel";
import { Hub } from "@/features/configuracion/components/hub";
import { leerEscenario, obtenerConfig } from "@/features/configuracion/lib/mock";
import { herramientasDev } from "@/lib/entorno";
import { urlTienda } from "@/lib/link-tienda";
import { tiendaActual } from "@/lib/sesion";

export const metadata: Metadata = { title: "Configuración · Tiendly" };

type PageProps = { searchParams: Promise<{ escenario?: string }> };

/** Configuración: Métodos de pago, Entregas y Cuenta (decisión 0027). */
export default async function ConfiguracionPage({ searchParams }: PageProps) {
  const { escenario } = await searchParams;
  const config = await obtenerConfig(leerEscenario(herramientasDev ? escenario : undefined));
  return (
    <PanelMain>
      <PanelHeader titulo="Configuración" subtitulo="Cómo te pagan, cómo entregas y los datos de tu cuenta." />
      <Hub config={config} link={await urlTienda(tiendaActual.slug)} />
    </PanelMain>
  );
}
