"use client";

import { Link2, ShoppingBag } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { cn } from "@/lib/cn";
import { ROTACION_MS, TIENDAS_EJEMPLO, type TiendaEjemplo } from "@/lib/datos/tiendas-ejemplo";
import { formatoSoles } from "@/lib/formato";
import { motionTokens } from "@/styles/tokens";
import { useRotacion } from "../hooks/use-rotacion";

// Fundido suave entre tiendas: más largo que el de los controles (150 ms), porque cambia toda la tarjeta.
const fundido = { duration: 0.6, ease: [...motionTokens.easing] as [number, number, number, number] };

/** `links`: el link de cada tienda con el formato real (TIENDLY_URL_TIENDAS), en el orden de TIENDAS_EJEMPLO. */
type Props = { links: string[] };

/** Cabecera de la tienda: nombre a la izquierda, bolsa a la derecha (como en la vitrina). */
function Cabecera({ t, link }: { t: TiendaEjemplo; link?: string }) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3 lg:px-5">
      <div className="flex min-w-0 flex-col">
        <span className="truncate font-display-title text-body text-fg lg:text-body-lg">{t.nombre}</span>
        {link && <span className="truncate text-caption text-fg-secondary">{link}</span>}
      </div>
      <ShoppingBag aria-hidden strokeWidth={1.5} className="size-5 shrink-0 text-icon" />
    </div>
  );
}

/** Fila de 4 productos (los primeros de la tienda): foto 4:5 con el radio del tema, nombre y precio. */
function Productos({ t, conNombre }: { t: TiendaEjemplo; conNombre: boolean }) {
  return (
    <ul className="grid grid-cols-4 gap-2 lg:gap-3">
      {t.productos.slice(0, 4).map((p) => (
        <li key={p.nombre} className="flex min-w-0 flex-col gap-1.5">
          <div className="relative aspect-4/5 overflow-hidden rounded-theme bg-sunken">
            <Image src={p.foto} alt={p.alt} fill sizes="(min-width: 64rem) 8rem, 25vw" className="object-cover" />
          </div>
          {conNombre && <span className="truncate text-caption text-fg">{p.nombre}</span>}
          <span className="text-caption text-fg-secondary tabular-nums">{formatoSoles(p.precio)}</span>
        </li>
      ))}
    </ul>
  );
}

/** Una tienda con su tema (data-theme: tipografía, radios y acento del tema, sin valores escritos a mano). */
function Tarjeta({ t, link, compacta, prioridad }: { t: TiendaEjemplo; link: string; compacta: boolean; prioridad: boolean }) {
  if (compacta) {
    return (
      <div data-theme={t.tema} className="overflow-hidden rounded-card bg-surface shadow-contenedor">
        <Cabecera t={t} link={link} />
        <div className="px-4 pb-4">
          <Productos t={t} conNombre={false} />
        </div>
      </div>
    );
  }
  return (
    <div data-theme={t.tema} className="overflow-hidden rounded-card bg-surface shadow-capas">
      <Cabecera t={t} />
      <div className="relative aspect-video">
        <Image src={t.portada.src} alt={t.portada.alt} fill priority={prioridad} sizes="32rem" className="object-cover" />
      </div>
      <div className="p-5">
        <Productos t={t} conNombre />
      </div>
      <p className="flex items-center gap-2 border-t border-line-subtle px-5 py-3 text-caption text-fg-secondary">
        <Link2 aria-hidden strokeWidth={1.5} className="size-4 shrink-0 text-icon" />
        <span className="min-w-0 truncate">{link}</span>
      </p>
    </div>
  );
}

/** Un punto por tienda: indica cuál se ve y, al tocarlo, la fija (y la rotación se detiene). */
function Puntos({ actual, elegir }: { actual: number; elegir: (i: number) => void }) {
  return (
    <div className="flex items-center">
      {TIENDAS_EJEMPLO.map((t, i) => (
        <button
          key={t.slug}
          type="button"
          aria-label={`Ver ${t.nombre}`}
          aria-pressed={i === actual}
          onClick={() => elegir(i)}
          className="relative flex size-6 items-center justify-center after:absolute after:-inset-2.5 after:content-['']"
        >
          <span className={cn("size-1.5 rounded-full transition-colors", i === actual ? "bg-indicator" : "bg-line-strong")} />
        </button>
      ))}
    </div>
  );
}

/**
 * Vista previa del registro: tres tiendas de ejemplo de rubros distintos que se turnan con un fundido suave
 * (0032 y 0033). Las tres están montadas y apiladas en la misma celda, así las fotos ya cargaron cuando
 * aparecen; cada una con su alto natural, sin espacio vacío dentro. Con "reducir movimiento", queda fija en la primera. Desktop: protagonista con halo; móvil: compacta.
 */
export function TiendasEjemplo({ links, compacta = false }: Props & { compacta?: boolean }) {
  const { actual, elegir, pausar, reducir } = useRotacion(TIENDAS_EJEMPLO.length, ROTACION_MS);
  return (
    <figure
      // contain-inline-size: el ancho de la figura no depende de su contenido (links o nombres largos);
      // la tarjeta nunca es más ancha que su columna, sea lo que sea que tenga adentro.
      className={cn("relative isolate flex w-full max-w-full min-w-0 flex-col gap-3 contain-inline-size", !compacta && "max-w-lg")}
      onPointerEnter={() => pausar(true)}
      onPointerLeave={() => pausar(false)}
      onFocus={() => pausar(true)}
      onBlur={() => pausar(false)}
    >
      {!compacta && <span aria-hidden className="pointer-events-none absolute -inset-x-12 -top-10 -bottom-16 -z-10 bg-halo-hoy" />}
      <div className="flex items-center justify-between gap-3">
        <figcaption className="text-body-sm text-fg-secondary">Así se verá tu tienda.</figcaption>
        <Puntos actual={actual} elegir={elegir} />
      </div>
      {/* Una columna minmax(0, 1fr): sin esto, la celda crece hasta el ancho del link entero (una URL larga de
          Vercel) y toda la página se desborda en móvil. Lo mismo min-w-0 en cada tarjeta. */}
      <div className="grid grid-cols-1">
        {TIENDAS_EJEMPLO.map((t, i) => (
          <motion.div
            key={t.slug}
            className="min-w-0 self-start [grid-area:1/1]"
            initial={false}
            animate={{ opacity: i === actual ? 1 : 0 }}
            transition={reducir ? { duration: 0 } : fundido}
            aria-hidden={i !== actual}
            inert={i !== actual}
          >
            <Tarjeta t={t} link={links[i] ?? ""} compacta={compacta} prioridad={i === 0} />
          </motion.div>
        ))}
      </div>
    </figure>
  );
}
