import { CabeceraTienda } from "@/features/vitrina/components/cabecera-tienda";
import { PieTienda } from "@/features/vitrina/components/pie-tienda";
import { Portada } from "@/features/vitrina/components/portada";
import { TIENDAS_EJEMPLO } from "@/lib/datos/tiendas-ejemplo";
import { catalogoGlow, type ProductoProto } from "../../lib/datos";
import { estadoOferta } from "../../lib/oferta";
import { slugDe, TarjetaOferta } from "./tarjeta-oferta";

export const GLOW = TIENDAS_EJEMPLO.find((t) => t.slug === "glow-labo")!;
export const SLUG = "prototipo/tienda";
/** Nombre de la sección de ofertas (Mi tienda, Plan Free). En el prototipo viaja en una cookie. */
export const COOKIE_OFERTAS = "proto-ofertas";
export const NOMBRE_OFERTAS = "Ofertas";

/**
 * Menú de la tienda: la sección de ofertas va primero, con su nombre, junto a las categorías. Solo si hay ofertas hoy.
 */
export function menuDe(productos: ProductoProto[], hoy: string, nombreOfertas: string) {
  const cats = [...new Set(productos.map((p) => p.categoria))].map((label) => ({ id: slugDe(label), label }));
  return productos.some((p) => estadoOferta(p, hoy) === "activa") ? [{ id: "ofertas", label: nombreOfertas }, ...cats] : cats;
}

function Grilla({ productos, hoy }: { productos: ProductoProto[]; hoy: string }) {
  return (
    <ul className="grid grid-cols-2 gap-x-3 gap-y-10 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-14">
      {productos.map((p, i) => <li key={p.id}><TarjetaOferta p={p} hoy={hoy} prioridad={i < 4} /></li>)}
    </ul>
  );
}

type Props = { hoy: string; nombreOfertas: string; categoria?: string };

/**
 * PROTOTIPO · Vitrina de Glow Labo (tema Suave), ronda 2: la sección de ofertas lleva el nombre que eligió la tienda
 * ("Ofertas", "Cyber Wow"…), aparece arriba del catálogo y en el menú, y SIN fechas: las fechas solo viven en el panel.
 * Desde el menú (?categoria=ofertas) se ve solo esa sección, como una categoría más.
 */
export function TiendaProto({ hoy, nombreOfertas, categoria }: Props) {
  const productos = catalogoGlow(hoy).filter((p) => p.estado === "activo");
  const ofertas = productos.filter((p) => estadoOferta(p, hoy) === "activa");
  const menu = menuDe(productos, hoy, nombreOfertas);
  const filtrados = categoria && categoria !== "ofertas" ? productos.filter((p) => slugDe(p.categoria) === categoria) : productos;
  const titulo = menu.find((c) => c.id === categoria)?.label;

  return (
    <div className="flex min-h-dvh flex-col">
      <CabeceraTienda nombre={GLOW.nombre} slug={SLUG} categorias={menu} />
      {!categoria && <Portada nombre={GLOW.nombre} demo={false} propia={GLOW.portada} />}
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-14 px-4 pt-12 pb-16 lg:gap-20 lg:pt-16">
        {categoria ? (
          <section aria-labelledby="cat" className="flex flex-col gap-5">
            <h1 id="cat" className="font-display-hero text-h1 text-fg">{titulo ?? "Productos"}</h1>
            <Grilla productos={categoria === "ofertas" ? ofertas : filtrados} hoy={hoy} />
          </section>
        ) : (
          <>
            {ofertas.length > 0 && (
              <section aria-labelledby="ofertas" className="flex flex-col gap-5">
                <h2 id="ofertas" className="font-display-hero text-h2 text-fg">{nombreOfertas}</h2>
                <ul className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:px-0">
                  {ofertas.map((p, i) => <li key={p.id} className="w-[44%] shrink-0 snap-start lg:w-auto"><TarjetaOferta p={p} hoy={hoy} prioridad={i < 2} /></li>)}
                </ul>
              </section>
            )}
            <section aria-labelledby="todos" className="flex flex-col gap-5">
              <h2 id="todos" className="font-display-hero text-h2 text-fg">Todos los productos</h2>
              <Grilla productos={productos} hoy={hoy} />
            </section>
          </>
        )}
      </main>
      <PieTienda nombre={GLOW.nombre} slug={SLUG} celular="900000000" categorias={menu} />
    </div>
  );
}
