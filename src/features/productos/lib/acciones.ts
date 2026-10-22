"use server";

import { subirFotos } from "@/lib/datos/fotos";
import { datosPanel, mutarPanel } from "@/lib/sesion";
import type { Producto } from "../types";
import { aProducto, faltaParaPublicar, validar, type FormProducto } from "./formulario";
import { duplicar } from "./reglas";

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
