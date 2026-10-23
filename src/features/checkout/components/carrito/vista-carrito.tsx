"use client";

import { ShoppingBag, Truck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { buttonVariants, EmptyState, Skeleton } from "@/components/ui";
import { CabeceraTienda } from "@/features/vitrina/components/cabecera-tienda";
import type { DatosCompra } from "../../lib/catalogo";
import { aplicarCupon } from "../../lib/acciones";
import { calcularTotales } from "../../lib/reglas";
import { useCarrito } from "../../hooks/use-carrito";
import { AvisoDeshacer } from "../aviso-deshacer";
import { Cupon } from "../cupon";
import { EncabezadoCompra } from "../encabezado-compra";
import { EnvioGratis } from "./envio-gratis";
import { LineaCarrito } from "./linea-carrito";
import { BarraCarrito, ResumenCarrito } from "./resumen-carrito";

/**
 * Carrito (Figma, módulo 1 · paso 1 de 2): líneas con cantidad y "Quitar" (con Deshacer), avance al
 * envío gratis y cupón. Móvil: barra fija abajo. Desktop: resumen fijo a la derecha (D1).
 */
export function VistaCarrito({ datos }: { datos: DatosCompra }) {
  const { tienda, categorias, catalogo, reglas } = datos;
  const c = useCarrito(tienda.slug, catalogo);
  const router = useRouter();
  const inicio = `/${tienda.slug}`;
  const totales = calcularTotales(c.lineas ?? [], c.cupon, null, reglas.envioGratisDesde);
  const bloqueado = Boolean(c.lineas?.some((l) => l.maximo === 0));
  const finalizar = () => router.push(`/${tienda.slug}/checkout`);
  const cupon = (clase: string) => (
    <Cupon cupon={c.cupon} descuento={totales.descuento} validar={(codigo) => aplicarCupon(tienda.slug, codigo, totales.productos)} onAplicar={c.setCupon} className={clase} />
  );

  return (
    <div className="flex min-h-dvh flex-col">
      <div className="hidden lg:block">
        <CabeceraTienda nombre={tienda.nombre} logo={tienda.logo} slug={tienda.slug} categorias={categorias} />
      </div>
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 pt-2 pb-56 lg:gap-8 lg:pt-10 lg:pb-16">
        <EncabezadoCompra paso={1} titulo="Tu carrito" volver={inicio} volverLabel="Volver a la tienda" carrito={`${inicio}/carrito`} />
        {c.lineas === null ? (
          <div aria-busy className="flex flex-col gap-4 lg:w-2/3">
            <span className="sr-only">Cargando tu carrito</span>
            <Skeleton className="h-36" />
            <Skeleton className="h-36" />
            <Skeleton className="h-24" />
          </div>
        ) : c.lineas.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title="Tu carrito está vacío"
            description="Cuando agregues productos, aparecerán aquí."
            action={
              <Link href={inicio} className={buttonVariants()}>
                Ver productos
              </Link>
            }
          />
        ) : (
          <div className="grid items-start gap-8 lg:grid-cols-3">
            <div className="flex flex-col gap-4 lg:col-span-2">
              <ul className="flex flex-col gap-4">
                {c.lineas.map((l, i) => (
                  <LineaCarrito key={`${l.id}-${l.variante}`} linea={l} tienda={tienda.slug} prioridad={i < 2} onCantidad={(n) => c.cambiarCantidad(l, n)} onQuitar={() => c.quitar(l)} />
                ))}
              </ul>
              <EnvioGratis base={totales.productos - totales.descuento} desde={reglas.envioGratisDesde} />
              {cupon("lg:hidden")}
              {!totales.envioGratis && (
                <p className="flex items-center gap-3 bg-sunken p-4 text-body-sm text-fg-secondary">
                  <Truck aria-hidden strokeWidth={1.6} className="size-5 shrink-0 text-icon" />
                  El costo de envío lo ves en el siguiente paso.
                </p>
              )}
              {bloqueado && <p className="text-body-sm text-error">Quita las tallas agotadas para finalizar tu compra.</p>}
            </div>
            <ResumenCarrito totales={totales} cupon={c.cupon?.codigo} seguir={inicio} onFinalizar={finalizar} bloqueado={bloqueado}>
              {cupon("")}
            </ResumenCarrito>
            <BarraCarrito totales={totales} seguir={inicio} onFinalizar={finalizar} bloqueado={bloqueado} />
          </div>
        )}
      </main>
      <AvisoDeshacer texto={c.quitado ? `Quitaste ${c.quitado.linea.nombre} del carrito` : null} onDeshacer={c.deshacer} />
    </div>
  );
}
