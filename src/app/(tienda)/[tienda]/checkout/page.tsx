import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { VistaCompra } from "@/features/checkout/components/compra/vista-compra";
import { obtenerCompra } from "@/features/checkout/lib/catalogo";

type PageProps = { params: Promise<{ tienda: string }> };

export const metadata: Metadata = { title: "Finalizar compra", robots: { index: false } };

/** Finalizar compra (Figma, módulo 1): datos, entrega y pago en una sola vista. */
export default async function CheckoutPage({ params }: PageProps) {
  const { tienda } = await params;
  const datos = await obtenerCompra(tienda);
  if (!datos) notFound();
  return <VistaCompra datos={datos} />;
}
