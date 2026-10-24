import { tablaDelProducto } from "@/features/productos/lib/tabla-tallas";
import { obtenerProductos } from "@/features/productos/lib/mock";
import { nivelStock, stockTotal } from "@/features/productos/lib/reglas";
import type { Opcion, Producto, TablaTallas } from "@/features/productos/types";
import { claveVariante, COLOR_UNICO_LEGADO, FOTOS_GENERAL, opcionDeFotos, valorDe } from "@/features/productos/lib/variantes";
import { descuento, estadoOferta, precioVigente } from "@/features/productos/lib/ofertas";
import { hoyLima } from "@/lib/reloj";
import { DETALLE, hexDeColor } from "./contenido";
import { esHeather } from "@/lib/datos/semillas";
import { TIENDAS_EJEMPLO } from "@/lib/datos/tiendas-ejemplo";
import { identidadDe } from "@/features/mi-tienda/lib/datos";
import { datosTienda } from "@/lib/datos/tienda";

// Vitrina pública: lo que ve el cliente. Lee el mismo catálogo que el panel, pero solo lo publicado.

export type ProductoVitrina = {
  id: string;
  slug: string;
  nombre: string;
  precio: number;
  precioAntes?: number;
  /** "−22 %" si la oferta está activa hoy (0034); 0 si no. */
  descuento: number;
  imagen?: string;
  /** Ids de sus categorías (`slugProducto` del texto), para filtrar en la vitrina. */
  categorias: string[];
  agotado: boolean;
  /** Colores en orden, con su muestra (dato del producto). */
  colores: { nombre: string; hex?: string }[];
  stock: number;
};

/** Una variante a la venta: sus valores (uno por opción), su clave (la que va al carrito) y su stock. */
export type VarianteFicha = { valores: string[]; clave: string; stock: number };

/**
 * Lo que agrega la página de producto (opciones genéricas, 0032): un selector por opción, las variantes y las fotos
 * de cada valor de la opción que cambia las fotos (`opcionFotos`, -1 = una sola galería en la clave "").
 */
export type FichaProducto = ProductoVitrina & {
  opciones: Opcion[];
  variantes: VarianteFicha[];
  opcionFotos: number;
  fotos: Record<string, string[]>;
  corto?: string;
  sobre?: string;
  /** Solo si la tienda la cargó en el producto: sin tabla, no hay link "Ver tabla de tallas". */
  tablaTallas?: TablaTallas;
};

/** Id de la sección de ofertas en el menú y en ?categoria= (0034). */
export const OFERTAS = "ofertas";

/** Portada de una sola foto, con su titular y bajada (hoy, la de MUÑA; Mi tienda todavía no la publica). */
export type PortadaPropia = { src: string; alt: string; titulo: string; bajada: string };

/** `demo`: Heather trae su portada, fotos y beneficios; las demás tiendas muestran solo lo que cargaron. */
export type Vitrina = {
  /** `nombreOfertas`: el nombre de la sección de ofertas (Mi tienda; "Ofertas" por defecto). */
  tienda: { nombre: string; slug: string; celular: string; logo?: string; plan: "free" | "pro"; instagram?: string; horario?: string; demo: boolean; portada?: PortadaPropia; nombreOfertas: string };
  productos: ProductoVitrina[];
  /** El menú: la sección de ofertas primero (si hay ofertas hoy), después las categorías. */
  categorias: { id: string; label: string }[];
};

/** La portada de una tienda de ejemplo que existe de verdad (MUÑA, la demo pública): la misma de la vista previa del registro. */
const portadaDe = (slug: string): PortadaPropia | undefined => TIENDAS_EJEMPLO.find((t) => t.slug === slug)?.portada;

/** "Vestido Chloé" → "vestido-chloe" (para el link del producto). */
export const slugProducto = (nombre: string) =>
  nombre.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/** Las fotos de Pexels venían en 160 × 160 para el panel; la vitrina las pide en 4:5. Las locales pasan igual. */
const fotoVitrina = (url?: string) => url?.replace(/w=\d+&h=\d+/, "w=640&h=800");

/** `hoy` (Lima): la oferta se calcula al pedir la página (0034). Fuera de fechas, precio normal y sin tachado. */
const aVitrina = (p: Producto, hoy: string): ProductoVitrina => ({
  id: p.id,
  slug: slugProducto(p.nombre),
  nombre: p.nombre,
  precio: precioVigente(p, hoy),
  precioAntes: estadoOferta(p, hoy) === "activa" ? p.precioAntes : undefined,
  descuento: estadoOferta(p, hoy) === "activa" ? descuento(p.precio, p.precioAntes) : 0,
  imagen: fotoVitrina(p.imagen),
  categorias: p.categorias.map(slugProducto),
  agotado: nivelStock(p) === "agotado",
  colores: [...new Set(p.variantes.map((v) => valorDe(p, v, "color") ?? COLOR_UNICO_LEGADO))].map((nombre) => ({ nombre, hex: hexDeColor(nombre) })),
  stock: stockTotal(p),
});

