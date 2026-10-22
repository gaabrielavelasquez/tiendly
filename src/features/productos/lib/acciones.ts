"use server";

import { aProducto, faltaParaPublicar, validar, type FormProducto } from "./formulario";
import { guardarEnCatalogo, obtenerProducto } from "./mock";

// Guardado simulado (memoria del servidor). Se vuelve a validar aquí: no se confía en el navegador.

/** Crea (`id` null) o actualiza un producto. Activo pero incompleto: se guarda pausado (decisión 0028). */
export async function guardarProducto(id: string | null, form: FormProducto): Promise<{ id: string; pausado: string | null } | { error: string }> {
  if (Object.keys(validar(form)).length) return { error: "Revisa los campos marcados en rojo." };
  if (form.imagenes.some((i) => i.url.startsWith("blob:"))) return { error: "No pudimos subir las fotos. Inténtalo de nuevo." };
  const anterior = id ? await obtenerProducto(id) : null;
  if (id && !anterior) return { error: "Este producto ya no existe." };
  const pausado = form.estado === "activo" ? faltaParaPublicar(form) : null;
  const final = aProducto(pausado ? { ...form, estado: "pausado" } : form, id ?? `p-${crypto.randomUUID().slice(0, 8)}`, anterior);
  guardarEnCatalogo(final);
  return { id: final.id, pausado };
}
