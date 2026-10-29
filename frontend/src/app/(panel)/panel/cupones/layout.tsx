import { SesionCupones } from "@/features/cupones/components/sesion-cupones";
import { tiendaActual } from "@/lib/sesion";

export default async function CuponesLayout({ children }: { children: React.ReactNode }) {
  const tienda = await tiendaActual();
  return <SesionCupones key={tienda.slug}>{children}</SesionCupones>;
}
