"use server";

import type { ConfigEntregas, ConfigPagos } from "../types";
import { marcarHecho, mutarPanel } from "@/lib/sesion";
import { quedaAlgunMetodo, validarEntregas } from "./reglas";

// Guardado simulado (datos de la tienda del panel, lib/datos). Se vuelve a validar aquí: no se confía en el navegador.
// Lo guardado cambia el checkout de la vitrina al instante.

export async function guardarPagos(pagos: ConfigPagos): Promise<{ ok: true } | { error: string }> {
  await new Promise((r) => setTimeout(r, 300));
  if (!quedaAlgunMetodo(pagos)) return { error: "Tiene que quedar al menos un método de cobro activo." };
  if (!/^9\d{8}$/.test(pagos.whatsapp.celular)) return { error: "Revisa el número: son 9 dígitos y empieza con 9." };
  await mutarPanel((d) => void (d.config.pagos = pagos));
  marcarHecho("pagos");
  return { ok: true };
}

export async function guardarEntregas(entregas: ConfigEntregas): Promise<{ ok: true } | { error: string }> {
  await new Promise((r) => setTimeout(r, 600));
  const r = validarEntregas(entregas);
  if (r.regla) return { error: "Debes mantener al menos un método de entrega activo." };
  if (r.resumen) return { error: r.resumen };
  await mutarPanel((d) => void (d.config.entregas = entregas));
  marcarHecho("entregas");
  return { ok: true };
}

/** WhatsApp de ventas: se edita solo en Mi tienda › Contacto; Pagos y el checkout lo leen de aquí. */
export async function guardarWhatsappVentas(celular: string): Promise<{ ok: true } | { error: string }> {
  if (!/^9\d{8}$/.test(celular)) return { error: "Revisa el número: son 9 dígitos y empieza con 9." };
  await mutarPanel((d) => void ((d.config.pagos.whatsapp.celular = celular), (d.tienda.celularVentas = celular)));
  return { ok: true };
}

/** Nombre de la sección de ofertas (Mi tienda, 0034): hasta 20 caracteres; vacío vuelve a "Ofertas". */
export async function guardarNombreOfertas(nombre: string): Promise<{ ok: true } | { error: string }> {
  const limpio = nombre.trim().replace(/\s+/g, " ");
  if (limpio.length > 20) return { error: "Usa hasta 20 caracteres." };
  await mutarPanel((d) => void (d.tienda.nombreOfertas = limpio || undefined));
  return { ok: true };
}
