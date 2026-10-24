import type { Tema, Tienda } from "../types";

/** MT1: una mini tienda por tema, con identidad y foto de la propia tienda. */
export function MiniaturaTema({ tienda, tema, nombre }: { tienda: Tienda; tema: Tema; nombre: string }) {
  return <div data-theme={tema} className="flex h-36 flex-col overflow-hidden rounded-theme bg-page text-fg">
    <header className="flex h-8 shrink-0 items-center justify-center px-1">
      {tienda.logo ? <img src={tienda.logo} alt={nombre} className="h-5 max-w-16 object-contain" /> : <span className="truncate font-display-title text-label uppercase">{nombre}</span>}
    </header>
    {tienda.portada ? <img src={tienda.portada} alt="" className="h-16 w-full object-cover" /> : <div className="h-16 bg-sunken" />}
    <div className="flex flex-1 flex-wrap items-center justify-between gap-1 p-1">
      <span className="text-label font-normal tabular-nums">S/ 360</span><span className="rounded-button bg-accent px-1 py-1 text-label text-on-accent">Comprar</span>
    </div>
  </div>;
}
