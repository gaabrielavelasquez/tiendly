import { Check, Info, LoaderCircle } from "lucide-react";
import type { EstadoSlug } from "../hooks/use-slug-check";

/** Aviso del link generado (decisión 0013): libre, revisando u ocupado con sugerencia. */
export function SlugStatus({ estado }: { estado: EstadoSlug }) {
  if (estado.estado === "vacio") return null;
  const base = "flex items-start gap-2 rounded-button border px-3 py-2.5 text-body-sm";
  if (estado.estado === "revisando") {
    return (
      <p aria-live="polite" className={`${base} border-line-subtle bg-sunken text-fg-secondary`}>
        <LoaderCircle aria-hidden className="mt-px size-4 shrink-0 motion-safe:animate-spin" />
        Revisando tiendly.pe/{estado.slug}…
      </p>
    );
  }
  if (estado.libre) {
    return (
      <p aria-live="polite" className={`${base} border-success-border bg-success-surface text-success`}>
        <Check aria-hidden className="mt-px size-4 shrink-0" />
        <span>
          <strong className="font-semibold">tiendly.pe/{estado.slug}</strong> está libre.
        </span>
      </p>
    );
  }
  return (
    <p aria-live="polite" className={`${base} border-info-border bg-info-surface text-info`}>
      <Info aria-hidden className="mt-px size-4 shrink-0" />
      <span>
        tiendly.pe/{estado.slug} ya está en uso. Te dejamos{" "}
        <strong className="font-semibold">tiendly.pe/{estado.sugerencia}</strong>.
      </span>
    </p>
  );
}
