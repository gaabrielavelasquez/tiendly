import type { Metadata } from "next";
import { OnboardingFlow } from "@/features/onboarding/components/onboarding-flow";
import { TIENDAS_EJEMPLO } from "@/lib/datos/tiendas-ejemplo";
import { sinProtocolo, urlTienda } from "@/lib/link-tienda";

export const metadata: Metadata = { title: "Crea tu tienda · Tiendly" };

export default async function Registro() {
  // Los links de la vista previa salen del mismo lugar que el de cualquier tienda (TIENDLY_URL_TIENDAS), no escritos a mano.
  const linksEjemplo = await Promise.all(TIENDAS_EJEMPLO.map(async (t) => sinProtocolo(await urlTienda(t.slug))));
  return <OnboardingFlow linksEjemplo={linksEjemplo} />;
}
