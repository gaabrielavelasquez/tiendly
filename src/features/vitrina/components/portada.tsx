import Image from "next/image";
import { buttonVariants } from "@/components/ui/button-variants";
import { PORTADA } from "../lib/contenido";

/**
 * Portada Free partida (decisión 0028): a la izquierda los zapatos puestos, a la derecha solo los
 * zapatos; cada foto ocupa la mitad del ancho (las de ~950 px se ven nítidas a 1440). Titular y CTA
 * debajo, nunca encima: el texto sobre la foto es el banner Pro (V1.1).
 */
export function Portada({ nombre, demo }: { nombre: string; demo: boolean }) {
  // Una tienda nueva todavía no tiene fotos de portada ni textos propios (Mi tienda aún no los publica):
  // su nombre y una bajada neutra, sin las fotos de Heather.
  const textos = demo ? PORTADA : { ...PORTADA, fotos: [], titulo: nombre, bajada: "Elige lo que te guste y coordina tu pedido por WhatsApp." };
  return (
    <section aria-labelledby="portada-titulo">
      <div className="grid grid-cols-2">
        {textos.fotos.map((f, i) => (
          <div key={f.src} className="relative aspect-4/5 lg:aspect-4/3">
            <Image src={f.src} alt={f.alt} fill priority sizes="50vw" className="object-cover" />
          </div>
        ))}
      </div>
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-3 px-4 pt-6 lg:pt-12">
        <h1 id="portada-titulo" className="max-w-2xl font-display-hero text-h1 leading-tight text-fg lg:text-display">
          {textos.titulo}
        </h1>
        <p className="max-w-2xl text-body text-fg-secondary">{textos.bajada}</p>
        <a href="#catalogo" className={`${buttonVariants()} mt-2 h-11 px-6 active:scale-[0.98]`}>
          {textos.cta}
        </a>
      </div>
    </section>
  );
}
