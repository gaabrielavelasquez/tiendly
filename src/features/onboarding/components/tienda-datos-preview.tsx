import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import { sinProtocolo } from "@/lib/formato-link";
import { formatoSoles } from "@/lib/formato";
import { cn } from "@/lib/cn";
import { productosMuestra } from "../lib/productos-muestra";
import type { RubroId } from "../lib/rubros";

type Props = { nombre: string; url: string; rubros: RubroId[] };

/** Nombre/link en vivo, Neutral siempre; productos de muestra por rubro, sin crear catálogo. */
export function TiendaDatosPreview({ nombre, url, rubros }: Props) {
  return <figure className="mx-auto flex w-full min-w-0 max-w-64 flex-col gap-3 lg:max-w-lg">
    <figcaption className="text-body-sm text-fg-secondary">Así se verá tu tienda.</figcaption>
    <div data-theme="neutral" className="min-w-0 overflow-hidden rounded-card bg-surface shadow-contenedor">
      <header className="flex min-w-0 items-center justify-between gap-3 border-b border-line-subtle px-4 py-3 lg:px-5 lg:py-4">
        <div className="min-w-0"><p className="truncate font-display-title text-body-lg text-fg">{nombre.trim() || "Tu tienda"}</p><p className="truncate text-caption text-fg-secondary">{sinProtocolo(url)}</p></div>
        <ShoppingBag aria-hidden strokeWidth={1.5} className="size-5 shrink-0 text-icon" />
      </header>
      <ul className="grid grid-cols-2 gap-3 p-4 lg:p-5">
        {productosMuestra(rubros).map((p, i) => <li key={p.foto} className={cn("min-w-0", i >= 2 && "hidden lg:block")}>
          <div className="relative aspect-[4/3] overflow-hidden rounded-theme lg:aspect-4/5"><Image src={p.foto} alt={p.alt} fill loading="eager" sizes="(min-width: 64rem) 14rem, 7rem" className="object-cover" /></div>
          <p className="mt-1.5 truncate text-caption text-fg">{p.nombre}</p><p className="text-caption text-fg-secondary tabular-nums">{formatoSoles(p.precio)}</p>
        </li>)}
      </ul>
    </div>
    <p className="text-caption text-fg-secondary">Productos de muestra. Agregarás los tuyos después.</p>
  </figure>;
}
