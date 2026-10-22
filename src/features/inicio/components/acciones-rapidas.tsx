import { NuevoProducto } from "@/components/panel";
import { cn } from "@/lib/cn";
import { CompartirWhatsApp } from "./compartir-whatsapp";

type AccionesRapidasProps = { link: string; className?: string };

/**
 * Acciones globales de Inicio: compartir (secundario) y "Nuevo producto" (primario, el único CTA
 * de la vista, con el degradado cobalto). En móvil van apiladas, el primario arriba.
 */
export function AccionesRapidas({ link, className }: AccionesRapidasProps) {
  return (
    <div className={cn("flex flex-col-reverse gap-2 lg:flex-row lg:items-center", className)}>
      <CompartirWhatsApp link={link} className="w-full lg:w-auto" />
      <NuevoProducto className="w-full lg:w-auto" />
    </div>
  );
}
