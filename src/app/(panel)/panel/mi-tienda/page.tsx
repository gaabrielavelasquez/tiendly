import { MiTiendaVista } from "@/features/mi-tienda/components/mi-tienda-vista";
import { identidadDe } from "@/features/mi-tienda/lib/datos";
import { productosMuestra } from "@/features/onboarding/lib/productos-muestra";
import { formatoSoles } from "@/lib/formato";
import { datosPanel } from "@/lib/sesion";

export default async function MiTiendaPage({ searchParams }: { searchParams: Promise<{ escenario?: string }> }) {
  const { escenario } = await searchParams;
  const datos = await datosPanel();
  const { tienda, productos, rubros } = datos;
  // La vista previa muestra sus propios productos (los primeros 2 publicados), no los de otra tienda.
  const muestras = productos.filter((p) => p.estado === "activo").slice(0, 2).map((p) => ({ nombre: p.nombre, precio: formatoSoles(p.precio), foto: p.imagen }));
  const demo = process.env.NODE_ENV !== "production" || process.env.VERCEL_ENV === "preview";
  // El WhatsApp de ventas vive en la configuración de la tienda (un solo dato: Pagos y el checkout lo leen de ahí).
  return <MiTiendaVista escenario={demo ? escenario : undefined} inicial={identidadDe(datos)} plan={tienda.plan} tienda={{ nombre: tienda.nombre, slug: tienda.slug, muestras, muestrasTema: muestras.length ? muestras : productosMuestra(rubros).slice(0, 2).map(p => ({ nombre: p.nombre, precio: formatoSoles(p.precio), foto: p.foto })), muestrasEjemplo: !muestras.length, nombreOfertas: tienda.nombreOfertas ?? "", categorias: [...new Set(productos.flatMap((p) => p.categorias))] }} />;
}
