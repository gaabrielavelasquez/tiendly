import Image from "next/image";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/cn";
import { PORTADA } from "../lib/contenido";

/**
 * Portada editorial: fotos de campaña a todo el ancho (una en móvil, dos en desktop) con el titular
 * en serif encima. El velo oscuro sube solo desde abajo, donde va el texto: el resto de la foto queda limpia.
 */
export function Portada() {
  return (
    <section aria-labelledby="portada-titulo" className="relative -mx-4 aspect-4/5 overflow-hidden lg:mx-0 lg:aspect-video">
      <div className="absolute inset-0 grid grid-cols-1 lg:grid-cols-2">
        {PORTADA.fotos.map((f, i) => (
          <div key={f.src} className={cn("relative", i > 0 && "hidden lg:block")}>
            <Image src={f.src} alt={f.alt} fill priority sizes="(min-width: 64rem) 36rem, 100vw" className="object-cover" />
          </div>
        ))}
      </div>
      <div aria-hidden className="absolute inset-0 bg-linear-to-t from-inverse/85 via-inverse/45 via-50% to-transparent" />
      <div className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-4 p-6 text-fg-inverse lg:p-12">
        <p className="text-label font-semibold tracking-widest uppercase">{PORTADA.temporada}</p>
        <h1 id="portada-titulo" className="font-display-hero text-display leading-none">
          {PORTADA.titulo}
        </h1>
        <p className="max-w-md text-body opacity-90">{PORTADA.bajada}</p>
        <a href="#catalogo" className={cn(buttonVariants({ variant: "secondary" }), "mt-2 h-11 border-transparent px-6 duration-150 ease-out active:scale-[0.98]")}>
          {PORTADA.cta}
        </a>
      </div>
    </section>
  );
}
