"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { MontoPedido as Monto } from "@/features/pedidos/components/monto-pedido";
import { Button } from "@/components/ui";
import { formatoSoles } from "@/lib/formato";
import { cn } from "@/lib/cn";
import type { Entrega, Linea, Totales } from "../../types";
import { Desglose, ListaLineas, textoEnvio } from "./desglose";

type Base = { lineas: Linea[]; totales: Totales; cupon?: string; entrega: Entrega | null };

/** "S/ 650 productos + S/ 15 envío", "S/ 650 productos · Recojo gratis" o "Envío: elige tu distrito". */
function bajada(t: Totales, entrega: Entrega | null) {
  const productos = `${formatoSoles(t.productos - t.descuento)} productos`;
  if (entrega?.tipo === "recojo") return `${productos} · Recojo gratis`;
  if (entrega?.tipo === "coordinar") return `${productos} · Envío por coordinar`;
  if (t.envio === null) return t.envioGratis ? `${productos} · Envío gratis` : "Envío: elige tu distrito";
  return `${productos} + ${textoEnvio(t).toLowerCase() === "gratis" ? "envío gratis" : `${textoEnvio(t)} envío`}`;
}

/** Móvil: "Tu pedido · N productos" plegable arriba de los pasos (Figma K0 y K5). */
export function ResumenMovil({ lineas, totales, cupon, entrega, children }: Base & { children?: React.ReactNode }) {
  const [abierto, setAbierto] = useState(false);
  return (
    <section aria-label="Tu pedido" className="min-w-0 rounded-card bg-surface shadow-contenedor lg:hidden">
      <button type="button" aria-expanded={abierto} onClick={() => setAbierto((v) => !v)} className="flex w-full items-center gap-3 p-4 text-left">
        <span className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="text-caption text-fg-secondary">Tu pedido · {totales.unidades} {totales.unidades === 1 ? "producto" : "productos"}</span>
          <Monto valor={totales.total} className="text-h3 font-semibold text-fg" />
          <span className="text-caption text-fg-secondary">{bajada(totales, entrega)}</span>
        </span>
        <ChevronDown aria-hidden strokeWidth={1.6} className={cn("size-5 text-icon transition-transform", abierto && "rotate-180")} />
        <span className="sr-only">{abierto ? "Ocultar detalle" : "Ver detalle"}</span>
      </button>
      {abierto && (
        <div className="flex flex-col gap-4 px-4 pb-4">
          <ListaLineas lineas={lineas} />
          {children}
          <Desglose totales={totales} cupon={cupon} entrega={entrega} className="border-t border-line-subtle pt-3" />
        </div>
      )}
    </section>
  );
}

type Accion = { etiqueta: string; nota?: string; listo: boolean; procesando: boolean; onPagar: () => void };

/** Desktop: "Resumen del pedido" fijo a la derecha, con el botón de pago (Figma D2). */
export function ResumenDesktop({ lineas, totales, cupon, entrega, accion, children }: Base & { accion: Accion; children?: React.ReactNode }) {
  return (
    <section aria-labelledby="resumen-compra" className="sticky top-24 hidden min-w-0 flex-col gap-3 lg:flex">
      <h2 id="resumen-compra" className="font-display-light text-h3 text-fg">Resumen del pedido</h2>
      <div className="flex min-w-0 flex-col gap-5 rounded-card bg-surface p-6 shadow-contenedor">
      <ListaLineas lineas={lineas} />
      {children}
      <Desglose totales={totales} cupon={cupon} entrega={entrega} className="border-t border-line-subtle pt-4" />
      <BotonPagar {...accion} />
      </div>
    </section>
  );
}

/** Móvil: barra fija con "Total con envío" y el botón de pago, solo en el paso de pago (Figma). */
export function BarraPagar({ total, accion }: { total: number; accion: Accion }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-20 flex flex-col gap-2 border-t border-line-subtle bg-surface px-4 pt-3 pb-[max(env(safe-area-inset-bottom),--spacing(3))] lg:hidden">
      <p className="flex items-baseline justify-between">
        <span className="text-body-sm text-fg-secondary">Total con envío</span>
        <Monto valor={total} className="text-h3 font-semibold text-fg" />
      </p>
      <BotonPagar {...accion} />
    </div>
  );
}

function BotonPagar({ etiqueta, nota, listo, procesando, onPagar }: Accion) {
  return (
    <div className="flex flex-col gap-2">
      <Button block onClick={onPagar} disabled={!listo || procesando} aria-busy={procesando || undefined} className="h-12">
        {procesando ? "Procesando pago…" : etiqueta}
      </Button>
      {nota && <p className="text-center text-caption text-fg-secondary">{nota}</p>}
    </div>
  );
}
