"use client";

import { ShoppingBag } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { ProductoProto } from "../../lib/datos";
import { PrecioOferta } from "../comunes";

const etiqueta = "text-label font-semibold tracking-widest text-fg-secondary uppercase";

/**
 * PROTOTIPO · Página de producto con oferta (0034) y opciones genéricas (0032): un selector por opción (aquí
 * "Tamaño"), el precio nuevo, el de antes tachado y "−22 %". Sin fechas (ronda 2: solo en el panel).
 */
export function FichaProto({ p, hoy }: { p: ProductoProto; hoy: string }) {
  const [elegidos, setElegidos] = useState<string[]>(p.opciones.map((o) => o.valores[0]));
  const variante = elegidos.join("|");
  const quedan = p.stock[variante] ?? 0;

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
      <div className="relative aspect-4/5 overflow-hidden rounded-theme bg-surface">
        {p.foto && <Image src={p.foto} alt={p.nombre} fill priority sizes="(min-width: 64rem) 50vw, 100vw" className="object-cover" />}
      </div>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <h1 className="font-display-hero text-h1 text-fg">{p.nombre}</h1>
          <PrecioOferta p={p} hoy={hoy} tamano="ficha" />
        </div>
        {p.opciones.map((o, i) => (
          <fieldset key={o.nombre} className="flex flex-col gap-3">
            <legend className={etiqueta}>
              {o.nombre} <span aria-hidden>—</span> <span className="text-fg">{elegidos[i]}</span>
            </legend>
            <div role="radiogroup" aria-label={o.nombre} className="flex flex-wrap gap-2 pt-3">
              {o.valores.map((v) => (
                <button key={v} type="button" role="radio" aria-checked={elegidos[i] === v} onClick={() => setElegidos((e) => e.map((x, j) => (j === i ? v : x)))}
                  className={cn("h-11 min-w-16 rounded-theme border px-4 text-body-sm font-semibold transition-colors", elegidos[i] === v ? "border-selected-border bg-selected text-on-selected" : "border-line-strong bg-surface text-fg hover:border-fg")}>
                  {v}
                </button>
              ))}
            </div>
          </fieldset>
        ))}
        {quedan > 0 && quedan <= 5 && <p className="text-body-sm text-warning">{quedan === 1 ? "Queda 1." : `Quedan ${quedan}.`}</p>}
        <div className="flex flex-col gap-2">
          <Button block><span className="flex items-center gap-2"><ShoppingBag aria-hidden strokeWidth={1.5} className="size-4" />Agregar al carrito</span></Button>
          <a href="#" className={cn(buttonVariants({ variant: "secondary", block: true }), "transition active:scale-98")}>Consultar por WhatsApp</a>
        </div>
      </div>
    </div>
  );
}
