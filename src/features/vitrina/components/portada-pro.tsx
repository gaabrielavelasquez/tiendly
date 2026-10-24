import Image from "next/image";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/cn";
import type { PortadaPropia } from "../lib/vitrina";
import { PORTADA_PRO as PORTADA } from "../lib/contenido";

/**
 * Portada Pro (V1.1, DESIGN.md §5 "Banner de alto impacto"): fotos de campaña a todo el ancho (una en
 * móvil, dos en desktop) con el titular en serif encima y CTA. Las tiendas Free usan `Portada` (decisión 0027). El velo oscuro sube solo desde abajo, donde va el texto: el resto de la foto queda limpia.
 */
export function PortadaPro({ propia }: { propia?: PortadaPropia }) {
  const contenido = propia ? { ...PORTADA, fotos: [propia], titulo: propia.titulo, bajada: propia.bajada, temporada: "" } : PORTADA;
  return (
    <section aria-labelledby="portada-titulo" className="relative -mx-4 aspect-4/5 overflow-hidden lg:mx-0 lg:aspect-video">
      <div className={cn("absolute inset-0 grid grid-cols-1", contenido.fotos.length > 1 && "lg:grid-cols-2")}>
        {contenido.fotos.map((f, i) => (
          <div key={f.src} className={cn("relative", i > 0 && "hidden lg:block")}>
            <Image src={f.src} alt={f.alt} fill priority sizes="(min-width: 64rem) 36rem, 100vw" className="object-cover" />
          </div>
        ))}
      </div>
      {/* Velo medido (WCAG): la etiqueta de 12 px llega a ≥ 5.6:1 a 390 y 1440 px, y el 15 % de arriba queda sin velo. */}
      <div aria-hidden className="absolute inset-0 bg-linear-to-t from-inverse/85 via-inverse/62 via-55% to-transparent to-85%" />
      <div className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-4 p-6 text-fg-inverse lg:p-12">
        {contenido.temporada && <p className="text-label font-semibold tracking-widest uppercase">{contenido.temporada}</p>}
        <h1 id="portada-titulo" className="font-display-hero text-display leading-none">
          {contenido.titulo}
        </h1>
        <p className="max-w-md text-body opacity-90">{contenido.bajada}</p>
        <a href="#catalogo" className={cn(buttonVariants({ variant: "secondary" }), "mt-2 h-11 border-transparent px-6 duration-150 ease-out active:scale-[0.98]")}>
          {contenido.cta}
        </a>
      </div>
    </section>
  );
}
