"use client";

import { PackageOpen } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { Button, EmptyState } from "@/components/ui";
import type { Categoria } from "@/features/productos/types";
import { OFERTAS, type Vitrina as DatosVitrina } from "../lib/vitrina";
import { CabeceraTienda } from "./cabecera-tienda";
import { CategoriasTienda } from "./categorias-tienda";
import { PieTienda } from "./pie-tienda";
import { Portada } from "./portada";
import { PortadaPro } from "./portada-pro";
import { TarjetaProducto } from "./tarjeta-producto";

type VitrinaProps = { datos: DatosVitrina; categoriaInicial: Categoria | "todos" };

/**
 * Catálogo público (Figma, Home), mobile-first: portada, la sección de ofertas con el nombre que eligió la tienda
 * (0034, solo si hay ofertas hoy) y "Todos los productos". Filtros en la misma página (decisión 0006): en móvil, chips
 * desplazables arriba de la grilla (la sección de ofertas primero); en desktop, el menú de la cabecera. ?categoria=.
 */
export function Vitrina({ datos, categoriaInicial }: VitrinaProps) {
  const [categoria, setCategoriaState] = useState(categoriaInicial);
  const setCategoria = useCallback((c: Categoria | "todos") => {
    setCategoriaState(c);
    const url = new URL(window.location.href);
    if (c === "todos") url.searchParams.delete("categoria");
    else url.searchParams.set("categoria", c);
    window.history.replaceState(null, "", url);
  }, []);

  const ofertas = useMemo(() => datos.productos.filter((p) => p.descuento > 0 && !p.agotado), [datos.productos]);
  const visibles = useMemo(
    () => (categoria === "todos" ? datos.productos : categoria === OFERTAS ? ofertas : datos.productos.filter((p) => p.categorias.includes(categoria))),
    [datos.productos, categoria, ofertas],
  );
  const titulo = categoria === "todos" ? "Todos los productos" : (datos.categorias.find((c) => c.id === categoria)?.label ?? "Productos");
  // Con una sola categoría y sin ofertas no hay nada que filtrar: sin chips (0031).
  const hayFiltros = datos.categorias.length > 1 || datos.categorias[0]?.id === OFERTAS;

  return (
    <div className="flex min-h-dvh flex-col">
      <CabeceraTienda nombre={datos.tienda.nombre} logo={datos.tienda.logo} slug={datos.tienda.slug} categorias={datos.categorias} activa={categoria} onCategoria={setCategoria} />
      {datos.productos.length > 0 &&
        (datos.tienda.plan === "pro" && (datos.tienda.demo || datos.tienda.portada?.src) ? (
          <div className="mx-auto w-full max-w-6xl px-4 lg:pt-6">
            <PortadaPro propia={datos.tienda.demo ? undefined : datos.tienda.portada} />
          </div>
        ) : (
          <Portada nombre={datos.tienda.nombre} demo={datos.tienda.demo} propia={datos.tienda.portada} />
        ))}
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pb-16">
        {datos.productos.length === 0 ? (
          <EmptyState icon={PackageOpen} title="Muy pronto" description={`${datos.tienda.nombre} está preparando su catálogo. Vuelve en unos días.`} />
        ) : (
          <>
            {categoria === "todos" && ofertas.length > 0 && (
              <section aria-labelledby="titulo-ofertas" className="mt-12 flex flex-col gap-5 lg:mt-16">
                <h2 id="titulo-ofertas" className="font-display-hero text-h2 text-fg">{datos.tienda.nombreOfertas}</h2>
                <ul className="sin-scrollbar -mx-4 flex snap-x scroll-px-4 gap-3 overflow-x-auto px-4 pb-1 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:px-0">
                  {ofertas.map((p, i) => (
                    <li key={p.id} className="w-[44%] shrink-0 snap-start lg:w-auto">
                      <TarjetaProducto p={p} tienda={datos.tienda.slug} prioridad={i < 2} />
                    </li>
                  ))}
                </ul>
              </section>
            )}
            <h2 id="catalogo" className={hayFiltros || ofertas.length ? "mt-14 scroll-mt-20 font-display-hero text-h2 text-fg lg:mt-20" : "sr-only"}>{titulo}</h2>
            {hayFiltros ? (
              <div className="sticky top-16 z-10 -mx-4 mt-3 bg-page/90 px-4 py-3 backdrop-blur-md lg:hidden">
                <CategoriasTienda categorias={datos.categorias} valor={categoria} onCambio={setCategoria} />
              </div>
            ) : (
              !ofertas.length && <div className="mt-12 lg:mt-16" />
            )}
            {visibles.length === 0 ? (
              <EmptyState
                icon={PackageOpen}
                title="Nada por aquí todavía"
                description="Esta categoría no tiene productos por ahora."
                action={<Button variant="secondary" onClick={() => setCategoria("todos")}>Ver todos</Button>}
              />
            ) : (
              <ul className="grid grid-cols-2 gap-x-3 gap-y-10 pt-4 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-14 lg:pt-6">
                {visibles.map((p, i) => (
                  <li key={p.id}>
                    <TarjetaProducto p={p} tienda={datos.tienda.slug} prioridad={i < 4} />
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </main>
      <PieTienda instagram={datos.tienda.instagram} horario={datos.tienda.horario} nombre={datos.tienda.nombre} logo={datos.tienda.logo} slug={datos.tienda.slug} celular={datos.tienda.celular} categorias={datos.categorias} />
    </div>
  );
}
