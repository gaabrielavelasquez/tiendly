import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CabeceraTienda } from "@/features/vitrina/components/cabecera-tienda";
import { PieTienda } from "@/features/vitrina/components/pie-tienda";
import { FichaProducto } from "@/features/vitrina/components/producto/ficha-producto";
import { TarjetaProducto } from "@/features/vitrina/components/tarjeta-producto";
import { obtenerFicha, obtenerVitrina } from "@/features/vitrina/lib/vitrina";

type PageProps = { params: Promise<{ tienda: string; producto: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tienda, producto } = await params;
  const datos = await obtenerFicha(tienda, producto);
  return datos ? { title: `${datos.ficha.nombre} · ${datos.tienda.nombre}`, description: datos.ficha.corto } : {};
}

/** Página de producto de la vitrina (Figma): ficha, "Sobre el producto" y "También te puede gustar". */
export default async function ProductoPage({ params }: PageProps) {
  const { tienda, producto } = await params;
  const [datos, vitrina] = await Promise.all([obtenerFicha(tienda, producto), obtenerVitrina(tienda)]);
  if (!datos || !vitrina) notFound();
  const { ficha, relacionados } = datos;
  return (
    <div className="flex min-h-dvh flex-col">
      <CabeceraTienda nombre={vitrina.tienda.nombre} logo={vitrina.tienda.logo} slug={tienda} categorias={vitrina.categorias} />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 py-6 lg:gap-24 lg:py-12">
        <FichaProducto p={ficha} tienda={tienda} celular={datos.tienda.celular} demo={datos.tienda.demo} />
        {ficha.sobre && (
          <section aria-labelledby="sobre" className="flex max-w-2xl flex-col gap-3">
            <h2 id="sobre" className="font-display-hero text-h2 text-fg">Sobre el producto</h2>
            <p className="text-body text-fg-secondary">{ficha.sobre}</p>
          </section>
        )}
        {relacionados.length > 0 && (
          <section aria-labelledby="relacionados" className="flex flex-col gap-6">
            <h2 id="relacionados" className="font-display-hero text-h2 text-fg">También te puede gustar</h2>
            <ul className="grid grid-cols-2 gap-x-3 gap-y-8 lg:grid-cols-4 lg:gap-x-6">
              {relacionados.map((p) => (
                <li key={p.id}>
                  <TarjetaProducto p={p} tienda={tienda} />
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
      <PieTienda instagram={vitrina.tienda.instagram} horario={vitrina.tienda.horario} nombre={vitrina.tienda.nombre} logo={vitrina.tienda.logo} slug={tienda} celular={vitrina.tienda.celular} categorias={vitrina.categorias} />
    </div>
  );
}
