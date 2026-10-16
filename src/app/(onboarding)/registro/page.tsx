import type { Metadata } from "next";
import { OnboardingFlow } from "@/features/onboarding/components/onboarding-flow";

export const metadata: Metadata = { title: "Crea tu tienda · Tiendly" };

export default function Registro() {
  return <OnboardingFlow />;
}
