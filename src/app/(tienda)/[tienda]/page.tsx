import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Vitrina } from "@/features/vitrina/components/vitrina";
import { leerCategoria, obtenerVitrina } from "@/features/vitrina/lib/vitrina";

type PageProps = { params: Promise<{ tienda: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tienda } = await params;
  const datos = await obtenerVitrina(tienda);
  return datos ? { title: datos.tienda.nombre, description: `Compra en ${datos.tienda.nombre} y coordina tu pedido por WhatsApp.` } : {};
}

/** Vitrina pública (decisiones 0002 y 0006): el catálogo que abre el cliente desde Instagram o WhatsApp. */
export default async function TiendaHome({ params, searchParams }: PageProps) {
  const [{ tienda }, { categoria }] = await Promise.all([params, searchParams]);
  const datos = await obtenerVitrina(tienda);
  if (!datos) notFound();
  return <Vitrina datos={datos} categoriaInicial={leerCategoria(categoria, datos.categorias.map((c) => c.id))} />;
}
