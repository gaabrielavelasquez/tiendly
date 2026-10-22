import { ZonaUsuario } from "@/components/panel";

type CabeceraInicioProps = { titulo: string; subtitulo: React.ReactNode; accion?: React.ReactNode };

/**
 * Cabecera protagonista de Inicio (decisión 0031): título grande y liviano (Outfit Medium, Display) sobre un
 * halo cálido de puro CSS (`bg-halo`: glow/warm + glow/sky) que se sale hasta los bordes del lienzo.
 * Desktop: acciones y zona de cuenta a la derecha, en el mismo eje. Móvil: la cuenta vive en la barra superior.
 */
export function CabeceraInicio({ titulo, subtitulo, accion }: CabeceraInicioProps) {
  return (
    <header className="relative isolate flex items-end gap-6 pt-4 pb-2 lg:pt-8">
      <div aria-hidden className="pointer-events-none absolute -inset-x-4 -top-6 -bottom-24 -z-10 bg-halo lg:-inset-x-12 lg:-top-10" />
      <div className="flex min-w-0 flex-1 flex-col gap-2 lg:gap-3">
        <h1 className="font-display-light text-display tracking-tight text-fg">{titulo}</h1>
        <p className="text-body text-fg-secondary lg:text-body-lg">{subtitulo}</p>
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
