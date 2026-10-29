"use client";

import Image from "next/image";
import { cn } from "@/lib/cn";
import type { ImagenForm, OpcionForm } from "../../lib/formulario";

type Props = { opcion: OpcionForm; imagenes: ImagenForm[]; fotosPorValor: Record<string, string[]>; onAlternar: (valor: string, idImg: string) => void };

/**
 * Qué fotos van con cada valor de la opción que cambia las fotos ("Blanco": estas dos). Tocar una miniatura la suma o la
 * quita (marcada en selection/*). Un valor sin fotos marcadas muestra todas en la tienda.
 */
export function FotosPorValor({ opcion, imagenes, fotosPorValor, onAlternar }: Props) {
  if (!imagenes.length) return <p className="text-caption text-fg-secondary">Sube fotos arriba para asignarlas a cada {opcion.nombre.toLowerCase() || "valor"}.</p>;
  return (
    <ul className="flex flex-col divide-y divide-line-subtle">
      {opcion.valores.map((v) => {
        const elegidas = fotosPorValor[v] ?? [];
        return (
          <li key={v} className="flex flex-col gap-2 py-3 first:pt-0 last:pb-0">
            <p className="text-body-sm text-fg">
              <span className="font-semibold">{v}</span>{" "}
              <span className="text-fg-secondary">{elegidas.length ? `· ${elegidas.length} de ${imagenes.length}` : "· todas las fotos"}</span>
            </p>
            <div role="group" aria-label={`Fotos de ${v}`} className="flex flex-wrap gap-2">
              {imagenes.map((img, n) => {
                const marcada = elegidas.includes(img.id);
                return (
                  <button key={img.id} type="button" aria-pressed={marcada} aria-label={`Foto ${n + 1} para ${v}`} onClick={() => onAlternar(v, img.id)}
                    className={cn("relative size-12 overflow-hidden rounded-theme ring-2 ring-offset-2 transition", marcada ? "ring-selected-border" : "ring-transparent opacity-60 hover:opacity-100")}>
                    <Image src={img.url} alt="" fill sizes="48px" className="object-cover" unoptimized={img.url.startsWith("blob:")} />
                  </button>
                );
              })}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
