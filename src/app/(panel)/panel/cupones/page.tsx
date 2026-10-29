import type { Metadata } from "next";
import { PanelMain } from "@/components/panel";
import { VistaCupones } from "@/features/cupones/components/vista-cupones";
import { leerEscenario, obtenerCupones } from "@/features/cupones/lib/mock";
import { hoyLima } from "@/lib/reloj";
import { herramientasDev } from "@/lib/entorno";
import { tiendaActual } from "@/lib/sesion";

export const metadata: Metadata = { title: "Cupones · Tiendly" };

type PageProps = { searchParams: Promise<{ escenario?: string; guardado?: string }> };

/** Cupones (Figma, módulo 3; decisión 0008). ?escenario=vacio | limite | error muestra los otros estados; "limite" se ve como tienda Free. */
export default async function CuponesPage({ searchParams }: PageProps) {
  const { escenario, guardado } = await searchParams;
  if (herramientasDev && escenario === "carga") await new Promise(r => setTimeout(r, 4000));
  const e = leerEscenario(herramientasDev ? escenario : undefined);
  const tienda = await tiendaActual();
  const cupones = await obtenerCupones(tienda.slug, e);
  const plan = e === "limite" ? "free" : tienda.plan;
  return (
    <PanelMain className="gap-10 pb-32 lg:gap-12 [&_h1]:font-display-light">
      <VistaCupones key={guardado ?? "lista"} inicial={cupones} hoy={hoyLima()} creado={guardado} plan={plan} />
    </PanelMain>
  );
}
