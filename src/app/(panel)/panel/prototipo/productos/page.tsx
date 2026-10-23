import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PanelMain } from "@/components/panel";
import { ProductosProto } from "@/features/prototipo-ofertas/components/lista/productos-proto";
import { herramientasDev } from "@/lib/entorno";
import { hoyLima } from "@/lib/reloj";

// Dinámica: el prototipo solo existe fuera de producción y las ofertas se calculan con la hora de Lima al mostrar.
export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Prototipo · Productos · Tiendly" };

/** PROTOTIPO (PR 3 + 0034): solo en local y previews. */
export default function Page() {
  if (!herramientasDev) notFound();
  return (
    <PanelMain className="gap-10 lg:gap-12">
      <ProductosProto hoy={hoyLima()} />
    </PanelMain>
  );
}
