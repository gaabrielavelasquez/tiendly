import Link from "next/link";
import { Badge } from "@/components/ui";
import { plural } from "@/lib/formato";
import type { Producto } from "../types";
import { nivelStock, resumenVariantes, textoStock, variantesAgotadas } from "../lib/reglas";
import { BadgeStock } from "./badge-stock";
import { Miniatura } from "./miniatura";
import { PrecioOferta } from "./precio-oferta";
import { BadgeProgramada, esProgramada, TextoOferta } from "./texto-oferta";

/** Miniatura + nombre (link a editar; en modo selección, solo texto) + SKU y variantes. */
export function CeldaProducto({ p, enlace = true }: { p: Producto; enlace?: boolean }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <Miniatura categoria={p.categorias[0]} imagen={p.imagen} />
      <div className="flex min-w-0 flex-col gap-0.5">
        {/* Nombres largos: hasta 2 líneas, sin cortar los datos de abajo (decisión de revisión móvil). */}
        {enlace ? (
          <Link href={`/panel/productos/${p.id}`} className="relative line-clamp-2 text-body-sm font-semibold text-fg hover:underline after:absolute after:-inset-y-3 after:-inset-x-1 after:content-['']">
            {p.nombre}
          </Link>
        ) : (
          <span className="line-clamp-2 text-body-sm font-semibold text-fg">{p.nombre}</span>
        )}
        <span className="text-caption text-fg-secondary">
          {p.sku ? `${p.sku} · ` : ""}
          {resumenVariantes(p)}
        </span>
      </div>
    </div>
  );
}

/**
 * Estado = una sola señal. Activo: el nivel de stock (En stock / Bajo stock / Agotado).
 * Pausado: "Pausado" en neutro, porque no se ve en la tienda y su stock no es la noticia.
 */
export function CeldaEstado({ p }: { p: Producto }) {
  return p.estado === "pausado" ? <Badge>Pausado</Badge> : <BadgeStock nivel={nivelStock(p)} />;
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

/**
 * Precio con su oferta (0034): el vigente, el normal tachado y "−22 %"; debajo, la vigencia como texto y, si todavía no
 * empieza, "Programada". Monto sereno (0031): Medium, no SemiBold.
 */
export function CeldaPrecio({ p, hoy, alinear = "derecha" }: { p: Producto; hoy: string; alinear?: "derecha" | "izquierda" }) {
  const derecha = alinear === "derecha";
  return (
    <div className={derecha ? "flex flex-col items-end gap-1" : "flex flex-col items-start gap-1"}>
      <span className="flex items-center gap-2">
        {esProgramada(p, hoy) && <BadgeProgramada />}
        <PrecioOferta p={p} hoy={hoy} className={derecha ? "justify-end" : undefined} />
      </span>
      <TextoOferta p={p} hoy={hoy} />
    </div>
  );
}
