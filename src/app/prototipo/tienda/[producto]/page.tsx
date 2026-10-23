import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FichaProto } from "@/features/prototipo-ofertas/components/vitrina/ficha-proto";
import { slugDe } from "@/features/prototipo-ofertas/components/vitrina/tarjeta-oferta";
import { COOKIE_OFERTAS, GLOW, menuDe, NOMBRE_OFERTAS, SLUG } from "@/features/prototipo-ofertas/components/vitrina/tienda-proto";
import { catalogoGlow } from "@/features/prototipo-ofertas/lib/datos";
import { CabeceraTienda } from "@/features/vitrina/components/cabecera-tienda";
import { cookies } from "next/headers";
import { herramientasDev } from "@/lib/entorno";
import { hoyLima } from "@/lib/reloj";

// Dinámica: el prototipo solo existe fuera de producción y las ofertas se calculan con la hora de Lima al mostrar.
export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Prototipo · Producto en oferta" };

/** PROTOTIPO (0034): página de producto en oferta, tema Suave. Solo en local y previews. */
export default async function Page({ params }: { params: Promise<{ producto: string }> }) {
  if (!herramientasDev) notFound();
  const { producto } = await params;
  const hoy = hoyLima();
  const catalogo = catalogoGlow(hoy).filter((p) => p.estado === "activo");
  const p = catalogo.find((x) => slugDe(x.nombre) === producto);
  if (!p) notFound();
  return (
    <div data-theme="suave" className="min-h-dvh bg-page">
      <CabeceraTienda nombre={GLOW.nombre} slug={SLUG} categorias={menuDe(catalogo, hoy, decodeURIComponent((await cookies()).get(COOKIE_OFERTAS)?.value ?? "") || NOMBRE_OFERTAS)} />
      <main className="mx-auto w-full max-w-6xl px-4 py-8 lg:py-12">
        <FichaProto p={p} hoy={hoy} />
      </main>
    </div>
  );
}
