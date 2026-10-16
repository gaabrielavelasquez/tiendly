"use client";

import { ImagePlus, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { Badge } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { ImagenForm } from "../../lib/formulario";
import { Tarjeta } from "./tarjeta";

const MAX_MB = 5;

type MediaProps = { imagenes: ImagenForm[]; onAgregar: (i: ImagenForm[]) => void; onQuitar: (id: string) => void };

/**
 * Fotos: zona para soltar o elegir archivos (punteada sobre bg/page). Valida tipo y peso; la primera
 * foto es la principal. Hasta tener backend, las vistas previas viven solo en este navegador.
 */
export function TarjetaMedia({ imagenes, onAgregar, onQuitar }: MediaProps) {
  const input = useRef<HTMLInputElement>(null);
  const [encima, setEncima] = useState(false);
  const [error, setError] = useState("");

  function recibir(archivos: FileList | null) {
    if (!archivos?.length) return;
    const validos = [...archivos].filter((f) => f.type.startsWith("image/") && f.size <= MAX_MB * 1024 * 1024);
    const rechazados = archivos.length - validos.length;
    setError(rechazados ? `${rechazados === 1 ? "Un archivo no se subió" : `${rechazados} archivos no se subieron`}: usa fotos JPG, PNG o WebP de hasta ${MAX_MB} MB.` : "");
    onAgregar(validos.map((f) => ({ id: crypto.randomUUID(), url: URL.createObjectURL(f), nombre: f.name })));
  }

  return (
    <Tarjeta titulo="Fotos" descripcion="La primera es la principal. Usa fondo claro y buena luz.">
      <div
        onDragOver={(e) => (e.preventDefault(), setEncima(true))}
        onDragLeave={() => setEncima(false)}
        onDrop={(e) => (e.preventDefault(), setEncima(false), recibir(e.dataTransfer.files))}
        className={cn(
          "flex flex-col items-center gap-3 rounded-card border-2 border-dashed px-4 py-8 text-center transition-colors",
          encima ? "border-selected-border bg-sunken" : "border-line bg-page",
        )}
      >
        <span className="flex size-11 items-center justify-center rounded-full border border-line-subtle bg-surface shadow-card">
          <ImagePlus aria-hidden strokeWidth={1.6} className="size-5 text-icon" />
        </span>
        <p className="text-body-sm text-fg">
          <button type="button" onClick={() => input.current?.click()} className="link-text">
            Elige fotos
          </button>{" "}
          <span className="text-fg-secondary">o arrástralas aquí</span>
        </p>
        <p className="text-caption text-fg-secondary">JPG, PNG o WebP, hasta {MAX_MB} MB cada una.</p>
        <input ref={input} type="file" accept="image/*" multiple hidden onChange={(e) => (recibir(e.target.files), (e.target.value = ""))} />
      </div>
      {error && (
        <p role="alert" className="text-caption text-error">
          {error}
        </p>
      )}
      {imagenes.length > 0 && (
        <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
          {imagenes.map((img, i) => (
            <li key={img.id} className="group relative aspect-square overflow-hidden rounded-sm border border-line-subtle bg-sunken">
              <Image src={img.url} alt={img.nombre} fill sizes="120px" className="object-cover" unoptimized={img.url.startsWith("blob:")} />
              {i === 0 && <Badge className="absolute bottom-1.5 left-1.5 shadow-card">Principal</Badge>}
              <button
                type="button"
                aria-label={`Quitar ${img.nombre}`}
                onClick={() => {
                  if (img.url.startsWith("blob:")) URL.revokeObjectURL(img.url); // libera la vista previa
                  onQuitar(img.id);
                }}
                className="absolute top-1.5 right-1.5 flex size-7 items-center justify-center rounded-full bg-surface text-icon shadow-card transition-opacity hover:text-fg pointer-fine:opacity-0 pointer-fine:group-hover:opacity-100 focus-visible:opacity-100"
              >
                <X aria-hidden strokeWidth={1.8} className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </Tarjeta>
  );
}
