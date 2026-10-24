import Image from "next/image";
import { buttonVariants } from "@/components/ui/button-variants";
import { PORTADA } from "../lib/contenido";
import type { PortadaPropia } from "../lib/vitrina";

type PortadaProps = { nombre: string; demo: boolean; propia?: PortadaPropia };

/**
 * Portada Free partida (decisión 0028): a la izquierda los zapatos puestos, a la derecha solo los
 * zapatos; cada foto ocupa la mitad del ancho (las de ~950 px se ven nítidas a 1440). Titular y CTA
 * debajo, nunca encima: el texto sobre la foto es el banner Pro (V1.1). MUÑA usa una sola foto a todo el ancho.
 */
export function Portada({ nombre, demo, propia }: PortadaProps) {
  // Mi tienda y la vitrina comparten identidad; sin portada no se inventan fotos.
  const neutra = { ...PORTADA, fotos: [], titulo: nombre, bajada: "Elige lo que te guste y coordina tu pedido por WhatsApp.", cta: "Ver productos" };
  const textos = demo ? PORTADA : propia ? { ...neutra, fotos: propia.src ? [propia] : [], titulo: propia.titulo, bajada: propia.bajada } : neutra;
  const unaFoto = textos.fotos.length === 1;
  return (
    <section aria-labelledby="portada-titulo">
      <div className={unaFoto ? "grid" : "grid grid-cols-2"}>
        {textos.fotos.map((f) => (
          <div key={f.src} className={unaFoto ? "relative aspect-4/3 lg:aspect-21/9" : "relative aspect-4/5 lg:aspect-4/3"}>
            <Image src={f.src} alt={f.alt} fill priority sizes={unaFoto ? "100vw" : "50vw"} className="object-cover" />
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
