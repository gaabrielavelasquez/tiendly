"use server";
import type { Datos, Negocio, Solicitud } from "../types";
import { validarCuenta, validarRepresentante, validarRuc } from "./reglas";

/** Adaptador de demostración. Sustituir por proveedor SUNAT antes de aceptar datos reales. */
export async function consultarRuc(ruc: string): Promise<{ negocio?: Negocio; error?: string }> {
  await new Promise(r => setTimeout(r, 650));
  const error = validarRuc(ruc);
  if (error) return { error };
  if (ruc === "20000000000") return { error: "No encontramos ese RUC. Revisa los 11 dígitos e inténtalo de nuevo." };
  return { negocio: {
    ruc, razonSocial: ruc.startsWith("10") ? "Cecilia Flores García" : "Heather Calzado S. A. C.",
    direccion: "Av. de la Moda 123, Miraflores, Lima", tipo: ruc.startsWith("10") ? "persona" : "empresa",
    condicion: ruc === "20123456789" ? "no-habido" : "habido",
  } };
}

export async function enviarSolicitud(datos: Datos, acepto: boolean): Promise<{ solicitud?: Solicitud; error?: string }> {
  if (!acepto) return { error: "Acepta los términos para enviar la solicitud." };
  if (validarRuc(datos.ruc) || Object.keys(validarRepresentante(datos)).length || Object.keys(validarCuenta(datos)).length) return { error: "Revisa los datos de tu solicitud antes de enviarla." };
  const consulta = await consultarRuc(datos.ruc);
  if (!consulta.negocio || consulta.negocio.condicion !== "habido") return { error: "No podemos continuar con este RUC. Revisa los datos de tu negocio." };
  await new Promise(r => setTimeout(r, 600));
  const ahora = new Date();
  const respuesta = new Date(ahora);
  let dias = 0;
  while (dias < 10) { respuesta.setDate(respuesta.getDate() + 1); if (![0, 6].includes(respuesta.getDay())) dias++; }
  return { solicitud: { numero: `AF-${crypto.randomUUID().slice(0, 8).toUpperCase()}`, enviada: ahora.toISOString(), respuesta: respuesta.toISOString(), estado: "revision", datos: { ...datos }, negocio: consulta.negocio } };
}
