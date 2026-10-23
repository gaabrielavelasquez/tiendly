import Link from "next/link";

/**
 * Controles del PROTOTIPO (no son parte del diseño): elegir el ejemplo o el estado que se quiere ver.
 * Borde punteado y la palabra "Prototipo" para que nadie los confunda con la interfaz propuesta.
 */
export function ControlPrototipo({ etiqueta, children }: { etiqueta: string; children: React.ReactNode }) {
  return (
    <div role="group" aria-label={`Prototipo: ${etiqueta}`} className="-mx-4 flex items-center gap-2 overflow-x-auto border-y border-dashed border-line-strong px-4 py-2 lg:mx-0 lg:rounded-card lg:border-x">
      <span className="shrink-0 text-label font-semibold tracking-wider text-fg-secondary uppercase">Prototipo · {etiqueta}</span>
      {children}
      <Link href="/prototipo" className="ml-auto shrink-0 text-caption text-accent-text underline underline-offset-4">Índice</Link>
    </div>
  );
}
