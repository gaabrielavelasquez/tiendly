import Image from "next/image";
import Link from "next/link";
import type { Categoria } from "@/features/productos/types";

type PieProps = { nombre: string; logo?: string; slug: string; celular: string; categorias: { id: Categoria; label: string }[] };

/** Pie (Figma): logo en círculo, links a las categorías y al WhatsApp de la tienda, y el crédito de Tiendly. */
export function PieTienda({ nombre, logo, slug, celular, categorias }: PieProps) {
  return (
    <footer className="mt-auto flex flex-col items-center gap-5 bg-sunken px-4 py-12 text-center">
      <span className="relative flex size-20 items-center justify-center overflow-hidden rounded-full border border-line-subtle bg-surface font-display-hero text-body tracking-wide text-fg uppercase">
        {logo ? <Image src={logo} alt={nombre} fill sizes="5rem" className="object-contain p-1" /> : nombre}
      </span>
      <nav aria-label="Pie de página" className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-caption text-fg-secondary">
        {categorias.map((c) => (
          <Link key={c.id} href={`/${slug}?categoria=${c.id}`} className="hover:text-fg">
            {c.label}
          </Link>
        ))}
        <a href={`https://wa.me/51${celular}`} target="_blank" rel="noopener noreferrer" className="hover:text-fg">
          Contacto por WhatsApp
        </a>
      </nav>
      <Link href="/" className="text-label text-fg-tertiary hover:text-fg-secondary">
        Hecho con Tiendly
      </Link>
    </footer>
  );
}
