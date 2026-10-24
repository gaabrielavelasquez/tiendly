import { Package } from "lucide-react";
import { estiloAcento } from "../lib/config";
import type { Tema, Tienda } from "../types";
import type { Muestra } from "./tienda-preview";

/** Mini tienda: identidad y productos propios, o muestras por rubro si el catálogo está vacío. */
export function MiniaturaTema({ tienda, tema, nombre, muestras }: { tienda: Tienda; tema: Tema; nombre: string; muestras: Muestra[] }) {
  return <div data-theme={tema} style={estiloAcento(tienda.acento)} className="flex min-w-0 flex-col overflow-hidden rounded-theme bg-page text-fg">
    <header className="flex h-8 min-w-0 shrink-0 items-center justify-center px-1">
      {tienda.logo ? <img src={tienda.logo} alt={nombre} className="h-5 max-w-16 object-contain" /> : <span className="truncate font-display-title text-label">{nombre}</span>}
    </header>
    {tienda.portada && <img src={tienda.portada} alt="" className="aspect-video w-full object-cover" />}
    <div className="grid min-w-0 grid-cols-2 gap-1 p-1">
      {muestras.slice(0, 2).map(p => <div key={p.nombre} className="min-w-0">
        {p.foto ? <img src={p.foto} alt={p.nombre} className="aspect-[4/5] w-full rounded-theme object-cover" /> : <div className="flex aspect-[4/5] items-center justify-center"><Package aria-hidden strokeWidth={1.5} className="size-4 text-icon" /></div>}
        <p className="mt-1 truncate text-label">{p.nombre}</p><p className="truncate text-label font-normal tabular-nums">{p.precio}</p>
      </div>)}
    </div>
    <span aria-hidden className="mx-1 mb-1 rounded-button bg-accent py-1 text-center text-label text-on-accent">Ver productos</span>
  </div>;
}
