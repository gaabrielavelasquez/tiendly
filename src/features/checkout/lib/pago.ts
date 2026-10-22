import { soloDigitos } from "./reglas";

// Pago SIMULADO hasta conectar la pasarela (Cobros automáticos, módulo 4). Ningún dato sale del navegador.
// Valores de prueba: tarjeta que termina en 0002 → rechazada; en 9995 → sin saldo; código Yape 000000 → no válido.

export type Marca = "Visa" | "Mastercard" | "American Express" | "Diners Club";

export function marcaTarjeta(numero: string): Marca | null {
  const n = soloDigitos(numero);
  if (/^4/.test(n)) return "Visa";
  if (/^(5[1-5]|2[2-7])/.test(n)) return "Mastercard";
  if (/^3[47]/.test(n)) return "American Express";
  if (/^3(0|6|8)/.test(n)) return "Diners Club";
  return null;
}

/** "4557880012345678" → "4557 8800 1234 5678" (Amex: 4-6-5). */
export function formatoTarjeta(numero: string) {
  const n = soloDigitos(numero).slice(0, 19);
  if (marcaTarjeta(n) === "American Express") return [n.slice(0, 4), n.slice(4, 10), n.slice(10, 15)].filter(Boolean).join(" ");
  return n.replace(/(\d{4})(?=\d)/g, "$1 ");
}

/** "0829" → "08/29". */
export const formatoVencimiento = (v: string) => soloDigitos(v).slice(0, 4).replace(/^(\d{2})(\d)/, "$1/$2");

function luhn(n: string) {
  let suma = 0;
  for (let i = 0; i < n.length; i++) {
    let d = Number(n[n.length - 1 - i]);
    if (i % 2) d = d * 2 > 9 ? d * 2 - 9 : d * 2;
    suma += d;
  }
  return suma % 10 === 0;
}

export type Tarjeta = { numero: string; vencimiento: string; cvv: string };
export type ErroresTarjeta = Partial<Record<keyof Tarjeta, string>>;

const vencida = (mm: number, aa: number, hoy: Date) => 2000 + aa < hoy.getFullYear() || (2000 + aa === hoy.getFullYear() && mm < hoy.getMonth() + 1);

export function validarTarjeta(t: Tarjeta, hoy: Date): ErroresTarjeta {
  const e: ErroresTarjeta = {};
  const n = soloDigitos(t.numero);
  if (n.length < 14 || !luhn(n)) e.numero = "Revisa el número de tu tarjeta.";
  const [mm, aa] = t.vencimiento.split("/").map(Number);
  if (!(mm >= 1 && mm <= 12) || !(aa >= 0) || t.vencimiento.length !== 5) e.vencimiento = "Escríbelo como MM/AA.";
  else if (vencida(mm, aa, hoy)) e.vencimiento = "Esta tarjeta venció.";
  const largo = marcaTarjeta(n) === "American Express" ? 4 : 3;
  if (soloDigitos(t.cvv).length !== largo) e.cvv = `Son los ${largo} dígitos de atrás de tu tarjeta.`;
  return e;
}

/** Aviso de pago fallido (Figma K3a–K3c y K4): siempre dice que no se cobró nada. */
export type FalloPago = { titulo: string; detalle: string };

export const FALLO_VENCIDA: FalloPago = { titulo: "Tu tarjeta está vencida", detalle: "No se te cobró nada. Usa otra tarjeta o paga con Yape." };

const espera = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function cobrarTarjeta(t: Tarjeta): Promise<FalloPago | null> {
  await espera(1400);
  const n = soloDigitos(t.numero);
  if (n.endsWith("0002")) return { titulo: "No se pudo hacer el pago", detalle: "Tu banco rechazó la tarjeta y no se te cobró nada. Prueba con otra tarjeta o paga con Yape." };
  if (n.endsWith("9995")) return { titulo: "Tu tarjeta no tiene saldo suficiente", detalle: "No se te cobró nada. Prueba con otra tarjeta o paga con Yape." };
  return null;
}

export async function cobrarYape(codigo: string): Promise<string | null> {
  await espera(1200);
  return soloDigitos(codigo) === "000000" ? "Este código no es válido o ya venció. Genera uno nuevo en Yape y escríbelo aquí." : null;
}
