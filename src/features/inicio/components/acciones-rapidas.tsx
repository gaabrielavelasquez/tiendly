import { Plus } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui";
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
      <CompartirWhatsApp slug={slug} className="h-12 w-full lg:w-auto" />
      <Link
        href="/panel/productos/nuevo"
        className={cn(buttonVariants({ variant: "primary" }), "w-full transition hover:bg-cta-hover active:scale-98 lg:w-auto")}
      >
        <Plus aria-hidden strokeWidth={2} className="size-5" />
        <span>Nuevo producto</span>
      </Link>
    </div>
  );
}
