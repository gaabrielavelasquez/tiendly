import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { VistaConfirmacion } from "@/features/checkout/components/confirmacion/vista-confirmacion";
import { CabeceraTienda } from "@/features/vitrina/components/cabecera-tienda";
import { obtenerVitrina } from "@/features/vitrina/lib/vitrina";

type PageProps = { params: Promise<{ tienda: string; numero: string }> };

export const metadata: Metadata = { title: "Tu pedido", robots: { index: false } };

/** Confirmación del pedido (Figma 3a / 3b y D5a / D5b). */
export default async function PedidoPage({ params }: PageProps) {
  const { tienda, numero } = await params;
  const vitrina = await obtenerVitrina(tienda);
  if (!vitrina) notFound();
  const { nombre, slug, logo } = vitrina.tienda;
  const celular = vitrina.tienda.celular; // el número de Pedidos por WhatsApp (módulo 2)
  return (
    <div className="flex min-h-dvh flex-col">
      <CabeceraTienda nombre={nombre} logo={logo} slug={slug} categorias={vitrina.categorias} />
      <main className="mx-auto flex w-full max-w-6xl flex-1 justify-center px-4 py-10 lg:py-12">
        <VistaConfirmacion tienda={{ nombre, slug, celular }} numero={decodeURIComponent(numero)} />
      </main>
    </div>
  );
}
