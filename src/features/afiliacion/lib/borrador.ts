import type { Borrador, Datos, Solicitud } from "../types";
import { BANCOS, DATOS_VACIOS } from "./reglas";
export const STORAGE = "tiendly:afiliacion:heather";
export const VACIO: Borrador = { datos: DATOS_VACIOS, negocio: null, paso: 0, solicitud: null };
export function leerBorrador(valor: string): Borrador {
  const b = JSON.parse(valor) as Borrador;
  if (!b || !b.datos || !Number.isInteger(b.paso) || b.paso < 0 || b.paso > 6) throw new Error("Borrador no válido.");
  for (const key of Object.keys(DATOS_VACIOS) as (keyof Datos)[]) if (typeof b.datos[key] !== "string") throw new Error("Datos incompletos.");
  if (b.datos.banco && !BANCOS.some(bank => bank.id === b.datos.banco)) throw new Error("Banco no válido.");
  if (b.paso > 1 && !b.negocio) throw new Error("Falta el negocio.");
  if (b.paso > 4 && !b.solicitud) throw new Error("Falta la solicitud.");
  if (b.solicitud && (!["revision", "observada", "aprobada"].includes(b.solicitud.estado) || !b.solicitud.datos || !b.solicitud.negocio || !Number.isFinite(Date.parse(b.solicitud.enviada)) || !Number.isFinite(Date.parse(b.solicitud.respuesta)))) throw new Error("Solicitud no válida.");
  return b;
}
export function ejemplo(estado: Solicitud["estado"]): Borrador {
  const datos: Datos = { ruc: "20456789012", nombre: "Cecilia Flores García", dni: "45678901", celular: "987654321", correo: "cecilia@example.com", banco: "bcp", cci: estado === "observada" ? "00312345678901234567" : "00212345678901234567" };
  const negocio = { ruc: datos.ruc, razonSocial: "Heather Calzado S. A. C.", direccion: "Av. de la Moda 123, Miraflores, Lima", tipo: "empresa" as const, condicion: "habido" as const };
  return { datos, negocio, paso: 6, solicitud: { numero: "AF-DEMO0001", enviada: "2026-10-16T15:00:00-05:00", respuesta: "2026-10-30T18:00:00-05:00", estado, datos, negocio } };
}
