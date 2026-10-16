import { MobileTopbar, Sidebar, ZonaUsuario } from "@/components/panel";
import { avisosSinLeer, tiendaActual } from "@/features/inicio/lib/mock";

/**
 * Panel de la tienda (tema Tiendly, valores de :root). Desktop: barra lateral y, arriba a la derecha,
 * la zona de cuenta (avisos + avatar) sobre el lienzo. Móvil: barra superior con menú y la misma zona.
 */
export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-page lg:flex">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileTopbar nombreTienda={tiendaActual.nombre} duena={tiendaActual.duena} avisos={avisosSinLeer} />
        <div className="relative z-10 hidden justify-end px-10 pt-4 lg:flex">
          <ZonaUsuario nombre={tiendaActual.duena} avisos={avisosSinLeer} />
        </div>
        {children}
      </div>
    </div>
  );
}
