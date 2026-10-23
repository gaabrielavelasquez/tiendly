"use client";

import { Check, ShoppingBag } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Badge, Button, buttonVariants } from "@/components/ui";
import { detalleVariante, textoVarianteLargo } from "@/features/productos/lib/variantes";
import { cn } from "@/lib/cn";
import { agregarAlCarrito } from "../../lib/carrito";
import type { FichaProducto as Ficha } from "../../lib/vitrina";
import { useEleccion } from "../../hooks/use-eleccion";
import { PrecioTienda } from "../precio-tienda";
import { Beneficios } from "./beneficios";
import { Galeria } from "./galeria";
import { HojaAgregado } from "./hoja-agregado";
import { SelectorOpcion } from "./selector-opcion";

/** `demo`: los beneficios (envío, pago, cambios) son textos de Heather; una tienda nueva no los promete. */
type FichaProps = { p: Ficha; tienda: string; celular: string; demo: boolean };

/** "una talla", "un tono", "un aroma": el artículo según el nombre de la opción (las sugeridas, a mano; el resto, por la terminación). */
const MASCULINAS = new Set(["color", "tono", "tamaño", "aroma", "material", "sabor", "modelo", "diseño"]);
const unaOpcion = (nombre: string) => {
  const n = nombre.trim().toLowerCase();
  return `${!MASCULINAS.has(n) && /a$/.test(n) ? "una" : "un"} ${n}`;
};

/**
 * Página de producto (Figma): galería a la izquierda y compra a la derecha desde tablet (768 px); apiladas en el celular. Un selector por opción
 * (0032), el precio con su oferta (0034, sin fechas) y las fotos de la opción que las cambia. Al agregar: el botón
 * dice "Agregado" un momento (y no suma de nuevo), el carrito de la cabecera salta y se abre la hoja con lo agregado.
 */
export function FichaProducto({ p, tienda, celular, demo }: FichaProps) {
  const e = useEleccion(p);
  const [error, setError] = useState<{ i: number; texto: string } | null>(null);
  /** `listo`: el botón dice "Agregado" (1,5 s, sin volver a sumar). `hoja`: la hoja con lo agregado está abierta. */
  const [listo, setListo] = useState(false);
  const [hoja, setHoja] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const elegidosTexto = e.elegidos.filter((x, i) => x && p.opciones[i].valores.length > 1).join(" · ");

  function agregar() {
    if (listo) return; // evita sumar dos veces con un doble toque
    const falta = e.elegidos.findIndex((x) => x === null);
    if (falta >= 0) {
      setError({ i: falta, texto: `Elige ${unaOpcion(p.opciones[falta].nombre)}.` });
      document.getElementById(`opcion-${falta}`)?.focus();
      return;
    }
    if (!e.variante) return;
    agregarAlCarrito(tienda, { id: p.id, variante: e.variante.clave });
    setError(null);
    setListo(true);
    setHoja(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setListo(false), 1500);
  }
  // Al cerrar la hoja, el foco vuelve al botón que la abrió.
  const cerrarHoja = useCallback(() => (setHoja(false), document.getElementById("agregar-carrito")?.focus()), []);

  const mensaje = `Hola, quiero ${p.nombre}${elegidosTexto ? ` (${elegidosTexto})` : ""}. ¿Está disponible?`;

  return (
    <div className="grid gap-8 md:grid-cols-2 md:gap-10 lg:gap-14">
      <Galeria key={e.claveFotos} fotos={e.fotos} nombre={p.nombre} color={e.claveFotos} />
      <div className="flex min-w-0 flex-col gap-6">
        <div className="flex flex-col gap-2">
          {p.agotado ? (
            <Badge className="w-fit tracking-wider uppercase">Agotado</Badge>
          ) : (
            e.quedan > 0 && e.quedan <= 5 && <Badge tone="warning" className="w-fit tracking-wider uppercase">{e.quedan === 1 ? "Última unidad" : `Últimas ${e.quedan} unidades`}</Badge>
          )}
          <h1 className="font-display-hero text-h1 text-fg">{p.nombre}</h1>
          <PrecioTienda precio={p.precio} precioAntes={p.precioAntes} descuento={p.descuento} tamano="ficha" />
          {p.corto && <p className="text-body-sm text-fg-secondary">{p.corto}</p>}
        </div>
        {p.opciones.map((o, i) =>
          o.valores.length > 1 ? (
            <SelectorOpcion key={o.nombre} opcion={o} i={i} valor={e.elegidos[i]} agotados={e.agotados[i]} error={error?.i === i ? error.texto : undefined}
              onCambio={(v) => (e.elegir(i, v), setError(null))} />
          ) : null,
        )}
        <div className="flex flex-col gap-2">
          <Button id="agregar-carrito" block onClick={agregar} disabled={p.agotado} aria-disabled={listo || undefined} className={cn(listo && "pointer-events-none")}>
            <span className="flex items-center gap-2">
              {listo ? <Check aria-hidden strokeWidth={2} className="size-4" /> : <ShoppingBag aria-hidden strokeWidth={1.6} className="size-4" />}
              {p.agotado ? "Agotado" : listo ? "Agregado" : "Agregar al carrito"}
            </span>
          </Button>
          <a href={`https://wa.me/51${celular}?text=${encodeURIComponent(mensaje)}`} target="_blank" rel="noopener noreferrer" className={cn(buttonVariants({ variant: "secondary", block: true }), "transition active:scale-98")}>
            {p.agotado ? "Avísame cuando vuelva" : "Consultar por WhatsApp"}
          </a>
        </div>
        {demo && <Beneficios />}
      </div>
      {hoja && (
        <HojaAgregado foto={e.fotos[0]} nombre={p.nombre} variante={e.variante ? textoVarianteLargo(detalleVariante(p.opciones, e.variante.valores)) : ""} precio={p.precio} precioAntes={p.precioAntes} descuento={p.descuento}
          carrito={`/${tienda}/carrito`} onCerrar={cerrarHoja} />
      )}
    </div>
  );
}
