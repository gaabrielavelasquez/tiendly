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
  const tienda = await tiendaActual();
  const config = await obtenerConfig(tienda.slug, leerEscenario(herramientasDev ? escenario : undefined));
  return (
    <PanelMain className="gap-10 lg:gap-12 [&_h1]:font-display-light">
      <PanelHeader titulo="Configuración" subtitulo="Cómo te pagan, cómo entregas y los datos de tu cuenta." />
      <Hub config={config} tienda={tienda.nombre} link={await urlTienda(tienda.slug)} />
    </PanelMain>
  );
}
