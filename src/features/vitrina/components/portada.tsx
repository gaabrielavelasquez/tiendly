import Image from "next/image";
import { PORTADA } from "../lib/contenido";

/**
 * Portada Free (Figma, Home móvil y desktop; decisión 0027): una foto a todo el ancho, sin texto encima,
 * y debajo el titular en serif y la bajada, alineados a la izquierda. La versión con overlay es Pro.
 */
export function Portada() {
  return (
    <section aria-labelledby="portada-titulo">
      <div className="relative aspect-4/5 w-full sm:aspect-video lg:aspect-auto lg:h-115">
        <Image src={PORTADA.foto.src} alt={PORTADA.foto.alt} fill priority sizes="100vw" className="object-cover object-[50%_70%]" />
      </div>
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 pt-6 lg:pt-12">
        <h1 id="portada-titulo" className="max-w-2xl font-display-hero text-h1 leading-tight text-fg lg:text-display">
          {PORTADA.titulo}
        </h1>
        <p className="max-w-2xl text-body text-fg-secondary">{PORTADA.bajada}</p>
      </div>
    </section>
  );
}
