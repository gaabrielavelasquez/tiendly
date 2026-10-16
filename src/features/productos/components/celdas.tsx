import Link from "next/link";
import { Badge } from "@/components/ui";
import { formatoSoles, plural } from "@/lib/formato";
import type { Producto } from "../types";
import { nivelStock, resumenVariantes, textoStock, variantesAgotadas } from "../lib/reglas";
import { BadgeStock } from "./badge-stock";
import { Miniatura } from "./miniatura";

/** Miniatura + nombre (link a editar) + SKU y variantes. */
export function CeldaProducto({ p }: { p: Producto }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <Miniatura categoria={p.categoria} imagen={p.imagen} />
      <div className="flex min-w-0 flex-col gap-0.5">
        <Link href={`/panel/productos/${p.id}`} className="truncate text-body-sm font-semibold text-fg hover:underline">
          {p.nombre}
        </Link>
        <span className="truncate text-caption text-fg-secondary">
          {p.sku} · {resumenVariantes(p)}
        </span>
      </div>
    </div>
  );
}

/**
 * Estado = una sola señal. Activo: el nivel de stock (En stock / Bajo stock / Agotado).
 * Borrador: "Borrador" en neutro, porque todavía no se vende y su stock no es la noticia.
 */
export function CeldaEstado({ p }: { p: Producto }) {
  return p.estado === "borrador" ? <Badge>Borrador</Badge> : <BadgeStock nivel={nivelStock(p)} />;
}

/** Solo números: unidades totales y, si hace falta reponer, cuántas variantes se agotaron. */
export function CeldaInventario({ p }: { p: Producto }) {
  const agotadas = variantesAgotadas(p);
  return (
    <div className="flex flex-col gap-0.5 tabular-nums">
      <span className="text-body-sm text-fg">{textoStock(p)}</span>
      {agotadas > 0 && <span className="text-caption text-fg-secondary">{plural(agotadas, "variante agotada", "variantes agotadas")}</span>}
    </div>
  );
}

/** Versión en una línea para móvil: "3 unidades · 1 variante agotada". */
export function TextoInventario({ p }: { p: Producto }) {
  const agotadas = variantesAgotadas(p);
  return (
    <span className="text-caption text-fg-secondary tabular-nums">
      {textoStock(p)}
      {agotadas > 0 && ` · ${plural(agotadas, "variante agotada", "variantes agotadas")}`}
    </span>
  );
}

/** Precio final protagonista; el de antes, más chico, atenuado y tachado (y anunciado como "antes"). */
export function CeldaPrecio({ p }: { p: Producto }) {
  return (
    <div className="flex flex-col items-end gap-0.5 tabular-nums">
      <span className="text-body font-semibold text-fg">{formatoSoles(p.precio)}</span>
      {p.precioAntes && (
        <span className="text-caption text-fg-tertiary line-through">
          <span className="sr-only">Antes: </span>
          {formatoSoles(p.precioAntes)}
        </span>
      )}
    </div>
  );
}
