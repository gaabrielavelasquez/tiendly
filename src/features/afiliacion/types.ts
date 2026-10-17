export type Banco = "bcp" | "interbank" | "bbva";
export type Negocio = { ruc: string; razonSocial: string; direccion: string; tipo: "persona" | "empresa"; condicion: "habido" | "no-habido" };
export type Datos = { ruc: string; nombre: string; dni: string; celular: string; correo: string; banco: Banco | ""; cci: string };
export type EstadoSolicitud = "revision" | "observada" | "aprobada";
export type Solicitud = { numero: string; enviada: string; respuesta: string; estado: EstadoSolicitud; datos: Datos; negocio: Negocio };
export type Borrador = { datos: Datos; negocio: Negocio | null; paso: number; solicitud: Solicitud | null };
export type Errores = Partial<Record<keyof Datos, string>>;
