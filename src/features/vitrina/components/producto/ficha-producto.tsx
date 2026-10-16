"use client";

import { ShoppingBag } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { Badge, Button, buttonVariants } from "@/components/ui";
import { formatoSoles } from "@/lib/formato";
import { cn } from "@/lib/cn";
import { agregarAlCarrito } from "../../lib/carrito";
import type { FichaProducto as Ficha } from "../../lib/vitrina";
import { Beneficios } from "./beneficios";
import { SelectorColor, SelectorTalla } from "./selectores";

type FichaProps = { p: Ficha; tienda: string; celular: string };

/** Página de producto (Figma): galería a la izquierda y compra a la derecha (apiladas en móvil). */
export function FichaProducto({ p, tienda, celular }: FichaProps) {
  const stock = (c: string, t: string) => p.variantes.find((v) => v.color === c && v.talla === t)?.stock ?? 0;
  const conStock = p.colores.find((c) => p.tallas.some((t) => stock(c.nombre, t) > 0));
  const [color, setColor] = useState((conStock ?? p.colores[0]).nombre);
  const unica = p.tallas.length === 1 && p.tallas[0] === "Única";
  const [talla, setTalla] = useState<string | null>(unica ? "Única" : null);
  const [error, setError] = useState("");
  const [agregado, setAgregado] = useState(false);

  const agotadas = useMemo(() => new Set(p.tallas.filter((t) => stock(color, t) === 0)), [color, p.tallas]); // eslint-disable-line react-hooks/exhaustive-deps
  const quedan = talla ? stock(color, talla) : p.tallas.reduce((s, t) => s + stock(color, t), 0);

  function cambiarColor(c: string) {
    setColor(c);
    if (talla && !unica && stock(c, talla) === 0) setTalla(null); // la talla elegida no existe en ese color
  }

  function agregar() {
    if (!talla) {
      setError("Elige tu talla.");
      document.getElementById("primera-talla")?.focus();
      return;
    }
    agregarAlCarrito(tienda, { id: p.id, color, talla });
    setError("");
    setAgregado(true);
  }

  const mensaje = `Hola, quiero ${p.nombre} en ${color}${talla && !unica ? `, talla ${talla}` : ""}. ¿Está disponible?`;

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
      <div className="relative aspect-4/5 overflow-hidden rounded-card border border-line-subtle bg-surface lg:sticky lg:top-24 lg:self-start">
        {p.imagen && <Image src={p.imagen} alt={p.nombre} fill priority sizes="(min-width: 64rem) 50vw, 100vw" className="object-cover" />}
      </div>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          {p.agotado ? (
            <Badge className="w-fit tracking-wider uppercase">Agotado</Badge>
          ) : (
            quedan > 0 && quedan <= 5 && <Badge tone="warning" className="w-fit tracking-wider uppercase">{quedan === 1 ? "Última unidad" : `Últimas ${quedan} unidades`}</Badge>
          )}
          <h1 className="font-display-hero text-h1 text-fg">{p.nombre}</h1>
          <p className="flex items-baseline gap-2 tabular-nums">
            <span className="text-body-lg font-semibold text-fg">{formatoSoles(p.precio)}</span>
            {p.precioAntes && <span className="text-body-sm text-fg-tertiary line-through"><span className="sr-only">Antes: </span>{formatoSoles(p.precioAntes)}</span>}
          </p>
          {p.corto && <p className="text-body-sm text-fg-secondary">{p.corto}</p>}
        </div>
        {p.colores.length > 1 && <SelectorColor colores={p.colores} valor={color} onCambio={cambiarColor} />}
        {!unica && <SelectorTalla tallas={p.tallas} valor={talla} agotadas={agotadas} error={error} onCambio={(t) => (setTalla(t), setError(""), setAgregado(false))} />}
        <div className="flex flex-col gap-2">
          <Button block onClick={agregar} disabled={p.agotado}>
            <span className="flex items-center gap-2">
              <ShoppingBag aria-hidden strokeWidth={1.6} className="size-4" />
              {p.agotado ? "Agotado" : "Agregar al carrito"}
            </span>
          </Button>
          <a href={`https://wa.me/51${celular}?text=${encodeURIComponent(mensaje)}`} target="_blank" rel="noopener noreferrer" className={cn(buttonVariants({ variant: "secondary", block: true }), "transition active:scale-98")}>
            {p.agotado ? "Avísame cuando vuelva" : "Consultar por WhatsApp"}
          </a>
          <p role="status" className="min-h-5 text-caption text-success">{agregado ? "Agregado al carrito." : ""}</p>
        </div>
        <Beneficios />
      </div>
    </div>
  );
}
