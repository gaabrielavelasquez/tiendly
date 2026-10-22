import { connection } from "next/server";
import { MobileTopbar, SesionPanel, Sidebar, TabBar } from "@/components/panel";
import { tiendaActual } from "@/lib/sesion";

/**
 * Panel de la tienda (tema Tiendly, valores de :root). Desktop: barra lateral; la zona de cuenta va en la
 * cabecera de cada página, alineada con el saludo. Móvil: barra superior con la cuenta y barra inferior con la navegación (decisión 0029).
 * Se arma en cada pedido: la tienda de la sesión puede cambiar (onboarding), así que ninguna página del panel se prerenderiza.
 */
export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  await connection();
  return (
    <SesionPanel duena={tiendaActual.duena}>
      <div className="min-h-dvh bg-page lg:flex">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <MobileTopbar nombreTienda={tiendaActual.nombre} duena={tiendaActual.duena} />
          {children}
          <TabBar />
        </div>
      </div>
    </SesionPanel>
  );
}
