import { ShoppingBag } from "lucide-react";
import { sinProtocolo } from "@/lib/formato-link";

/** La tienda recién creada empieza vacía: nombre y URL propios, sin productos ni fotos ficticias. */
export function TiendaCreadaPreview({ nombre, url }: { nombre: string; url: string }) {
  return (
    <figure className="flex min-w-0 flex-col gap-3">
      <figcaption className="text-body-sm text-fg-secondary">Así se verá tu tienda.</figcaption>
      <div data-theme="neutral" className="min-w-0 overflow-hidden rounded-card bg-surface shadow-contenedor">
        <header className="flex items-center justify-between gap-3 border-b border-line-subtle px-5 py-4">
          <p className="min-w-0 truncate font-display-title text-body-lg text-fg">{nombre.trim() || "Tu tienda"}</p>
          <ShoppingBag aria-hidden strokeWidth={1.5} className="size-5 shrink-0 text-icon" />
        </header>
        <div className="flex flex-col gap-3 px-5 py-10 text-center">
          <p className="font-titulo-seccion text-h3 text-fg">Tus productos van aquí</p>
          <p className="text-body-sm text-fg-secondary">Tu tienda ya tiene su link. Agrega tu primer producto desde el panel.</p>
        </div>
        <a href={url} target="_blank" rel="noopener noreferrer" className="block truncate border-t border-line-subtle px-5 py-4 text-body-sm text-accent-text underline underline-offset-4">{sinProtocolo(url)}</a>
      </div>
    </figure>
  );
}
