import { NuevoProducto } from "@/components/panel";
import { cn } from "@/lib/cn";
import { CompartirWhatsApp } from "./compartir-whatsapp";

type AccionesRapidasProps = { slug: string; className?: string };

/**
 * Acciones globales de Inicio: compartir (secundario) y "Nuevo producto" (primario, el único CTA
 * de la vista, con el degradado cobalto). En móvil van apiladas, el primario arriba.
 */
export function AccionesRapidas({ slug, className }: AccionesRapidasProps) {
  return (
    <div className={cn("flex flex-col-reverse gap-2 lg:flex-row lg:items-center", className)}>
      <CompartirWhatsApp slug={slug} className="w-full lg:w-auto" />
      <NuevoProducto className="w-full lg:w-auto" />
    </div>
  );
}
