"use server";

import { recordarIngreso, tiendaDeIngreso } from "@/lib/datos/ingreso";
import { cookies } from "next/headers";
import { tiendaNueva } from "@/lib/datos/semillas";
import { existeTienda, guardarTienda } from "@/lib/datos/tienda";
import { COOKIE_TIENDA, mutarPanel } from "@/lib/sesion";
import { esRubro, type RubroId } from "./rubros";
import { errorCelular } from "./phone";
import { aSlug, OCUPADOS, type ResultadoSlug } from "./slug";

/** Guarda los rubros del negocio (Afiliación A2). Se vuelve a validar aquí: no se confía en el navegador. */
export async function guardarRubros(rubros: RubroId[]): Promise<{ ok: true } | { error: string }> {
  if (!validos(rubros)) return { error: "Elige al menos una opción." };
  await mutarPanel((d) => void (d.rubros = rubros));
  return { ok: true };
}

const validos = (rubros: unknown): rubros is RubroId[] => Array.isArray(rubros) && rubros.length > 0 && rubros.every(esRubro);

/** ¿El link está libre? Ocupado si es una ruta de la app, la tienda de demo o una tienda ya creada. */
export async function linkLibre(slug: string) {
  return !OCUPADOS.has(slug) && !(await existeTienda(slug));
}

/** Para el onboarding: si el link está ocupado, sugiere el primero libre. */
export async function revisarSlug(slug: string): Promise<ResultadoSlug> {
  const limpio = aSlug(slug);
  return (await linkLibre(limpio)) ? { slug: limpio, libre: true } : { slug: limpio, libre: false, sugerencia: await primeroLibre(limpio) };
}

/** El primer link libre: el pedido, o con -pe, -2, -3… */
async function primeroLibre(slug: string) {
  if (await linkLibre(slug)) return slug;
  for (const sufijo of ["pe", ...Array.from({ length: 48 }, (_, i) => String(i + 2))]) if (await linkLibre(`${slug}-${sufijo}`)) return `${slug}-${sufijo}`;
  return `${slug}-${crypto.randomUUID().slice(0, 6)}`;
}

type NuevaTienda = { nombre: string; slug: string; celularVentas: string; celularIngreso?: string; rubros: RubroId[]; rubroOtro?: string; duena?: string };

/**
 * Crea la tienda (simulado, en los datos compartidos): arranca vacía, con su link, su WhatsApp de ventas y
 * plan Free. Este navegador la recuerda (cookie): desde aquí el panel es el de esta tienda.
 */
export async function crearTienda(t: NuevaTienda): Promise<{ slug: string } | { error: string }> {
  const nombre = t.nombre.trim();
  const base = aSlug(t.slug);
  if (nombre.length < 2 || !base) return { error: "Escribe el nombre de tu negocio." };
  if (errorCelular(t.celularVentas)) return { error: "Revisa el WhatsApp de ventas." };
  if (!validos(t.rubros)) return { error: "Elige al menos una opción para armar tu tienda." };
  const otro = typeof t.rubroOtro === "string" ? t.rubroOtro.trim() : "";
  if (t.rubros.includes("otro") && (otro.length < 2 || otro.length > 80)) return { error: "Cuéntanos qué vendes, en hasta 80 caracteres." };
  const ingreso = t.celularIngreso ?? t.celularVentas;
  if (errorCelular(ingreso)) return { error: "Revisa el número con el que te registraste." };
  const slug = await primeroLibre(base);
  const datos = tiendaNueva({ nombre, slug, celularVentas: t.celularVentas, rubros: t.rubros, rubroOtro: t.rubros.includes("otro") ? otro : undefined, duena: t.duena?.trim() || undefined });
  datos.tienda.celularIngreso = ingreso;
  await guardarTienda(datos);
  await recordarIngreso(ingreso, slug);
  await recordarSesion(slug);
  return { slug };
}

async function recordarSesion(slug: string) {
  (await cookies()).set(COOKIE_TIENDA, slug, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 60 * 60 * 24 * 180, path: "/" });
}

/** Se llama después del código simulado; no envía mensajes ni implementa autenticación real. */
export async function ingresarTienda(celular: string): Promise<{ ok: true } | { error: string }> {
  if (errorCelular(celular)) return { error: "Revisa tu número de WhatsApp." };
  const slug = await tiendaDeIngreso(celular);
  if (!slug) return { error: "No encontramos una tienda para este número. Revisa el número con el que te registraste." };
  await recordarSesion(slug);
  return { ok: true };
}
