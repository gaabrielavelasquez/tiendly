import type { ConfigCompra, Escenario } from "../types";

// Configuración simulada de Heather en la memoria del servidor (hasta tener backend). La lee el
// checkout de la vitrina: lo que se guarda aquí cambia lo que ve el cliente al comprar.

const INICIAL: ConfigCompra = {
  pagos: {
    whatsapp: { activo: true, celular: "987654321" },
    cobros: { estado: "activo", tarjeta: true, yape: true, cuenta: { banco: "BCP", tipo: "Cuenta corriente", ultimos4: "9012", titular: "HEATHER CALZADO E.I.R.L." } },
  },
  entregas: {
    delivery: {
      activo: true,
      zonas: [
        { id: "lima", activa: true, costo: "15", plazo: "2 a 3 días hábiles" },
        { id: "callao", activa: true, costo: "18", plazo: "2 a 3 días hábiles" },
        { id: "provincias", activa: true, costo: "25", plazo: "3 a 6 días hábiles" },
      ],
      envioGratis: { activo: true, desde: "700" },
    },
    recojo: { activo: true, direccion: "Calle Los Pinos 245", distrito: "Santiago de Surco", horario: "Lunes a sábado, 10 a. m. a 7 p. m.", nota: "Te escribo por WhatsApp para coordinar el día y la hora." },
  },
};

const g = globalThis as typeof globalThis & { __tiendlyConfig?: ConfigCompra };
const copia = <T,>(v: T): T => JSON.parse(JSON.stringify(v));

/** La configuración vigente (copia: quien la lee no la modifica por accidente). */
export const configActual = (): ConfigCompra => copia((g.__tiendlyConfig ??= copia(INICIAL)));

export function guardarConfig(parcial: Partial<ConfigCompra>) {
  g.__tiendlyConfig = { ...configActual(), ...copia(parcial) };
}

/**
 * Tienda nueva (onboarding): Pedidos por WhatsApp activo con su número; sin cobros automáticos ni recojo
 * (no hay dirección todavía). Delivery queda con las zonas de siempre para que pueda vender desde el primer día.
 */
export function configNueva(celular: string) {
  const c = copia(INICIAL);
  c.pagos = { whatsapp: { activo: true, celular }, cobros: { estado: "sin-activar", tarjeta: false, yape: false } };
  c.entregas.recojo = { activo: false, direccion: "", distrito: "", horario: "", nota: "" };
  c.entregas.delivery.envioGratis = { activo: false, desde: "" };
  g.__tiendlyConfig = c;
}

export function leerEscenario(v: string | string[] | undefined): Escenario {
  const e = Array.isArray(v) ? v[0] : v;
  return e === "sin-pasarela" || e === "en-revision" || e === "sin-entregas" || e === "error" ? e : "configurado";
}

/** Simula la llamada al backend (se ve el esqueleto). Los escenarios muestran otros estados sin tocar lo guardado. */
export async function obtenerConfig(escenario: Escenario = "configurado"): Promise<ConfigCompra> {
  await new Promise((r) => setTimeout(r, 400));
  if (escenario === "error") throw new Error("No se pudo cargar la configuración (simulado).");
  const c = configActual();
  if (escenario === "sin-pasarela") c.pagos.cobros = { estado: "sin-activar", tarjeta: false, yape: false };
  if (escenario === "en-revision") c.pagos.cobros = { estado: "en-revision", tarjeta: false, yape: false, solicitud: { numero: "AF-DEMO0001", enviada: "2026-10-13T15:00:00-05:00" } };
  if (escenario === "sin-entregas") (c.entregas.delivery.activo = false), (c.entregas.recojo.activo = false);
  return c;
}
