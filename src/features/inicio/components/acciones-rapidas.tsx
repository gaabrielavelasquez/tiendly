import { NuevoProducto } from "@/components/panel";
import { cn } from "@/lib/cn";
import { CompartirWhatsApp } from "./compartir-whatsapp";

type AccionesRapidasProps = { link: string; className?: string };

/**
 * Acciones globales de Inicio: "Nuevo producto" es la única acción fuerte de la pantalla (CTA cobalto) y
 * compartir es el secundario, con la misma forma y alto (radius/button, 40 px). En móvil van apiladas, el CTA arriba.
 */
export function AccionesRapidas({ link, className }: AccionesRapidasProps) {
  return (
    <div className={cn("flex flex-col-reverse gap-3 lg:flex-row lg:items-center", className)}>
      <CompartirWhatsApp link={link} texto="Compartir por WhatsApp" className="w-full lg:w-auto" />
      <NuevoProducto className="w-full lg:w-auto" />
    </div>
  );
}
