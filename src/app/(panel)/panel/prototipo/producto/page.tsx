import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PanelMain } from "@/components/panel";
import { FormularioProto } from "@/features/prototipo-ofertas/components/form/formulario-proto";
import { herramientasDev } from "@/lib/entorno";
import { hoyLima } from "@/lib/reloj";

// Dinámica: el prototipo solo existe fuera de producción y las ofertas se calculan con la hora de Lima al mostrar.
export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Prototipo · Producto · Tiendly" };

/** PROTOTIPO (PR 3 + 0034): solo en local y previews. ?ejemplo=zapatilla | serum | vela. */
export default async function Page({ searchParams }: { searchParams: Promise<{ ejemplo?: string }> }) {
  if (!herramientasDev) notFound();
  const { ejemplo } = await searchParams;
  const inicial = ejemplo === "serum" || ejemplo === "vela" ? ejemplo : "zapatilla";
  return (
    <PanelMain className="lg:pt-0">
      <FormularioProto hoy={hoyLima()} inicial={inicial} />
    </PanelMain>
  );
}
