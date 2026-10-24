import Image from "next/image";
import Link from "next/link";
import type { Categoria } from "@/features/productos/types";

type PieProps = { instagram?: string; horario?: string; nombre: string; logo?: string; slug: string; celular: string; categorias: { id: Categoria; label: string }[] };

/** Iniciales de las dos primeras palabras ("Glow Labo" → "GL"): siempre caben en el círculo. */
const iniciales = (nombre: string) =>
  nombre.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]).join("");

/**
 * Pie (Figma): logo en círculo, links a las categorías y al WhatsApp de la tienda, y el crédito de Tiendly.
 * Sin logo, el círculo lleva las iniciales y el nombre completo va debajo, en varias líneas si hace falta
 * (antes los nombres largos se cortaban dentro del círculo, decisión 0031).
 */
export function PieTienda({ nombre, logo, slug, celular, categorias, instagram, horario }: PieProps) {
  return (
    <footer className="mt-auto flex flex-col items-center gap-5 bg-sunken px-4 py-12 text-center">
      <span className="relative flex size-20 items-center justify-center overflow-hidden rounded-full border border-line-subtle bg-surface font-display-hero text-h3 tracking-wide text-fg uppercase">
        {logo ? <Image src={logo} alt={nombre} fill sizes="5rem" className="object-contain p-1" /> : <span aria-hidden>{iniciales(nombre)}</span>}
      </span>
      {!logo && <p className="max-w-xs font-display-hero text-body tracking-wide text-balance break-words text-fg uppercase">{nombre}</p>}
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
      {instagram && <a href={`https://www.instagram.com/${instagram}/`} target="_blank" rel="noopener noreferrer" className="text-caption text-fg-secondary hover:text-fg">@{instagram}</a>}
      {horario && <p className="max-w-xs break-words text-caption text-fg-secondary">{horario}</p>}
      <Link href="/" className="text-label text-fg-tertiary hover:text-fg-secondary">
        Hecho con Tiendly
      </Link>
    </footer>
  );
}
