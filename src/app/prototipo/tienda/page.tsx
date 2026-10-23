import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { COOKIE_OFERTAS, NOMBRE_OFERTAS, TiendaProto } from "@/features/prototipo-ofertas/components/vitrina/tienda-proto";
import { herramientasDev } from "@/lib/entorno";
import { hoyLima } from "@/lib/reloj";

// Dinámica: el prototipo solo existe fuera de producción y las ofertas se calculan con la hora de Lima al mostrar.
export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Prototipo · Glow Labo · Ofertas" };

/** PROTOTIPO (0034): la vitrina de Glow Labo con su sección de ofertas, en su tema (Suave). Solo en local y previews. */
export default async function Page({ searchParams }: { searchParams: Promise<{ categoria?: string }> }) {
  if (!herramientasDev) notFound();
  const { categoria } = await searchParams;
  const nombre = decodeURIComponent((await cookies()).get(COOKIE_OFERTAS)?.value ?? "") || NOMBRE_OFERTAS;
  return (
    <div data-theme="suave" className="min-h-dvh bg-page">
      <TiendaProto hoy={hoyLima()} nombreOfertas={nombre} categoria={categoria} />
    </div>
  );
}
