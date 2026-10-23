"use server";

import { subirFotos } from "@/lib/datos/fotos";
import { datosPanel, mutarPanel } from "@/lib/sesion";
import type { Producto } from "../types";
import { aProducto, faltaParaPublicar, validar, type FormProducto } from "./formulario";
import { conOferta, duplicar, sinOferta, type OfertaEnLote } from "./reglas";

// Catálogo de la tienda del panel, guardado con sus datos (lib/datos). Se vuelve a validar aquí: no se
// confía en el navegador.

/**
 * Crea (`id` null) o actualiza un producto. Activo pero incompleto: se guarda pausado (decisión 0028).
 * Devuelve las URL finales de las fotos para que el formulario no las vuelva a subir.
 */
export async function guardarProducto(id: string | null, form: FormProducto): Promise<{ id: string; pausado: string | null; urls: string[] } | { error: string }> {
  if (Object.keys(validar(form)).length) return { error: "Revisa los campos marcados en rojo." };
  if (form.imagenes.some((i) => i.url.startsWith("blob:"))) return { error: "No pudimos subir las fotos. Inténtalo de nuevo." };
  const { tienda, productos } = await datosPanel();
  const anterior = id ? productos.find((p) => p.id === id) : null;
  if (id && !anterior) return { error: "Este producto ya no existe." };
  const urls = await subirFotos(tienda.slug, form.imagenes.map((i) => i.url));
  const imagenes = form.imagenes.map((i, n) => ({ ...i, url: urls[n] }));
  const pausado = form.estado === "activo" ? faltaParaPublicar(form) : null;
  const final = aProducto({ ...form, imagenes, estado: pausado ? "pausado" : form.estado }, id ?? `p-${crypto.randomUUID().slice(0, 8)}`, anterior);
  await mutarPanel((d) => {
    const i = d.productos.findIndex((x) => x.id === final.id);
    if (i >= 0) d.productos[i] = final;
    else d.productos.unshift(final);
  });
  return { id: final.id, pausado, urls };
}

/** Copia pausada y sin stock, justo debajo del original. */
export async function duplicarProducto(id: string): Promise<Producto | { error: string }> {
  return mutarPanel((d) => {
    const i = d.productos.findIndex((p) => p.id === id);
    if (i < 0) return { error: "Este producto ya no existe." };
    const copia = duplicar(d.productos[i]);
    d.productos.splice(i + 1, 0, copia);
    return copia;
  });
}

/** Pausar (uno o varios) o deshacer: deja cada producto con el estado indicado. */
export async function cambiarEstados(estados: Record<string, Producto["estado"]>) {
  await mutarPanel((d) => {
    for (const p of d.productos) if (estados[p.id]) p.estado = estados[p.id];
  });
}

const DIA = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Poner en oferta en lote (0034). El servidor recalcula cada precio (no confía en el navegador). Devuelve los
 * productos como quedaron y cuántos se saltaron porque el precio no bajaba.
 */
export async function ponerEnOferta(ids: string[], o: OfertaEnLote): Promise<{ productos: Producto[]; saltados: number } | { error: string }> {
  if (!(o.valor > 0) || (o.modo === "porcentaje" && o.valor >= 100)) return { error: "Revisa el descuento." };
  if ((o.desde && !DIA.test(o.desde)) || (o.hasta && !DIA.test(o.hasta)) || (o.desde && o.hasta && o.hasta < o.desde)) return { error: "Revisa las fechas." };
  return mutarPanel((d) => {
    const productos: Producto[] = [];
    let saltados = 0;
    d.productos = d.productos.map((p) => {
      if (!ids.includes(p.id)) return p;
      const nuevo = conOferta(p, o);
      if (!nuevo) return (saltados++, p);
      productos.push(nuevo);
      return nuevo;
    });
    return { productos, saltados };
  });
}

/** Quitar la oferta en lote: cada producto vuelve a su precio normal. */
export async function quitarOferta(ids: string[]): Promise<Producto[]> {
  return mutarPanel((d) => {
    d.productos = d.productos.map((p) => (ids.includes(p.id) ? sinOferta(p) : p));
    return d.productos.filter((p) => ids.includes(p.id));
  });
}

/** Deshacer una acción en lote: deja precio, oferta y estado como estaban. */
export async function restaurarProductos(previos: Pick<Producto, "id" | "precio" | "precioAntes" | "oferta" | "estado">[]) {
  await mutarPanel((d) => {
    const antes = new Map(previos.map((p) => [p.id, p]));
    d.productos = d.productos.map((p) => {
      const a = antes.get(p.id);
      return a ? { ...p, precio: a.precio, precioAntes: a.precioAntes, oferta: a.oferta, estado: a.estado } : p;
    });
  });
}
