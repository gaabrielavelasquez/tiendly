import { Info } from "lucide-react";

/** Franja tranquila arriba del panel cuando se mira una tienda de ejemplo en producción (decisión 0046). */
export function AvisoDemo() {
  return (
    <div role="note" className="border-b border-line-subtle bg-sunken">
      {/* Mismo ancho y márgenes que PanelMain, para que el texto se alinee con el contenido. */}
      <div className="mx-auto flex w-full max-w-6xl items-center gap-2 px-4 py-2 lg:px-12">
        <Info aria-hidden strokeWidth={1.5} className="size-4 shrink-0 text-icon" />
        <p className="min-w-0 text-body-sm text-pretty text-fg-secondary">Esta es una tienda de ejemplo: puedes explorar, pero los cambios no se guardan.</p>
      </div>
    </div>
  );
}
