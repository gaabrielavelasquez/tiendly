"use client";

import { useState } from "react";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";

/** Una foto que no carga conserva el espacio y muestra el icono neutro existente. */
export function FotoPedido({ src }: { src?: string }) {
  const [fallo, setFallo] = useState(false);
  return (
    <span aria-hidden className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-theme bg-sunken">
      {src && !fallo ? <Image src={src} alt="" fill sizes="48px" className="object-cover" onError={() => setFallo(true)} /> : <ShoppingBag strokeWidth={1.5} className="size-5 text-icon-subtle" />}
    </span>
  );
}
