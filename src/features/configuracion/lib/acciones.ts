"use server";

import type { ConfigEntregas, ConfigPagos } from "../types";
import { marcarHecho } from "@/lib/sesion";
import { configActual, guardarConfig } from "./mock";
import { quedaAlgunMetodo, validarEntregas } from "./reglas";

// Guardado simulado (memoria del servidor). Se vuelve a validar aquí: no se confía en el navegador.
// Lo guardado cambia el checkout de la vitrina al instante.

export async function guardarPagos(pagos: ConfigPagos): Promise<{ ok: true } | { error: string }> {
  await new Promise((r) => setTimeout(r, 300));
  if (!quedaAlgunMetodo(pagos)) return { error: "Tiene que quedar al menos un método de cobro activo." };
  if (!/^9\d{8}$/.test(pagos.whatsapp.celular)) return { error: "Revisa el número: son 9 dígitos y empieza con 9." };
  guardarConfig({ pagos });
  marcarHecho("pagos");
  return { ok: true };
}

export async function guardarEntregas(entregas: ConfigEntregas): Promise<{ ok: true } | { error: string }> {
  await new Promise((r) => setTimeout(r, 600));
  const r = validarEntregas(entregas);
  if (r.regla) return { error: "Debes mantener al menos un método de entrega activo." };
  if (r.resumen) return { error: r.resumen };
  guardarConfig({ entregas });
  marcarHecho("entregas");
  return { ok: true };
}

/** WhatsApp de ventas: se edita solo en Mi tienda › Contacto; Pagos y el checkout lo leen de aquí. */
export async function guardarWhatsappVentas(celular: string): Promise<{ ok: true } | { error: string }> {
  if (!/^9\d{8}$/.test(celular)) return { error: "Revisa el número: son 9 dígitos y empieza con 9." };
  const { pagos } = configActual();
  guardarConfig({ pagos: { ...pagos, whatsapp: { ...pagos.whatsapp, celular } } });
  return { ok: true };
}
