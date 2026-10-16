"use client";

import { PackageOpen } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { Button, EmptyState } from "@/components/ui";
import type { Categoria } from "@/features/productos/types";
import type { Vitrina as DatosVitrina } from "../lib/vitrina";
import { CabeceraTienda } from "./cabecera-tienda";
import { CategoriasTienda } from "./categorias-tienda";
import { PieTienda } from "./pie-tienda";
import { TarjetaProducto } from "./tarjeta-producto";

type VitrinaProps = { datos: DatosVitrina; categoriaInicial: Categoria | "todos" };

/**
 * Catálogo público (Figma, tema Editorial), mobile-first: categorías en pestañas (móvil) o en la cabecera
 * (desktop) y grilla de 2 columnas (3 en tablet, 4 en desktop). La categoría va en ?categoria=.
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
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pb-10">
        {datos.productos.length === 0 ? (
          <EmptyState icon={PackageOpen} title="Muy pronto" description={`${datos.tienda.nombre} está preparando su catálogo. Vuelve en unos días.`} />
        ) : (
          <>
            {datos.categorias.length > 1 && <CategoriasTienda categorias={datos.categorias} valor={categoria} onCambio={setCategoria} />}
            <h1 className="sr-only">Productos de {datos.tienda.nombre}</h1>
            {visibles.length === 0 ? (
              <EmptyState
                icon={PackageOpen}
                title="Nada por aquí todavía"
                description="Esta categoría no tiene productos por ahora."
                action={<Button variant="secondary" onClick={() => setCategoria("todos")}>Ver todos</Button>}
              />
            ) : (
              <ul className="grid grid-cols-2 gap-x-3 gap-y-8 pt-5 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-12 lg:pt-10">
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
