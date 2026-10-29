/**
 * Muestras de color chiquitas debajo del precio. El color es un DATO del producto (lo elige la
 * tienda), por eso va en style; el filo de 1 px separa los colores claros del fondo.
 */
export function Muestras({ colores }: { colores: { nombre: string; hex?: string }[] }) {
  if (!colores.length || colores.some((c) => !c.hex)) return null;
  return (
    <span role="img" className="flex items-center gap-1.5" aria-label={`Colores: ${colores.map((c) => c.nombre).join(", ")}`}>
      {colores.map((c) => (
        <span key={c.nombre} aria-hidden title={c.nombre} className="size-3.5 rounded-full border border-line-strong" style={{ backgroundColor: c.hex }} />
      ))}
    </span>
  );
}
