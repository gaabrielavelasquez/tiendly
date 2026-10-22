import { ZonaUsuario } from "@/components/panel";

type CabeceraInicioProps = { titulo: React.ReactNode; subtitulo: React.ReactNode; accion?: React.ReactNode };

/**
 * Cabecera de Inicio (decisión 0031, ronda 4): título liviano (Outfit Medium, H1) que puede ir en dos tonos,
 * sobre el lienzo liso (sin halo), y debajo un texto chico (la fecha).
 * Desktop: acciones y zona de cuenta a la derecha, en el mismo eje. Móvil: la cuenta vive en la barra superior.
 */
export function CabeceraInicio({ titulo, subtitulo, accion }: CabeceraInicioProps) {
  return (
    <header className="flex items-end gap-6 pt-4 pb-2 lg:pt-8">
      <div className="flex min-w-0 flex-1 flex-col gap-2 lg:gap-3">
        <h1 className="font-display-light text-h1 tracking-tight text-balance text-fg">{titulo}</h1>
        <p className="text-body-sm text-fg-secondary">{subtitulo}</p>
      </div>
      <div className="hidden items-center gap-4 pb-1 lg:flex">
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
