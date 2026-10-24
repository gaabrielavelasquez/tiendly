"use server";

import { revalidatePath } from "next/cache";
import { mutarPanel } from "@/lib/sesion";
import { leerTienda } from "./config";
import type { Tienda } from "../types";

/** Una sola escritura del documento: apariencia, contacto y ofertas se publican juntos. */
export async function guardarIdentidad(datos: Tienda): Promise<{ ok: true; datos: Tienda } | { error: string }> {
  let tienda: Tienda;
  try { tienda = leerTienda(JSON.stringify(datos)); }
  catch (e) { return { error: e instanceof Error ? e.message : "Revisa los datos de tu tienda." }; }
  if (!/^9\d{8}$/.test(tienda.whatsapp)) return { error: "Revisa el número: son 9 dígitos y empieza con 9." };
  tienda = { ...tienda, instagram: tienda.instagram.replace(/^@/, ""), nombreOfertas: tienda.nombreOfertas.trim().replace(/\s+/g, " ") };
  const slug = await mutarPanel(d => {
    const { whatsapp, nombreOfertas, ...apariencia } = tienda;
    d.tienda.apariencia = apariencia;
    d.tienda.logo = apariencia.logo;
    d.tienda.nombreOfertas = nombreOfertas || undefined;
    d.tienda.celularVentas = whatsapp;
    d.config.pagos.whatsapp.celular = whatsapp;
    return d.tienda.slug;
  });
  revalidatePath("/panel", "layout");
  revalidatePath(`/${slug}`, "layout");
  return { ok: true, datos: tienda };
}
