import type { Metadata } from "next";
import { OnboardingFlow } from "@/features/onboarding/components/onboarding-flow";
import { AURORA } from "@/lib/datos/aurora";
import { sinProtocolo, urlTienda } from "@/lib/link-tienda";

export const metadata: Metadata = { title: "Crea tu tienda · Tiendly" };

export default async function Registro() {
  // El link de la vista previa sale del mismo lugar que el de cualquier tienda (TIENDLY_URL_TIENDAS), no escrito a mano.
  const linkDemo = sinProtocolo(await urlTienda(AURORA.slug));
  return <OnboardingFlow linkDemo={linkDemo} />;
}
