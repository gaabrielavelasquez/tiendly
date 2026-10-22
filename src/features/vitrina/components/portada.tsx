import Image from "next/image";
import { buttonVariants } from "@/components/ui/button-variants";
import { PORTADA } from "../lib/contenido";

/**
 * Portada Free partida (decisión 0028): a la izquierda los zapatos puestos, a la derecha solo los
 * zapatos; cada foto ocupa la mitad del ancho (las de ~950 px se ven nítidas a 1440). Titular y CTA
 * debajo, nunca encima: el texto sobre la foto es el banner Pro (V1.1).
 */
export function Portada() {
  return (
    <section aria-labelledby="portada-titulo">
      <div className="grid grid-cols-2">
        {PORTADA.fotos.map((f, i) => (
          <div key={f.src} className="relative aspect-4/5 lg:aspect-4/3">
            <Image src={f.src} alt={f.alt} fill priority sizes="50vw" className="object-cover" />
          </div>
        ))}
      </div>
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-3 px-4 pt-6 lg:pt-12">
        <h1 id="portada-titulo" className="max-w-2xl font-display-hero text-h1 leading-tight text-fg lg:text-display">
          {PORTADA.titulo}
        </h1>
        <p className="max-w-2xl text-body text-fg-secondary">{PORTADA.bajada}</p>
        <a href="#catalogo" className={`${buttonVariants()} mt-2 h-11 px-6 active:scale-[0.98]`}>
          {PORTADA.cta}
        </a>
      </div>
    </section>
  );
}
