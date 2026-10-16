import { ZonaUsuario } from "@/components/panel";
import { avisosSinLeer } from "../lib/mock";

type EncabezadoProps = { titulo: string; subtitulo: string; duena: string; accion?: React.ReactNode };

/**
 * Cabecera de Inicio. En desktop, saludo, acciones y zona de cuenta comparten un mismo eje
 * horizontal (items-center en una sola fila). En móvil la zona de cuenta vive en la barra superior.
 */
export function Encabezado({ titulo, subtitulo, duena, accion }: EncabezadoProps) {
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
        <ZonaUsuario nombre={duena} avisos={avisosSinLeer} />
      </div>
    </header>
  );
}
