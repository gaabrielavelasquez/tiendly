"use client";

import { X } from "lucide-react";
import { motion, useIsPresent } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";
import { Button, buttonVariants } from "@/components/ui";
import { cn } from "@/lib/cn";
import { motionTokens } from "@/styles/tokens";
import type { DatosCompra } from "../../lib/catalogo";
import { useCajon } from "../../hooks/use-cajon";
import { useVistaCarrito } from "../../hooks/use-vista-carrito";
import { ContenidoCarrito } from "./contenido-carrito";
import { PieCarrito } from "./pie-carrito";

const ease = [...motionTokens.easing] as [number, number, number, number];

type Props = { datos: DatosCompra; resaltar?: string; onCerrar: () => void };

/**
 * Drawer del carrito (0036, actualiza 0007). Tablet y desktop: panel de 420 px desde la derecha, con la tienda detrás
 * de un velo suave. Celular: pantalla completa desde abajo, con "X". Lo recién agregado se resalta 2 s. Pie fijo con
 * subtotal, "Finalizar compra" y "Seguir comprando". Se cierra con la X, Escape o tocando el velo.
 */
export function CajonCarrito({ datos, resaltar, onCerrar }: Props) {
  const v = useVistaCarrito(datos);
  const router = useRouter();
  const reduce = useReducedMotion();
  const presente = useIsPresent();
  const { panel, activo } = useCajon(onCerrar, presente);
  const [marcada, setMarcada] = useState(resaltar);
  const [movil] = useState(() => !window.matchMedia("(min-width: 48rem)").matches);
  useEffect(() => {
    const t = window.setTimeout(() => setMarcada(undefined), 2000);
    return () => window.clearTimeout(t);
  }, []);

  const inicio = `/${datos.tienda.slug}`;
  const fuera = reduce ? { opacity: 0 } : movil ? { y: "100%" } : { x: "100%" };
  const transicion = { duration: motionTokens.durationFast * 1.6, ease };
  const finalizar = () => (router.push(`${inicio}/checkout`), onCerrar());

  return (
    <div className={cn("fixed inset-0 z-50", (!activo || !presente) && "pointer-events-none")}>
      <motion.div aria-hidden className="absolute inset-0 bg-fg/30" onClick={onCerrar}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={transicion} />
      <motion.div ref={panel} role="dialog" aria-modal aria-labelledby="carrito-titulo" tabIndex={-1}
        initial={fuera} animate={{ x: 0, y: 0, opacity: 1 }} exit={fuera} transition={transicion}
        className="absolute inset-y-0 right-0 flex w-full flex-col bg-surface shadow-overlay outline-none md:w-105">
        <header className="flex items-center justify-between gap-3 border-b border-line-subtle py-2 pr-3 pl-5">
          <h2 id="carrito-titulo" className="text-h3 font-semibold text-fg">
            Tu carrito{v.totales.unidades > 0 && <span className="font-normal text-fg-secondary tabular-nums"> ({v.totales.unidades})</span>}
          </h2>
          <button type="button" onClick={onCerrar} aria-label="Cerrar carrito" className="flex size-11 items-center justify-center rounded-theme text-icon hover:bg-sunken">
            <X aria-hidden strokeWidth={1.5} className="size-5" />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5">
          <ContenidoCarrito v={v} tienda={datos.tienda.slug} hayCupones={datos.hayCupones} resaltar={marcada} onIr={onCerrar}
            vacio={<Link href={inicio} onClick={onCerrar} className={buttonVariants()}>Ver productos</Link>} />
        </div>
        {v.lineas && v.lineas.length > 0 && (
          <footer className="border-t border-line-subtle px-5 pt-4 pb-[max(calc(var(--spacing)*4),env(safe-area-inset-bottom))]">
            <PieCarrito totales={v.totales} cupon={v.cupon?.codigo} bloqueado={v.bloqueado} onFinalizar={finalizar}
              seguir={<Button variant="secondary" block onClick={onCerrar}>Seguir comprando</Button>} />
          </footer>
        )}
      </motion.div>
    </div>
  );
}
