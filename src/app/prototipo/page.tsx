import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { herramientasDev } from "@/lib/entorno";

// Dinámica: el prototipo solo existe fuera de producción y las ofertas se calculan con la hora de Lima al mostrar.
export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Prototipo · Productos y ofertas · Tiendly" };

const PANTALLAS = [
  ["1 · Formulario: zapatilla con Color + Talla", "/panel/prototipo/producto?ejemplo=zapatilla"],
  ["1 · Formulario: sérum con Tamaño, en oferta", "/panel/prototipo/producto?ejemplo=serum"],
  ["1 · Formulario: vela sin opciones", "/panel/prototipo/producto?ejemplo=vela"],
  ["2 · Productos: filtro En oferta y Poner en oferta", "/panel/prototipo/productos"],
  ["3 · Mi tienda: nombre de la sección de ofertas", "/panel/prototipo/mi-tienda"],
  ["3 · Tienda: sección de ofertas y link en el menú", "/prototipo/tienda"],
  ["3 · Tienda: la sección desde el menú", "/prototipo/tienda?categoria=ofertas"],
  ["3 · Tienda: producto en oferta", "/prototipo/tienda/serum-calma"],
] as const;

/** PROTOTIPO (PR 3 + 0034): índice de pantallas. Solo en local y previews de Vercel. */
export default function Prototipo() {
  if (!herramientasDev) notFound();
  return (
    <main className="mx-auto flex min-h-dvh max-w-lg flex-col gap-6 bg-page px-4 py-10">
      <div className="flex flex-col gap-1">
        <h1 className="font-display-light text-h1 tracking-tight text-fg">Productos y ofertas</h1>
        <p className="text-body text-fg-secondary">Propuesta para el PR 3 y la decisión 0034. Los datos no se guardan.</p>
      </div>
      <ul className="flex flex-col divide-y divide-line-subtle rounded-card bg-surface shadow-contenedor">
        {PANTALLAS.map(([t, href]) => (
          <li key={href}><Link href={href} className="flex min-h-12 items-center px-5 text-body-sm text-fg hover:bg-sunken">{t}</Link></li>
        ))}
      </ul>
    </main>
  );
}
