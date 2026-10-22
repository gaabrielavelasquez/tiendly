// Configuración de cobro y entrega de la tienda (módulo 2; decisiones 0007 y 0009).

export type Escenario = "configurado" | "sin-pasarela" | "sin-entregas" | "error";

/** Cobros automáticos (tarjeta y Yape en la web): se piden en Afiliación (módulo 4). */
export type Cobros = { estado: "sin-activar" | "activo"; tarjeta: boolean; yape: boolean; cuenta?: { banco: string; tipo: string; ultimos4: string; titular: string } };

export type ConfigPagos = { whatsapp: { activo: boolean; celular: string }; cobros: Cobros };

export type IdZona = "lima" | "callao" | "provincias";
/** Tarifa por zona (0009). `costo` y `plazo` son texto tal como los escribe la persona. */
export type Zona = { id: IdZona; activa: boolean; costo: string; plazo: string };

export type ConfigEntregas = {
  delivery: { activo: boolean; zonas: Zona[]; envioGratis: { activo: boolean; desde: string } };
  recojo: { activo: boolean; direccion: string; distrito: string; horario: string; nota: string };
};

export type ConfigCompra = { pagos: ConfigPagos; entregas: ConfigEntregas };

export const NOMBRE_ZONA: Record<IdZona, string> = { lima: "Lima Metropolitana", callao: "Callao", provincias: "Provincias" };
