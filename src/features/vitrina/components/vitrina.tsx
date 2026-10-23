"use client";

import { PackageOpen } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { Button, EmptyState } from "@/components/ui";
import type { Categoria } from "@/features/productos/types";
import type { Vitrina as DatosVitrina } from "../lib/vitrina";
import { CabeceraTienda } from "./cabecera-tienda";
import { CategoriasTienda } from "./categorias-tienda";
import { PieTienda } from "./pie-tienda";
import { Portada } from "./portada";
import { PortadaPro } from "./portada-pro";
import { TarjetaProducto } from "./tarjeta-producto";

type VitrinaProps = { datos: DatosVitrina; categoriaInicial: Categoria | "todos" };

/**
 * Catálogo público (Figma, Home), mobile-first: portada (Free: foto y titular debajo; Pro: con overlay),
 * categorías en pills fijas y grilla de 2 columnas (4 en desktop). La categoría va en ?categoria=.
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

  const visibles = useMemo(
    () => (categoria === "todos" ? datos.productos : datos.productos.filter((p) => p.categorias.includes(categoria))),
    [datos.productos, categoria],
  );

  return (
    <div className="flex min-h-dvh flex-col">
      <CabeceraTienda nombre={datos.tienda.nombre} logo={datos.tienda.logo} slug={datos.tienda.slug} categorias={datos.categorias} activa={categoria} onCategoria={setCategoria} />
      {datos.productos.length > 0 &&
        (datos.tienda.plan === "pro" ? (
          <div className="mx-auto w-full max-w-6xl px-4 lg:pt-6">
            <PortadaPro />
          </div>
        ) : (
          <Portada nombre={datos.tienda.nombre} demo={datos.tienda.demo} />
        ))}
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pb-16">
        {datos.productos.length === 0 ? (
          <EmptyState icon={PackageOpen} title="Muy pronto" description={`${datos.tienda.nombre} está preparando su catálogo. Vuelve en unos días.`} />
        ) : (
          <>
            <h2 className="sr-only">Productos</h2>
            {/* Con una sola categoría (o ninguna) no hay nada que filtrar: sin barra, solo el ancla #catalogo (0031). */}
            {datos.categorias.length > 1 ? (
              <div id="catalogo" className="sticky top-16 z-10 -mx-4 mt-12 scroll-mt-16 bg-page/90 px-4 py-3 backdrop-blur-md lg:mx-0 lg:mt-16 lg:px-0">
                <CategoriasTienda categorias={datos.categorias} valor={categoria} onCambio={setCategoria} />
              </div>
            ) : (
              <div id="catalogo" className="mt-12 scroll-mt-16 lg:mt-16" />
            )}
            {visibles.length === 0 ? (
              <EmptyState
                icon={PackageOpen}
                title="Nada por aquí todavía"
                description="Esta categoría no tiene productos por ahora."
                action={<Button variant="secondary" onClick={() => setCategoria("todos")}>Ver todos</Button>}
              />
            ) : (
              <ul className="grid grid-cols-2 gap-x-3 gap-y-10 pt-6 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-14 lg:pt-8">
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
      <PieTienda nombre={datos.tienda.nombre} logo={datos.tienda.logo} slug={datos.tienda.slug} celular={datos.tienda.celular} categorias={datos.categorias} />
    </div>
  );
}
