import { datosTienda } from "@/lib/datos/tienda";
import type { ConfigCompra, Escenario } from "../types";

// Configuración de cobro y entrega de cada tienda, guardada con sus datos (lib/datos/tienda). La lee el
// checkout de la vitrina: lo que se guarda aquí cambia lo que ve el cliente al comprar.

export function leerEscenario(v: string | string[] | undefined): Escenario {
  const e = Array.isArray(v) ? v[0] : v;
  return e === "sin-pasarela" || e === "en-revision" || e === "sin-entregas" || e === "error" ? e : "configurado";
}

/** La configuración de una tienda. `null` si la tienda no existe. */
export async function configDe(slug: string): Promise<ConfigCompra | null> {
  return (await datosTienda(slug))?.config ?? null;
}

/** Para el panel. Los escenarios muestran otros estados sin tocar lo guardado. */
export async function obtenerConfig(slug: string, escenario: Escenario = "configurado"): Promise<ConfigCompra> {
  if (escenario === "error") throw new Error("No se pudo cargar la configuración (simulado).");
  const guardada = await configDe(slug);
  if (!guardada) throw new Error("La tienda no existe.");
  const c: ConfigCompra = structuredClone(guardada);
  if (escenario === "sin-pasarela") c.pagos.cobros = { estado: "sin-activar", tarjeta: false, yape: false };
  if (escenario === "en-revision") c.pagos.cobros = { estado: "en-revision", tarjeta: false, yape: false, solicitud: { numero: "AF-DEMO0001", enviada: "2026-10-13T15:00:00-05:00" } };
  if (escenario === "sin-entregas") (c.entregas.delivery.activo = false), (c.entregas.recojo.activo = false);
  return c;
}
