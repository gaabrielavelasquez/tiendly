"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/cn";

type GaleriaProps = { fotos: string[]; nombre: string; color: string };

/**
 * Galería del producto (Figma): foto grande y miniaturas debajo. Muestra las fotos del color elegido;
 * el padre la remonta con key={color} para volver a la primera foto al cambiar de color.
 */
export function Galeria({ fotos, nombre, color }: GaleriaProps) {
  const [actual, setActual] = useState(0);
  const foto = fotos[actual] ?? fotos[0];
  return (
    <div className="flex flex-col gap-3 md:sticky md:top-24 md:self-start">
      {/* En el celular, la foto ocupa como máximo el 60 % del alto visible: así el nombre y el precio asoman sin hacer scroll. */}
      <div className="relative aspect-4/5 max-h-[60svh] overflow-hidden rounded-card border border-line-subtle bg-surface md:max-h-none">
        {foto && <Image src={foto} alt={`${nombre} en ${color}`} fill priority sizes="(min-width: 48rem) 50vw, 100vw" className="object-cover" />}
      </div>
      {fotos.length > 1 && (
        <div role="group" aria-label="Fotos del producto" className="grid grid-cols-4 gap-3">
          {fotos.map((f, i) => (
            <button
              key={f}
              type="button"
              aria-label={`Ver foto ${i + 1} de ${fotos.length}`}
              aria-current={i === actual}
              onClick={() => setActual(i)}
              className={cn("relative aspect-square overflow-hidden rounded-card border bg-surface transition", i === actual ? "border-fg" : "border-line-subtle hover:border-line-strong")}
            >
              <Image src={f} alt="" fill sizes="(min-width: 64rem) 12vw, 25vw" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
