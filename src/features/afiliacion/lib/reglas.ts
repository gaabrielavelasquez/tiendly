import { tiendaActual } from "@/lib/sesion";
import type { Datos, Errores } from "../types";

/** Prefijos usados únicamente por el adaptador simulado; no validan una cuenta real. */
export const BANCOS = [
  { id: "bcp", nombre: "BCP", prefijo: "002" },
  { id: "interbank", nombre: "Interbank", prefijo: "003" },
  { id: "bbva", nombre: "BBVA", prefijo: "011" },
] as const;
/** Figma A2: el nombre de la tienda se precarga (se puede cambiar); los rubros vienen del onboarding (perfil del negocio). */
export const DATOS_VACIOS: Datos = { ruc: "", tienda: tiendaActual.nombre, rubros: [], nombre: "", dni: "", cargo: "", celular: "", correo: "", banco: "", cci: "", tipoCuenta: "" };
/** Figma A3. Con RUC 10 (persona natural) el cargo es «Titular». */
export const CARGOS = ["Titular gerente", "Gerente general", "Apoderado", "Titular"] as const;
/** Figma A4. */
export const TIPOS_CUENTA = [{ id: "corriente", nombre: "Cuenta corriente" }, { id: "ahorros", nombre: "Cuenta de ahorros" }] as const;
export const nombreTipoCuenta = (id: Datos["tipoCuenta"]) => TIPOS_CUENTA.find((t) => t.id === id)?.nombre ?? "";

/** Lo que falta completar en A2 después de encontrar el RUC. */
export function validarNegocio(datos: Datos): Errores {
  const e: Errores = {};
  if (datos.tienda.trim().length < 2) e.tienda = "Escribe el nombre de tu tienda.";
  if (!datos.rubros.length) e.rubros = "Elige al menos una opción.";
  return e;
}
export function validarRuc(ruc: string): string | undefined {
  if (ruc.length < 11) return ruc.length ? `Te ${11 - ruc.length === 1 ? "falta 1 dígito" : `faltan ${11 - ruc.length} dígitos`}. El RUC tiene 11.` : "Escribe los 11 dígitos de tu RUC.";
  if (!/^(10|20)\d{9}$/.test(ruc)) return "Revisa tu RUC: debe tener 11 dígitos y empezar con 10 o 20.";
}
export function validarRepresentante(datos: Datos): Errores {
  const e: Errores = {};
  if (datos.nombre.trim().split(/\s+/).length < 2) e.nombre = "Escribe tus nombres y apellidos completos.";
  if (!/^\d{8}$/.test(datos.dni)) e.dni = "El DNI tiene 8 dígitos.";
  if (!datos.cargo) e.cargo = "Elige tu cargo en el negocio.";
  if (!/^9\d{8}$/.test(datos.celular)) e.celular = "Escribe 9 dígitos y empieza con 9.";
  if (!/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(datos.correo)) e.correo = "Revisa tu correo: le falta el final (por ejemplo, .com o .pe).";
  else if (/@(gmai|gmial|gmail\.con|hotmai|outlok)\./i.test(datos.correo) || /@gmail\.con$/i.test(datos.correo)) e.correo = "Revisa el dominio de tu correo. ¿Quisiste escribir gmail.com, hotmail.com u outlook.com?";
  return e;
}
export function detectarBanco(cci: string) { return BANCOS.find(b => cci.startsWith(b.prefijo)); }
export function validarCuenta(datos: Datos): Errores {
  const e: Errores = {};
  if (!BANCOS.some(b => b.id === datos.banco)) e.banco = "Elige tu banco.";
  if (!/^\d{20}$/.test(datos.cci)) e.cci = `El CCI tiene 20 dígitos.${datos.cci.length < 20 ? ` Te faltan ${20 - datos.cci.length}.` : ""}`;
  else if (!detectarBanco(datos.cci)) e.cci = "No reconocemos ese CCI. Revisa los primeros dígitos.";
  else if (detectarBanco(datos.cci)?.id !== datos.banco) e.cci = `El CCI corresponde a ${detectarBanco(datos.cci)?.nombre}, no al banco elegido. Revisa tu CCI o cambia de banco.`;
  if (!datos.tipoCuenta) e.tipoCuenta = "Elige el tipo de cuenta.";
  return e;
}
