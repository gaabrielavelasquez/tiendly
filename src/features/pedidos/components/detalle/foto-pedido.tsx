"use client";

import { useState } from "react";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import { cn } from "@/lib/cn";

/** El icono está desde el SSR: la foto solo se hace visible después de cargar correctamente. */
export function FotoPedido({ src }: { src?: string }) {
  const [cargada, setCargada] = useState<string>();
  const [fallida, setFallida] = useState<string>();
  return (
    <span aria-hidden className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-theme bg-sunken">
      <ShoppingBag strokeWidth={1.5} className="size-5 text-icon-subtle" />
      {src && src !== fallida && <Image src={src} alt="" fill sizes="48px" className={cn("object-cover", cargada === src ? "opacity-100" : "opacity-0")}
        onLoad={() => setCargada(src)} onError={() => setFallida(src)} />}
    </span>
  );
}
