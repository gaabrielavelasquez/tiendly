import { ZonaUsuario } from "./zona-usuario";

type PanelHeaderProps = { titulo: string; subtitulo: string; accion?: React.ReactNode };

/**
 * Cabecera de cada página del panel. En desktop, título, acciones y zona de cuenta comparten un
 * mismo eje horizontal (una sola fila, items-center). En móvil la zona de cuenta vive en la barra superior.
 */
export function PanelHeader({ titulo, subtitulo, accion }: PanelHeaderProps) {
  return (
    <header className="flex items-center gap-4 lg:gap-6">
      <div className="flex flex-1 flex-col gap-1">
        <h1 className="font-display-title text-h1 tracking-tight text-fg lg:font-display-hero">{titulo}</h1>
        <p className="text-body text-fg-secondary">{subtitulo}</p>
      </div>
      <div className="hidden items-center gap-4 lg:flex">
        {accion && (
          <>
            {accion}
            <span aria-hidden className="h-6 w-px bg-line-subtle" />
          </>
        )}
        <ZonaUsuario />
      </div>
    </header>
  );
}
