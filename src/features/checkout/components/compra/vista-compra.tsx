"use client";

import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { buttonVariants, EmptyState, Skeleton } from "@/components/ui";
import { CabeceraTienda } from "@/features/vitrina/components/cabecera-tienda";
import { formatoSoles } from "@/lib/formato";
import { cn } from "@/lib/cn";
import type { DatosCompra } from "../../lib/catalogo";
import { guardarPedido, nuevoNumero, reservaHasta } from "../../lib/pedido";
import { calcularTotales } from "../../lib/reglas";
import { linkWhatsApp, mensajePedido } from "../../lib/whatsapp";
import { useCarrito } from "../../hooks/use-carrito";
import { useCompra } from "../../hooks/use-compra";
import type { PedidoCreado } from "../../types";
import { Cupon } from "../cupon";
import { EncabezadoCompra } from "../encabezado-compra";
import { PasoDatos } from "./paso-datos";
import { PasoEntrega } from "./paso-entrega";
import { PasoPago } from "./paso-pago";
import { BarraPagar, ResumenDesktop, ResumenMovil } from "./resumen-compra";

/**
 * Finalizar compra (Figma, módulo 1 · paso 2 de 2): una sola vista con Tus datos, Entrega y Pago.
 * Al pagar (o al enviar por WhatsApp) crea el pedido, vacía el carrito y va a la confirmación.
 */
export function VistaCompra({ datos: { tienda, categorias, catalogo } }: { datos: DatosCompra }) {
  const carrito = useCarrito(tienda.slug, catalogo);
  const c = useCompra();
  const router = useRouter();
  const [numero, setNumero] = useState<string | null>(null);
  const [cerrando, setCerrando] = useState(false); // pedido creado: no mostrar "carrito vacío" mientras navega
  const inicio = `/${tienda.slug}`;
  const lineas = carrito.lineas ?? [];
  const totales = calcularTotales(lineas, carrito.cupon, c.entrega);

  // El número se reserva al llegar al pago: el mensaje de WhatsApp ya lo muestra.
  useEffect(() => {
    if (c.paso === "pago" && !numero) setNumero(nuevoNumero(tienda.slug));
  }, [c.paso, numero, tienda.slug]);

  const mensaje = numero && c.entrega ? mensajePedido({ tienda: tienda.nombre, numero, lineas, cupon: carrito.cupon?.codigo, totales, datos: c.datos, entrega: c.entrega }) : "";

  async function pagar() {
    if (!numero || !c.entrega) return;
    const creadoEl = new Date().toISOString();
    const base = { numero, creadoEl, datos: c.datos, entrega: c.entrega, lineas, cupon: carrito.cupon?.codigo, totales };
    let pedido: PedidoCreado;
    if (c.metodo === "whatsapp") {
      window.open(linkWhatsApp(tienda.celular, mensaje), "_blank", "noopener"); // en el mismo clic: así no lo bloquea el navegador
      pedido = { ...base, pago: { metodo: "whatsapp", reservadoHasta: reservaHasta(creadoEl) } };
    } else {
      const pago = await c.confirmar();
      if (!pago || pago.metodo === "whatsapp") return;
      pedido = { ...base, pago };
    }
    guardarPedido(tienda.slug, pedido);
    setCerrando(true);
    carrito.vaciar();
    router.replace(`${inicio}/pedido/${numero}`);
  }

  const listo = c.paso === "pago" && c.hechos.datos && c.hechos.entrega && c.metodo !== null;
  const accion = {
    listo,
    procesando: c.procesando,
    onPagar: pagar,
    etiqueta: !c.metodo ? "Elige cómo pagar" : c.metodo === "whatsapp" ? "Enviar pedido por WhatsApp" : `Pagar ${formatoSoles(totales.total)}${c.metodo === "yape" ? " con Yape" : ""}`,
    nota: !c.hechos.entrega ? "Completa tus datos y la entrega para pagar." : c.metodo === "whatsapp" ? "Se abre WhatsApp con tu pedido ya escrito." : !c.metodo ? "Elige cómo quieres pagar." : undefined,
  };

  return (
    <div className="flex min-h-dvh flex-col">
      <div className="hidden lg:block">
        <CabeceraTienda nombre={tienda.nombre} logo={tienda.logo} slug={tienda.slug} categorias={categorias} />
      </div>
      <main className={cn("mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 pt-2 lg:gap-8 lg:pt-10 lg:pb-16", c.paso === "pago" ? "pb-48" : "pb-10")}>
        <EncabezadoCompra paso={2} titulo="Finalizar compra" volver={`${inicio}/carrito`} volverLabel="Volver al carrito" carrito={`${inicio}/carrito`} />
        {carrito.lineas === null || cerrando ? (
          <div aria-busy className="flex flex-col gap-4 lg:w-2/3">
            <span className="sr-only">{cerrando ? "Creando tu pedido" : "Cargando tu pedido"}</span>
            <Skeleton className="h-20" />
            <Skeleton className="h-64" />
          </div>
        ) : lineas.length === 0 ? (
          <EmptyState icon={ShoppingBag} title="Tu carrito está vacío" description="Agrega productos para finalizar tu compra." action={<Link href={inicio} className={buttonVariants()}>Ver productos</Link>} />
        ) : (
          <div className="grid items-start gap-4 lg:grid-cols-3 lg:gap-8">
            <div className="flex flex-col gap-4 lg:col-span-2">
              <ResumenMovil lineas={lineas} totales={totales} cupon={carrito.cupon?.codigo} entrega={c.entrega} />
              <PasoDatos c={c} />
              <PasoEntrega c={c} envioGratis={totales.envioGratis} tienda={tienda.nombre} />
              <PasoPago c={c} mensaje={mensaje} />
            </div>
            <ResumenDesktop lineas={lineas} totales={totales} cupon={carrito.cupon?.codigo} entrega={c.entrega} accion={accion}>
              <Cupon cupon={carrito.cupon} productos={totales.productos} descuento={totales.descuento} onAplicar={carrito.setCupon} />
            </ResumenDesktop>
            {c.paso === "pago" && <BarraPagar total={totales.total} accion={accion} />}
          </div>
        )}
      </main>
    </div>
  );
}
