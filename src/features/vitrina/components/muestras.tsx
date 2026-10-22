/**
 * Muestras de color chiquitas debajo del precio. El color es un DATO del producto (lo elige la
 * tienda), por eso va en style; el filo de 1 px separa los colores claros del fondo.
 */
export function Muestras({ colores }: { colores: { nombre: string; hex?: string }[] }) {
  return (
    <span className="flex items-center gap-1" aria-label={`Colores: ${colores.map((c) => c.nombre).join(", ")}`}>
      {colores.map((c) => (
        <span key={c.nombre} aria-hidden className="size-2.5 rounded-full ring-1 ring-fg/15 ring-inset" style={{ backgroundColor: c.hex }} />
      ))}
    </span>
  );
}
