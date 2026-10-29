import type { RubroId } from "@/features/onboarding/lib/rubros";

export type Banco = "bcp" | "interbank" | "bbva";
export type Negocio = { ruc: string; razonSocial: string; direccion: string; tipo: "persona" | "empresa"; condicion: "habido" | "no-habido" };
/** Lo que completa la persona. La razón social y la dirección fiscal vienen de SUNAT (Negocio). */
export type Datos = { ruc: string; tienda: string; rubros: RubroId[]; nombre: string; dni: string; cargo: string; celular: string; correo: string; banco: Banco | ""; cci: string; tipoCuenta: "" | "corriente" | "ahorros" };
export type EstadoSolicitud = "revision" | "observada" | "aprobada";
export type Solicitud = { numero: string; enviada: string; respuesta: string; estado: EstadoSolicitud; datos: Datos; negocio: Negocio };
export type Borrador = { datos: Datos; negocio: Negocio | null; paso: number; solicitud: Solicitud | null };
export type Errores = Partial<Record<keyof Datos, string>>;
