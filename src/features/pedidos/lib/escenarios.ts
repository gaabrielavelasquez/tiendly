import { herramientasDev } from "@/lib/entorno";

/** Solo local/preview: permite revisar el fallback real de carga y la recuperación del detalle. Nunca en producción. */
export async function prepararEscenario(valor: string | string[] | undefined, detalle = false) {
  if (!herramientasDev) return;
  const escenario = Array.isArray(valor) ? valor[0] : valor;
  if (escenario === "carga") await new Promise((resolve) => setTimeout(resolve, 5000));
  if (detalle && escenario === "error") throw new Error("No se pudo cargar el pedido (simulado).");
}
