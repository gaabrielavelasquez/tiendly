"use client";

import { Package } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { Badge } from "@/components/ui";
import { cn } from "@/lib/cn";
import { plural } from "@/lib/formato";
import { stockTotal, type ProductoProto } from "../../lib/datos";
import { estadoOferta, vigencia } from "../../lib/oferta";
import { BadgeProgramada, PrecioOferta } from "../comunes";

type Props = { p: ProductoProto; hoy: string; seleccionando: boolean; marcado: boolean; onAlternar: () => void; onMantener: () => void };

export function Miniatura({ p }: { p: ProductoProto }) {
  return (
    <span className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-theme bg-sunken">
      {p.foto ? <Image src={p.foto} alt="" fill sizes="48px" className="object-cover" /> : <Package aria-hidden strokeWidth={1.5} className="size-5 text-icon-subtle" />}
    </span>
  );
}

/**
 * Línea de oferta en el panel: "Hasta el domingo 25." o "Terminó el 20 de octubre." como texto (0031); la programada
 * suma el badge "Programada" (ronda 2), porque es un estado. Las fechas solo se ven en el panel, nunca en la tienda.
 */
export function TextoOferta({ p, hoy, conBadge = true }: { p: ProductoProto; hoy: string; conBadge?: boolean }) {
  const v = vigencia(p, hoy);
  if (!v) return null;
  const texto = <span className={cn("text-caption", v.urgente ? "text-warning" : "text-fg-secondary")}>{v.texto}.</span>;
  if (!conBadge || estadoOferta(p, hoy) !== "programada") return texto;
  return <span className="inline-flex flex-wrap items-center gap-1.5"><BadgeProgramada />{texto}</span>;
}

/** Móvil: nombre, precio (con su oferta) y una línea de detalle; el nombre usa todo el ancho, sin columna de precio. */
function Contenido({ p, hoy }: { p: ProductoProto; hoy: string }) {
  const stock = stockTotal(p);
  return (
    <>
      <Miniatura p={p} />
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="flex items-center gap-2">
          <span className="truncate text-body-sm font-semibold text-fg">{p.nombre}</span>
          {p.estado === "pausado" && <Badge>Pausado</Badge>}
        </span>
        <span className="flex items-center gap-2">
          <PrecioOferta p={p} hoy={hoy} />
          {estadoOferta(p, hoy) === "programada" && <BadgeProgramada />}
        </span>
        <span className="flex flex-wrap gap-x-1.5 text-caption">
          <span className={stock === 0 ? "text-error" : "text-fg-secondary"}>{stock === 0 ? "Agotado" : plural(stock, "unidad", "unidades")}</span>
          {vigencia(p, hoy) && <span aria-hidden className="text-fg-tertiary">·</span>}
          <TextoOferta p={p} hoy={hoy} conBadge={false} />
        </span>
      </span>
    </>
  );
}

const fila = "flex min-h-18 w-full items-center gap-3 px-4 py-3 text-left transition-colors select-none";

/**
 * Fila de la lista en móvil. Normal: toda la fila abre el producto; mantener presionado (450 ms) entra al modo selección
 * con esa fila marcada. Modo selección: la fila es la etiqueta de su casilla (tocar en cualquier parte la marca).
 */
export function FilaMovil({ p, hoy, seleccionando, marcado, onAlternar, onMantener }: Props) {
  const timer = useRef<number | undefined>(undefined);
  const largo = useRef(false);
  const soltar = () => window.clearTimeout(timer.current);
  if (seleccionando) {
    return (
      <li>
        <label className={cn(fila, "cursor-pointer", marcado && "bg-sunken")}>
          <input type="checkbox" checked={marcado} onChange={onAlternar} aria-label={`Seleccionar ${p.nombre}`} className="size-5 shrink-0 accent-selected" />
          <Contenido p={p} hoy={hoy} />
        </label>
      </li>
    );
  }
  return (
    <li>
      <Link
        href="/panel/prototipo/producto?ejemplo=serum"
        className={fila}
        onPointerDown={() => ((largo.current = false), (timer.current = window.setTimeout(() => ((largo.current = true), navigator.vibrate?.(10), onMantener()), 450)))}
        onPointerUp={soltar}
        onPointerLeave={soltar}
        onContextMenu={(e) => e.preventDefault()}
        onClick={(e) => largo.current && e.preventDefault()}
      >
        <Contenido p={p} hoy={hoy} />
      </Link>
    </li>
  );
}
