import Image from "next/image";
import { PORTADA } from "../lib/contenido";

/**
 * Portada editorial: tríptico de fotos de campaña a todo el ancho (una sola en móvil) y el titular
 * debajo, en serif. El texto va fuera de la foto: así se lee siempre, sin depender de la imagen.
 */
export function Portada() {
  const [principal, ...resto] = PORTADA.fotos;
  return (
    <section aria-labelledby="portada-titulo" className="flex flex-col gap-6">
      <div className="-mx-4 grid grid-cols-1 gap-1 lg:mx-0 lg:grid-cols-3 lg:gap-2">
        {[principal, ...resto].map((f, i) => (
          <div key={f.src} className={i === 0 ? "relative aspect-4/5" : "relative hidden aspect-4/5 lg:block"}>
            <Image src={f.src} alt={f.alt} fill priority={i === 0} sizes="(min-width: 64rem) 33vw, 100vw" className="object-cover" />
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-2 lg:items-center lg:text-center">
        <h1 id="portada-titulo" className="font-display-hero text-display leading-none text-fg">
          {PORTADA.titulo}
        </h1>
        <p className="max-w-xl text-body text-fg-secondary">{PORTADA.bajada}</p>
      </div>
    </section>
  );
}
