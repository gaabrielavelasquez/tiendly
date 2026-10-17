import { MiTiendaVista } from "@/features/mi-tienda/components/mi-tienda-vista";
export default async function MiTiendaPage({ searchParams }: { searchParams: Promise<{ escenario?: string }> }) {
  const { escenario } = await searchParams;
  const demo = process.env.NODE_ENV !== "production" || process.env.VERCEL_ENV === "preview";
  return <MiTiendaVista escenario={demo ? escenario : undefined} />;
}
