import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { PanelMain } from "@/components/panel";
import { NombreOfertasProto } from "@/features/prototipo-ofertas/components/mi-tienda/nombre-ofertas-proto";
import { COOKIE_OFERTAS, NOMBRE_OFERTAS } from "@/features/prototipo-ofertas/components/vitrina/tienda-proto";
import { herramientasDev } from "@/lib/entorno";

// Dinámica: el prototipo solo existe fuera de producción.
export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Prototipo · Mi tienda · Tiendly" };

/** PROTOTIPO (0034, ronda 2): nombre de la sección de ofertas. Solo en local y previews. */
export default async function Page() {
  if (!herramientasDev) notFound();
  const inicial = decodeURIComponent((await cookies()).get(COOKIE_OFERTAS)?.value ?? "") || NOMBRE_OFERTAS;
  return (
    <PanelMain className="gap-10 lg:gap-12">
      <NombreOfertasProto inicial={inicial} />
    </PanelMain>
  );
}
