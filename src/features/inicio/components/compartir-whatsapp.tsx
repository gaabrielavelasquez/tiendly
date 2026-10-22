"use client";

import { useRouter } from "next/navigation";
import { buttonVariants } from "@/components/ui";
import { cn } from "@/lib/cn";
import { marcarCompartido } from "../lib/acciones";
import { whatsappCompartir } from "../lib/format";

type CompartirProps = { link: string; texto?: string; variante?: "secondary" | "quiet"; className?: string };

/** Botón que abre wa.me con el link de la tienda. Siempre a mano en Inicio: silencioso en la cabecera (0031), secundario en la tienda nueva. */
export function CompartirWhatsApp({ link, texto = "Compartir mi tienda por WhatsApp", variante = "secondary", className }: CompartirProps) {
  const router = useRouter();
  return (
    <a
      href={whatsappCompartir(link)}
      onClick={() => void marcarCompartido().then(() => router.refresh())}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(buttonVariants({ variant: variante }), "transition active:scale-98", className)}
    >
      {/* Icono/whatsapp de Figma (20 × 20, trazo icon/default). */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/icons/whatsapp.svg" alt="" width={20} height={20} />
      <span>{texto}</span>
    </a>
  );
}
