import type { Categoria, Opcion, Producto } from "../types";
import { descuento } from "./ofertas";
import { claveVariante, combinaciones, FOTOS_GENERAL, opcionDeFotos, tipoDeNombre } from "./variantes";

// Modelo y reglas del formulario de producto (0032 opciones genéricas, 0034 ofertas). Funciones puras, sin React.

export type ImagenForm = { id: string; url: string; nombre: string };
export type OpcionForm = { nombre: string; valores: string[] };

export type FormProducto = {
  nombre: string;
  descripcion: string;
  /** Soles enteros, tal como se escriben (solo dígitos); se validan y convierten al guardar. */
  precio: string;
  precioAntes: string;
  /** Fechas de la oferta (AAAA-MM-DD) o "". Solo cuentan si hay precio antes. */
  ofertaDesde: string;
  ofertaHasta: string;
  /** Hasta 3. Una opción sin valores no se guarda. */
  opciones: OpcionForm[];
  /** Qué opción cambia las fotos (índice) o -1: las mismas fotos para todo. */
  opcionFotos: number;
  /** Fotos de cada valor de la opción de fotos, por id de imagen (las URL cambian al subirlas). */
  fotosPorValor: Record<string, string[]>;
  /** Cantidad por variante (clave "Blanco|38"; sin opciones, ""), solo dígitos. */
  stock: Record<string, string>;
  estado: "activo" | "pausado";
  categorias: Categoria[];
  imagenes: ImagenForm[];
};

export type Errores = Partial<Record<"nombre" | "precio" | "precioAntes" | "ofertaHasta" | "opciones", string>>;

export const MAXIMO_OPCIONES = 3;
export const OPCIONES_SUGERIDAS = ["Color", "Talla", "Tamaño", "Tono", "Aroma", "Material"];
export const TALLAS_RAPIDAS: Record<string, string[]> = {
  "XS–XXL": ["XS", "S", "M", "L", "XL", "XXL"],
  "35–45": ["35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45"],
};

/** "|" separa los valores en la clave de la variante: no puede ir dentro de un valor. */
export const limpiarValor = (v: string) => v.replace(/\|/g, "/").trim();
const entero = (s: string) => (s.trim() === "" ? NaN : Number(s.replace(/\D/g, "")));

/** Las opciones que se guardan: con nombre y al menos un valor. */
export const opcionesValidas = (f: Pick<FormProducto, "opciones">) => f.opciones.filter((o) => o.nombre.trim() && o.valores.length);
export const variantesDe = (f: Pick<FormProducto, "opciones">) => combinaciones(opcionesValidas(f));
export const stockTotal = (f: FormProducto) => variantesDe(f).reduce((s, v) => s + (Number(f.stock[claveVariante(v)]) || 0), 0);
export const descuentoForm = (f: FormProducto) => descuento(entero(f.precio), entero(f.precioAntes));

/** Por defecto, Color o Tono (0034); sin ellas, ninguna. */
export const fotosPorDefecto = (opciones: OpcionForm[]) => opciones.findIndex((o) => ["color", "tono"].includes(o.nombre.trim().toLowerCase()));

export const formVacio = (): FormProducto => ({
  nombre: "", descripcion: "", precio: "", precioAntes: "", ofertaDesde: "", ofertaHasta: "", opciones: [], opcionFotos: -1,
  fotosPorValor: {}, stock: {}, estado: "activo", categorias: [], imagenes: [], // se publica al guardar (decisión 0028)
});

/** Prellena el formulario para editar un producto existente (ya migrado a opciones genéricas). */
export function desdeProducto(p: Producto): FormProducto {
  const urls = [...new Set((p.imagen ? [p.imagen] : []).concat(Object.values(p.fotos ?? {}).flat()))];
  const imagenes = urls.map((url, i) => ({ id: `actual-${i}`, url, nombre: p.nombre }));
  const idDe = (url: string) => imagenes.find((i) => i.url === url)?.id ?? "";
  const iFotos = opcionDeFotos(p);
  const fotosPorValor = iFotos < 0 ? {} : Object.fromEntries(p.opciones[iFotos].valores.map((v) => [v, (p.fotos?.[v] ?? []).map(idDe).filter(Boolean)]));
  return {
    nombre: p.nombre,
    descripcion: p.descripcion ?? "",
    precio: p.precio ? String(Math.round(p.precio)) : "",
    precioAntes: p.precioAntes ? String(Math.round(p.precioAntes)) : "",
    ofertaDesde: p.oferta?.desde ?? "",
    ofertaHasta: p.oferta?.hasta ?? "",
    opciones: p.opciones.map((o) => ({ nombre: o.nombre, valores: [...o.valores] })),
    opcionFotos: iFotos,
    fotosPorValor,
    stock: Object.fromEntries(p.variantes.map((v) => [claveVariante(v.valores), String(v.stock)])),
    estado: p.estado,
    categorias: p.categorias,
    imagenes,
  };
}

