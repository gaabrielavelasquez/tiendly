import { TiendasEjemplo } from "./tiendas-ejemplo";
import { Wordmark } from "./wordmark";

// Máximo 3, en texto plano (decisión 0031: sin íconos en círculos). "Gratis" y "Sin tarjeta" ya están en el titular.
// Multirubro (0032): "productos con sus opciones", no "modelos con tallas y colores".
const BENEFICIOS = ["Pedidos directo a tu WhatsApp.", "Cobra con tarjeta y Yape cuando quieras.", "Tus productos con sus opciones, en un solo link."];

type ShellRegistroProps = { linksEjemplo: string[]; children: React.ReactNode };

/**
 * Registro (O1 / OD1), pase de diseño sobre 0031. Móvil: una columna sobre el lienzo, sin halo de fondo.
 * Desktop: a la izquierda la vista previa de tres tiendas de ejemplo es la protagonista (halo solo detrás de ella);
 * a la derecha, el formulario directo sobre blanco, sin tarjeta.
 */
export function ShellRegistro({ linksEjemplo, children }: ShellRegistroProps) {
  return (
    <div className="min-h-dvh bg-page lg:grid lg:grid-cols-[5fr_4fr]">
      <aside className="hidden flex-col bg-sunken px-16 py-10 lg:flex">
        <Wordmark />
        <div className="flex flex-1 flex-col items-center justify-center py-6">
          {/* Ancho atado al alto de la pantalla (la tarjeta crece con el ancho): vista previa y beneficios entran sin scroll
              desde 1280 × 720; 1440 × 900 incluido. Tope: 32rem. */}
          <div className="flex w-full max-w-[min(var(--container-lg),calc(100dvh_-_var(--spacing)*126))] flex-col gap-6">
            <TiendasEjemplo links={linksEjemplo} />
            {/* Legibles en desktop: tamaño de cuerpo y color primario (antes, chicos y en gris). */}
            <ul className="flex flex-col gap-2.5 text-body text-fg">
              {BENEFICIOS.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>
        </div>
      </aside>
      <main className="flex min-h-dvh flex-col px-6 py-6 lg:justify-center lg:bg-surface lg:px-16 lg:py-12">
        <div className="flex w-full flex-1 flex-col lg:mx-auto lg:max-w-100 lg:flex-none">{children}</div>
      </main>
    </div>
  );
}
