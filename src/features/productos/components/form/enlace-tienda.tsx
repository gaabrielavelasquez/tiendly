import { ExternalLink } from "lucide-react";

/** Abre la ficha guardada; no construye enlaces con nombres o estados que aún no se guardaron. */
export function EnlaceTienda({ url, nota }: { url?: string | null; nota: string }) {
  return (
    <div className="flex min-w-0 flex-col items-start">
      {url ? (
        <a href={url} target="_blank" rel="noopener noreferrer" className="link-text flex min-h-11 items-center gap-1.5 text-body-sm">
          Ver en la tienda<ExternalLink aria-hidden strokeWidth={1.5} className="size-4 shrink-0" />
        </a>
      ) : (
        <>
          <span role="link" aria-disabled="true" className="flex min-h-11 items-center gap-1.5 text-body-sm text-fg-tertiary">
            Ver en la tienda<ExternalLink aria-hidden strokeWidth={1.5} className="size-4 shrink-0" />
          </span>
          <span className="text-caption text-fg-secondary">{nota}</span>
        </>
      )}
    </div>
  );
}
