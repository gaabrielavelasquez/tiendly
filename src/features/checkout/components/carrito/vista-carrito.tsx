"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { buttonVariants } from "@/components/ui";
import { cn } from "@/lib/cn";
import { CabeceraTienda } from "@/features/vitrina/components/cabecera-tienda";
import type { DatosCompra } from "../../lib/catalogo";
import { useVistaCarrito } from "../../hooks/use-vista-carrito";
import { EncabezadoCompra } from "../encabezado-compra";
import { ContenidoCarrito } from "./contenido-carrito";
import { PieCarrito } from "./pie-carrito";

/**
 * Carrito como página (Figma, módulo 1 · paso 1 de 2), para links directos a /carrito. Mismo contenido que el drawer
 * (0036). Móvil: pie fijo abajo. Desktop: el pie va en un resumen fijo a la derecha (D1).
 */
export function VistaCarrito({ datos }: { datos: DatosCompra }) {
  const { tienda, categorias } = datos;
  const v = useVistaCarrito(datos);
  const router = useRouter();
  const inicio = `/${tienda.slug}`;
  const conProductos = Boolean(v.lineas?.length);
  const seguir = (
    <Link href={inicio} className={cn(buttonVariants({ variant: "secondary", block: true }))}>
      Seguir comprando
    </Link>
  );
  const pie = <PieCarrito totales={v.totales} cupon={v.cupon?.codigo} bloqueado={v.bloqueado} onFinalizar={() => router.push(`${inicio}/checkout`)} seguir={seguir} />;

  return (
    <div className="flex min-h-dvh flex-col">
      <div className="hidden lg:block">
        <CabeceraTienda nombre={tienda.nombre} logo={tienda.logo} slug={tienda.slug} categorias={categorias} />
      </div>
      <main className={cn("mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 pt-2 lg:gap-8 lg:pt-10 lg:pb-16", conProductos ? "pb-72" : "pb-10")}>
        <EncabezadoCompra paso={1} titulo="Tu carrito" volver={inicio} volverLabel="Volver a la tienda" carrito={`${inicio}/carrito`} />
        <div className="grid items-start gap-8 lg:grid-cols-3">
          <div className="min-w-0 lg:col-span-2">
            <ContenidoCarrito v={v} tienda={tienda.slug} hayCupones={datos.hayCupones}
              vacio={<Link href={inicio} className={buttonVariants()}>Seguir comprando</Link>} />
          </div>
          {conProductos && (
            <>
              <section aria-label="Resumen del pedido" className="sticky top-24 hidden rounded-card border border-line-subtle bg-surface p-6 lg:block">{pie}</section>
              <div className="fixed inset-x-0 bottom-0 z-20 border-t border-line-subtle bg-surface px-4 pt-3 pb-[max(env(safe-area-inset-bottom),--spacing(3))] lg:hidden">{pie}</div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
