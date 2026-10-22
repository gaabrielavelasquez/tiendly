type EncabezadoSeccionProps = { id: string; titulo: string; accion?: React.ReactNode };

/**
 * Encabezado de sección (decisión 0031): título a la izquierda y acciones silenciosas a la derecha
 * (botón `quiet`, píldora neutra). La acción fuerte de la pantalla nunca va aquí.
 */
export function EncabezadoSeccion({ id, titulo, accion }: EncabezadoSeccionProps) {
  return (
    <div className="flex min-h-9 items-center justify-between gap-4">
      <h2 id={id} className="encabezado-seccion text-fg">
        {titulo}
      </h2>
      {accion && <div className="flex shrink-0 items-center gap-2">{accion}</div>}
    </div>
  );
}
