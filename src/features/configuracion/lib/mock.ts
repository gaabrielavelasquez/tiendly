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

export function leerEscenario(v: string | string[] | undefined): Escenario {
  const e = Array.isArray(v) ? v[0] : v;
  return e === "sin-pasarela" || e === "sin-entregas" || e === "error" ? e : "configurado";
}

/** Simula la llamada al backend (se ve el esqueleto). Los escenarios muestran otros estados sin tocar lo guardado. */
export async function obtenerConfig(escenario: Escenario = "configurado"): Promise<ConfigCompra> {
  await new Promise((r) => setTimeout(r, 400));
  if (escenario === "error") throw new Error("No se pudo cargar la configuración (simulado).");
  const c = configActual();
  if (escenario === "sin-pasarela") c.pagos.cobros = { estado: "sin-activar", tarjeta: false, yape: false };
  if (escenario === "sin-entregas") (c.entregas.delivery.activo = false), (c.entregas.recojo.activo = false);
  return c;
}