/** Mensajes con punto final (regla de micro-copy). */
export function validar(f: FormProducto): Errores {
  const e: Errores = {};
  if (f.nombre.trim().length < 2) e.nombre = "Escribe el nombre del producto.";
  const precio = entero(f.precio);
  // Vacío no es error: se guarda pausado (decisión 0028). Escrito y mal, sí.
  if (f.precio.trim() && !(precio > 0)) e.precio = "Escribe un precio mayor a 0.";
  if (f.precioAntes.trim()) {
    const antes = entero(f.precioAntes);
    if (!(antes > 0)) e.precioAntes = "Escribe un número o deja el campo vacío.";
    else if (precio > 0 && antes <= precio) e.precioAntes = "Tiene que ser mayor que el precio, para que se vea como oferta.";
  }
  if (f.ofertaDesde && f.ofertaHasta && f.ofertaHasta < f.ofertaDesde) e.ofertaHasta = "Tiene que ser el mismo día del inicio o después.";
  const conValores = f.opciones.filter((o) => o.valores.length);
  const nombres = conValores.map((o) => o.nombre.trim().toLowerCase());
  if (nombres.some((n) => !n)) e.opciones = "Ponle nombre a cada opción, por ejemplo Color o Talla.";
  else if (new Set(nombres).size < nombres.length) e.opciones = "Cada opción necesita un nombre distinto.";
  return e;
}

/** Lo que impide publicar (decisión 0028): sin foto, precio o stock, se guarda pausado. Texto para el aviso o null. */
export function faltaParaPublicar(f: FormProducto): string | null {
  const faltan = [!f.imagenes.length && "una foto", !(entero(f.precio) > 0) && "el precio", stockTotal(f) === 0 && "el stock"].filter(Boolean) as string[];
  if (!faltan.length) return null;
  return faltan.length === 1 ? faltan[0] : `${faltan.slice(0, -1).join(", ")} y ${faltan.at(-1)}`;
}

/** Del formulario al catálogo. Fotos por valor: las asignadas o, si un valor no tiene, todas. */
export function aProducto(f: FormProducto, id: string, anterior?: Producto | null): Producto {
  const validas = opcionesValidas(f);
  const opciones: Opcion[] = validas.map((o) => ({ nombre: o.nombre.trim(), tipo: tipoDeNombre(o.nombre), valores: o.valores }));
  const urls = f.imagenes.map((i) => i.url);
  const urlDe = Object.fromEntries(f.imagenes.map((i) => [i.id, i.url]));
  const original = f.opciones[f.opcionFotos];
  const iFotos = original ? validas.indexOf(original) : -1;
  const fotos = iFotos < 0
    ? { [FOTOS_GENERAL]: urls }
    : Object.fromEntries(opciones[iFotos].valores.map((v) => {
        const propias = (f.fotosPorValor[v] ?? []).map((idImg) => urlDe[idImg]).filter(Boolean);
        return [v, propias.length ? propias : urls];
      }));
  const precio = entero(f.precio) > 0 ? entero(f.precio) : 0;
  const antes = entero(f.precioAntes) > precio ? entero(f.precioAntes) : undefined;
  return {
    id,
    nombre: f.nombre.trim(),
    sku: anterior?.sku,
    descripcion: f.descripcion.trim() || undefined,
    categorias: f.categorias,
    estado: f.estado,
    precio,
    precioAntes: antes,
    oferta: antes && (f.ofertaDesde || f.ofertaHasta) ? { desde: f.ofertaDesde || undefined, hasta: f.ofertaHasta || undefined } : undefined,
    opciones,
    variantes: combinaciones(opciones).map((v) => ({ valores: v, stock: Number(f.stock[claveVariante(v)]) || 0 })),
    opcionFotos: iFotos,
    imagen: urls[0],
    fotos: urls.length ? fotos : undefined,
  };
}
