import { ZonaUsuario } from "./zona-usuario";

type MobileTopbarProps = { nombreTienda: string; duena: string };

/** Barra superior del panel en móvil: nombre de la tienda y cuenta. La navegación va en la barra inferior (0029). */
export function MobileTopbar({ nombreTienda, duena }: MobileTopbarProps) {
  return (
    <header className="flex items-center gap-2 border-b border-line-subtle bg-surface py-2 pr-2 pl-4 lg:hidden">
      <p className="flex-1 truncate text-body font-bold text-fg">{nombreTienda}</p>
      <ZonaUsuario nombre={duena} />
    </header>
  );
}
