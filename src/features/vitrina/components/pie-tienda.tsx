import Link from "next/link";

/** Pie mínimo con el crédito "Hecho con tiendly" (en el cobalto de Tiendly, que no cambia con el tema de la tienda; el plan Pro lo puede quitar). */
export function PieTienda({ nombre }: { nombre: string }) {
  return (
    <footer className="border-t border-line-subtle px-4 py-6 text-center text-caption text-fg-secondary">
      © {nombre} ·{" "}
      <Link href="/" className="font-display-title text-tiendly hover:underline">
        Hecho con tiendly
      </Link>
    </footer>
  );
}
