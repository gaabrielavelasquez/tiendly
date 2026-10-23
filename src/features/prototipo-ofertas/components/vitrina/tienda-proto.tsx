import { CabeceraTienda } from "@/features/vitrina/components/cabecera-tienda";
import { PieTienda } from "@/features/vitrina/components/pie-tienda";
import { Portada } from "@/features/vitrina/components/portada";
import { TIENDAS_EJEMPLO } from "@/lib/datos/tiendas-ejemplo";
import { catalogoGlow } from "../../lib/datos";
import { estadoOferta, vigencia } from "../../lib/oferta";
import { slugDe, TarjetaOferta } from "./tarjeta-oferta";

export const GLOW = TIENDAS_EJEMPLO.find((t) => t.slug === "glow-labo")!;
export const SLUG = "prototipo/tienda";

/** Categorías de la cabecera y el pie, desde el catálogo. */
export const categoriasDe = (nombres: string[]) => [...new Set(nombres)].map((label) => ({ id: slugDe(label), label }));

/**
 * PROTOTIPO · Vitrina de Glow Labo (tema Suave) con la sección "Ofertas" (0034): aparece sola, arriba del catálogo,
 * solo si hay productos en oferta hoy. Móvil: fila que se desliza; desktop: grilla de 4. Debajo, el catálogo de siempre.
 */
export function TiendaProto({ hoy }: { hoy: string }) {
  const productos = catalogoGlow(hoy).filter((p) => p.estado === "activo");
  const ofertas = productos.filter((p) => estadoOferta(p, hoy) === "activa");
  const categorias = categoriasDe(productos.map((p) => p.categoria));
  // Si todas las ofertas terminan el mismo día, se dice una vez en el título de la sección.
  const fines = [...new Set(ofertas.map((p) => vigencia(p, hoy)?.texto))];
  const hasta = fines.length === 1 && fines[0] ? `${fines[0]}.` : null;

  return (
    <div className="flex min-h-dvh flex-col">
      <CabeceraTienda nombre={GLOW.nombre} slug={SLUG} categorias={categorias} />
      <Portada nombre={GLOW.nombre} demo={false} propia={GLOW.portada} />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-14 px-4 pt-12 pb-16 lg:gap-20 lg:pt-16">
        {ofertas.length > 0 && (
          <section aria-labelledby="ofertas" className="flex flex-col gap-5">
            <div className="flex items-baseline justify-between gap-3">
              <h2 id="ofertas" className="font-display-hero text-h2 text-fg">Ofertas</h2>
              {hasta && <p className="text-body-sm text-fg-secondary">{hasta}</p>}
            </div>
            <ul className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:px-0">
              {ofertas.map((p, i) => (
                <li key={p.id} className="w-[44%] shrink-0 snap-start lg:w-auto">
                  <TarjetaOferta p={p} hoy={hoy} prioridad={i < 2} />
                </li>
              ))}
            </ul>
          </section>
        )}
        <section aria-labelledby="todos" className="flex flex-col gap-5">
          <h2 id="todos" className="font-display-hero text-h2 text-fg">Todos los productos</h2>
          <ul className="grid grid-cols-2 gap-x-3 gap-y-10 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-14">
            {productos.map((p) => (
              <li key={p.id}><TarjetaOferta p={p} hoy={hoy} /></li>
            ))}
          </ul>
        </section>
      </main>
      <PieTienda nombre={GLOW.nombre} slug={SLUG} celular="900000000" categorias={categorias} />
    </div>
  );
}
