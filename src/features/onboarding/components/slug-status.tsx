import { LoaderCircle } from "lucide-react";
import { sinProtocolo } from "@/lib/formato-link";
import type { EstadoSlug } from "../hooks/use-slug-check";
import { useOnboarding } from "../hooks/use-onboarding";

/** URL real, en texto sin cajas de estado; conserva revisión, sugerencia y error con reintento. */
export function SlugStatus({ estado }: { estado: EstadoSlug & { reintentar: () => void } }) {
  const { baseTienda } = useOnboarding();
  if (estado.estado === "vacio") return <p className="text-caption text-fg-secondary">Tu link aparece al escribir el nombre.</p>;
  const link = (slug: string) => sinProtocolo(`${baseTienda}${slug}`);
  return <div aria-live="polite" className="flex min-w-0 flex-col gap-1 text-caption text-fg-secondary">
    <span className="truncate">{link(estado.slug)}</span>
    {estado.estado === "revisando" ? <span className="flex items-center gap-2"><LoaderCircle aria-hidden className="size-4 motion-safe:animate-spin" />Revisando el link.</span>
      : estado.estado === "error" ? <><p className="text-error">No pudimos revisar el link.</p><button type="button" onClick={estado.reintentar} className="link-text min-h-11 self-start">Intentar de nuevo</button></>
      : estado.libre ? <span>Este link está libre.</span> : <><p>Ese link ya está en uso. Puedes usar:</p><span className="truncate font-medium text-fg">{link(estado.sugerencia ?? estado.slug)}</span></>}
  </div>;
}
