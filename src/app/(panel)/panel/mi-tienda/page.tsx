import { MiTiendaVista } from "@/features/mi-tienda/components/mi-tienda-vista";
import { configActual } from "@/features/configuracion/lib/mock";
import { tiendaActual } from "@/lib/sesion";

export default async function MiTiendaPage({ searchParams }: { searchParams: Promise<{ escenario?: string }> }) {
  const { escenario } = await searchParams;
  const demo = process.env.NODE_ENV !== "production" || process.env.VERCEL_ENV === "preview";
  // El WhatsApp de ventas vive en la configuración de la tienda (un solo dato: Pagos y el checkout lo leen de ahí).
  return <MiTiendaVista escenario={demo ? escenario : undefined} whatsappVentas={configActual().pagos.whatsapp.celular} plan={tiendaActual.plan} />;
}
