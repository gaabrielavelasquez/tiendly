import { ProveedorCarrito } from "@/features/checkout/components/carrito/proveedor-carrito";
import { obtenerCompra } from "@/features/checkout/lib/catalogo";
import { TIENDAS_EJEMPLO } from "@/lib/datos/tiendas-ejemplo";

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
  // TODO: leer el tema de la tienda. Heather usa Editorial, como en Figma; MUÑA (demo), el de su vista previa; las demás, Neutral (0025).
  const ejemplo = TIENDAS_EJEMPLO.find((t) => t.slug === tienda)?.tema;
  const tema: Tema = ejemplo ?? (tienda === "heather" || tienda === "demo" ? "editorial" : "neutral");
  const compra = await obtenerCompra(tienda).catch(() => null);
  return (
    <div data-theme={tema} className="min-h-dvh bg-page">
      {compra ? <ProveedorCarrito datos={compra}>{children}</ProveedorCarrito> : children}
    </div>
  );
}
