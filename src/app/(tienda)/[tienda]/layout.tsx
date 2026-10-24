import { estiloAcento } from "@/features/mi-tienda/lib/config";
import { ProveedorCarrito } from "@/features/checkout/components/carrito/proveedor-carrito";
import { obtenerCompra } from "@/features/checkout/lib/catalogo";
import { datosTienda } from "@/lib/datos/tienda";
import { identidadDe } from "@/features/mi-tienda/lib/datos";

type Tema = "neutral" | "editorial" | "suave" | "custom";

/**
 * Vitrina: cada tienda aplica su tema con data-theme (colección Brand). Neutral: decisión 0025. El drawer del carrito
 * (0036) vive aquí, para abrirse desde cualquier página de la tienda; si la tienda no existe, la página da el 404.
 */
export default async function TiendaLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ tienda: string }>;
}) {
  const { tienda } = await params;
  const datos = await datosTienda(tienda);
  const identidad = datos ? identidadDe(datos) : null;
  const tema: Tema = identidad?.tema ?? "neutral";
  const compra = await obtenerCompra(tienda).catch(() => null);
  return (
    <div data-theme={tema} style={estiloAcento(identidad?.acento ?? "tema")} className="min-h-dvh bg-page">
      {compra ? <ProveedorCarrito datos={compra}>{children}</ProveedorCarrito> : children}
    </div>
  );
}
