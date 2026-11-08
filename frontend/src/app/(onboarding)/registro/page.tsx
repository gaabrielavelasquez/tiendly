import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { testLoginAllowed } from "@tiendly/backend/rules";
import { ownedStore } from "@tiendly/backend/server";
import { businessRuntime } from "@/lib/business-runtime";
import { storeStorage } from "@/lib/store-storage";
import type { Metadata } from "next";
import { OnboardingFlow } from "@/features/onboarding/components/onboarding-flow";
import { TIENDAS_EJEMPLO } from "@/lib/datos/tiendas-ejemplo";
import { sinProtocolo, urlTienda } from "@/lib/link-tienda";

export const metadata: Metadata = { title: "Crea tu tienda · Tiendly" };

export default async function Registro() {
  let googleName: string | undefined;
  if (await storeStorage()) {
    try {
      const { auth, runtime } = await businessRuntime();
      const session = await auth.api.getSession({ headers: await headers() });
      if (session) {
        if (await ownedStore(runtime.stores, { userId: session.user.id })) redirect("/panel");
        googleName = session.user.name;
      }
    } catch (error) {
      // Preserve Next redirects. Missing OAuth configuration leaves the retryable Google button available.
      if (error && typeof error === "object" && "digest" in error) throw error;
    }
  }
  // Los links de la vista previa salen del mismo lugar que el de cualquier tienda (TIENDLY_URL_TIENDAS), no escritos a mano.
  const linksEjemplo = await Promise.all(TIENDAS_EJEMPLO.map(async (t) => sinProtocolo(await urlTienda(t.slug))));
  return <OnboardingFlow linksEjemplo={linksEjemplo} baseTienda={await urlTienda("")} googleName={googleName} testLogin={testLoginAllowed(process.env.TIENDLY_ENTORNO, process.env.TIENDLY_TEST_LOGIN)} />;
}
