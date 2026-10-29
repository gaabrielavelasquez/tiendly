import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { VistaCarrito } from "@/features/checkout/components/carrito/vista-carrito";
import { obtenerCompra } from "@/features/checkout/lib/catalogo";

type PageProps = { params: Promise<{ tienda: string }> };

export const metadata: Metadata = { title: "Tu carrito", robots: { index: false } };

/** Carrito de la vitrina (Figma, módulo 1). El catálogo viene del servidor; el carrito, del navegador. */
export default async function CarritoPage({ params }: PageProps) {
  const { tienda } = await params;
  const datos = await obtenerCompra(tienda);
  if (!datos) notFound();
  return <VistaCarrito datos={datos} />;
}