function aFicha(p: Producto, hoy: string): FichaProducto {
  const iFotos = opcionDeFotos(p);
  const claves = iFotos < 0 ? [FOTOS_GENERAL] : p.opciones[iFotos].valores;
  const fotos = Object.fromEntries(claves.map((k) => [k, (p.fotos?.[k] ?? p.fotos?.[FOTOS_GENERAL] ?? (p.imagen ? [p.imagen] : [])).map((u) => fotoVitrina(u)!)]));
  return {
    ...aVitrina(p, hoy),
    opciones: p.opciones,
    variantes: p.variantes.map((v) => ({ valores: v.valores, clave: claveVariante(v.valores), stock: v.stock })),
    opcionFotos: iFotos,
    fotos,
    corto: DETALLE[p.id]?.corto,
    sobre: p.descripcion ?? DETALLE[p.id]?.sobre,
    tablaTallas: tablaDelProducto(p),
  };
}

/**
 * Página de producto: la ficha y 4 relacionados (primero de la misma categoría, sin agotados).
 * `null` si la tienda o el producto no existen, o si el producto no está publicado.
 */
export async function obtenerFicha(tienda: string, slug: string) {
  const hoy = hoyLima();
  const d = await datosTienda(tienda);
  if (!d) return null;
  const activos = (await obtenerProductos("catalogo", tienda)).filter((p) => p.estado === "activo");
  const p = activos.find((x) => slugProducto(x.nombre) === slug);
  if (!p) return null;
  const otros = activos.filter((x) => x.id !== p.id && nivelStock(x) !== "agotado");
  const misma = otros.filter((x) => x.categorias.some((c) => p.categorias.includes(c)));
  const relacionados = [...misma, ...otros.filter((x) => !misma.includes(x))].slice(0, 4).map((x) => aVitrina(x, hoy));
  // WhatsApp de ventas: un solo dato, se edita en Mi tienda › Contacto (lo usan la vitrina, Pagos y el checkout).
  return { tienda: { nombre: d.tienda.nombre, slug: tienda, celular: d.config.pagos.whatsapp.celular, demo: esHeather(tienda) }, ficha: aFicha(p, hoy), relacionados };
}

/**
 * Datos de la vitrina de una tienda. `null` si la tienda no existe (404).
 * Solo productos activos: los pausados no se publican. Los agotados se muestran
 * (con su etiqueta) al final, para que la tienda no se vea vacía y el cliente sepa que vuelven.
 */
export async function obtenerVitrina(slug: string): Promise<Vitrina | null> {
  const hoy = hoyLima();
  const d = await datosTienda(slug);
  if (!d) return null;
  const activos = (await obtenerProductos("catalogo", slug)).filter((p) => p.estado === "activo");
  const productos = activos
    .map((p) => aVitrina(p, hoy))
    .sort((a, b) => Number(a.agotado) - Number(b.agotado));
  // Las categorías de la tienda, en el orden en que aparecen en su catálogo (texto libre, decisión 0032).
  const textos = [...new Set(activos.flatMap((p) => p.categorias))];
  const cats = [...new Map(textos.map((label) => [slugProducto(label), { id: slugProducto(label), label }])).values()];
  const { nombre, plan } = d.tienda;
  const identidad = identidadDe(d);
  const { logo, instagram, horario } = identidad;
  const original = portadaDe(slug);
  const portada = identidad.portada || identidad.bienvenida ? { src: identidad.portada, alt: original?.alt ?? `Portada de ${nombre}`, titulo: identidad.bienvenida || nombre, bajada: original?.bajada ?? "Elige lo que te guste y coordina tu pedido por WhatsApp." } : undefined;
  const nombreOfertas = d.tienda.nombreOfertas?.trim() || "Ofertas";
  // La sección de ofertas va primera en el menú, con su nombre, solo si hay ofertas hoy (0034).
  const categorias = productos.some((p) => p.descuento > 0 && !p.agotado) ? [{ id: OFERTAS, label: nombreOfertas }, ...cats] : cats;
  return { tienda: { nombre, slug, celular: d.config.pagos.whatsapp.celular, logo, plan, demo: esHeather(slug) && !d.tienda.apariencia, portada, instagram, horario, nombreOfertas }, productos, categorias };
}

export const leerCategoria = (v: string | string[] | undefined, validas: string[]): string | "todos" => {
  const c = Array.isArray(v) ? v[0] : v;
  return c && validas.includes(c) ? c : "todos";
};
