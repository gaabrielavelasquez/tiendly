import { buttonVariants } from "@/components/ui";
import { cn } from "@/lib/cn";
import { whatsappCompartir } from "../lib/format";

type CompartirProps = { slug: string; texto?: string; className?: string };

/** Botón secundario que abre wa.me con el link de la tienda. Siempre a mano en Inicio. */
export function CompartirWhatsApp({ slug, texto = "Compartir mi tienda por WhatsApp", className }: CompartirProps) {
  return (
    <a
      href={whatsappCompartir(slug)}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(buttonVariants({ variant: "secondary" }), "transition active:scale-98", className)}
    >
      {/* Icono/whatsapp de Figma (20 × 20, trazo icon/default). */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/icons/whatsapp.svg" alt="" width={20} height={20} />
      <span>{texto}</span>
    </a>
  );
}
