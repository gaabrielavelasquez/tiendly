import { MobileTopbar, Sidebar } from "@/components/panel";
import { tiendaActual } from "@/features/inicio/lib/mock";

/** Panel de la tienda (tema Tiendly, valores de :root). Desktop: barra lateral. Móvil: barra superior con menú. */
export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-page lg:flex">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileTopbar nombreTienda={tiendaActual.nombre} />
        {children}
      </div>
    </div>
  );
}
