type EncabezadoProps = { titulo: string; subtitulo: string; accion?: React.ReactNode };

/** Saludo de Inicio. En desktop, la acción (compartir) va a la derecha. Outfit SemiBold (decisión 0020). */
export function Encabezado({ titulo, subtitulo, accion }: EncabezadoProps) {
  return (
    <header className="flex items-center gap-4">
      <div className="flex flex-1 flex-col gap-2">
        <h1 className="font-display-title text-h1 tracking-tight text-fg lg:font-display-hero">{titulo}</h1>
        <p className="text-body text-fg-secondary">{subtitulo}</p>
      </div>
      {accion && <div className="hidden lg:block">{accion}</div>}
    </header>
  );
}
