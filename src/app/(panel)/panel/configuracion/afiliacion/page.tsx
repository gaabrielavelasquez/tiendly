import { AfiliacionVista } from "@/features/afiliacion/components/afiliacion-vista";
import { rubrosTienda } from "@/features/onboarding/lib/perfil";
export default async function AfiliacionPage({ searchParams }: { searchParams: Promise<{ escenario?: string }> }) {
  const { escenario } = await searchParams;
  const demo = process.env.NODE_ENV !== "production" || process.env.VERCEL_ENV === "preview";
  const numero = process.env.TIENDLY_SUPPORT_WHATSAPP;
  const soporte = numero && /^\d{8,15}$/.test(numero) ? numero : undefined;
  return <AfiliacionVista escenario={demo ? escenario : undefined} soporte={soporte} rubros={rubrosTienda()} />;
}
