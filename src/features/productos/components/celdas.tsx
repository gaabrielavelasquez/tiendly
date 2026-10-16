import Link from "next/link";
import { formatoSoles, plural } from "@/lib/formato";
import type { Producto } from "../types";
import { nivelStock, resumenVariantes, textoStock, variantesAgotadas } from "../lib/reglas";
import { BadgeStock } from "./badge-stock";
import { Miniatura } from "./miniatura";

/** Miniatura + nombre (link a editar) + SKU y variantes. */
export function CeldaProducto({ p }: { p: Producto }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <Miniatura categoria={p.categoria} />
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

/** Badge de nivel + unidades, y aviso si alguna variante se quedó sin stock. */
export function CeldaInventario({ p }: { p: Producto }) {
  const agotadas = variantesAgotadas(p);
  return (
    <div className="flex flex-col items-start gap-1">
      <BadgeStock nivel={nivelStock(p)} />
      <span className="text-caption text-fg-secondary tabular-nums">
        {textoStock(p)}
        {agotadas > 0 && ` · ${plural(agotadas, "variante agotada", "variantes agotadas")}`}
      </span>
    </div>
  );
}

export function CeldaEstado({ p }: { p: Producto }) {
  return p.estado === "borrador" ? (
    <span className="text-body-sm text-fg-secondary">Borrador</span>
  ) : (
    <span className="flex items-center gap-1.5 text-body-sm text-fg">
      <span aria-hidden className="size-1.5 rounded-full bg-success" />
      Activo
    </span>
  );
}

export function CeldaPrecio({ p }: { p: Producto }) {
  return (
    <div className="flex flex-col items-end tabular-nums">
      <span className="text-body-sm font-semibold text-fg">{formatoSoles(p.precio)}</span>
      {p.precioAntes && (
        <span className="text-caption text-fg-tertiary line-through">
          <span className="sr-only">Antes </span>
          {formatoSoles(p.precioAntes)}
        </span>
      )}
    </div>
  );
}
