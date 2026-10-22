"use client";

import { Check, Copy } from "lucide-react";
import { Pressable } from "@/components/motion/pressable";
import { Card } from "@/components/ui";
import { cn } from "@/lib/cn";
import { useCopiar } from "../hooks/use-copiar";
import { CompartirWhatsApp } from "./compartir-whatsapp";

const AVISO = { idle: "", copiado: "Link copiado.", error: "No se pudo copiar. Mantén presionado el link para copiarlo." } as const;

/** "El link de tu tienda": copiar y compartir por WhatsApp (tienda nueva). `link`: URL completa. */
export function LinkTiendaCard({ link, className }: { link: string; className?: string }) {
  const { estado, copiar } = useCopiar();
  const Icono = estado === "copiado" ? Check : Copy;

  return (
    <Card as="section" aria-labelledby="link-titulo" className={cn("flex flex-col gap-3", className)}>
      <h2 id="link-titulo" className="text-label font-bold uppercase tracking-widest text-fg-secondary">
        El link de tu tienda
      </h2>
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <p className="min-w-0 flex-1 truncate text-body font-bold text-fg">{link.replace(/^https?:\/\//, "")}</p>
          <Pressable
            type="button"
            aria-label="Copiar link"
            onClick={() => copiar(link)}
            className="flex size-12 shrink-0 items-center justify-center rounded-button text-icon transition-colors hover:bg-sunken"
          >
            <Icono aria-hidden strokeWidth={1.6} className={cn("size-6", estado === "copiado" && "text-success")} />
          </Pressable>
        </div>
        <p role="status" className={cn("text-caption", estado === "error" ? "text-error" : "text-success")}>
          {AVISO[estado]}
        </p>
      </div>
      <CompartirWhatsApp link={link} texto="Compartir por WhatsApp" className="w-full" />
    </Card>
  );
}
