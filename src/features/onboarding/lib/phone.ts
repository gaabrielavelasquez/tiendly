/** Solo dígitos, máximo 9 (celular peruano). */
export function soloDigitos(v: string): string {
  return v.replace(/\D/g, "").slice(0, 9);
}

/** "987654321" → "987 654 321" */
export function formatear(d: string): string {
  return d.replace(/(\d{3})(\d{0,3})(\d{0,3})/, (_, a, b, c) => [a, b, c].filter(Boolean).join(" "));
}

export function esCelularValido(d: string): boolean {
  return /^9\d{8}$/.test(d);
}

export function errorCelular(d: string): string | undefined {
  if (!d) return "Escribe tu número de WhatsApp.";
  if (!esCelularValido(d)) return "Revisa el número: tiene 9 dígitos y empieza con 9.";
  return undefined;
}
