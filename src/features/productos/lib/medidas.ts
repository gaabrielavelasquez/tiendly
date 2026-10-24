/** Quita unidades sin convertir valores: la interfaz ya indica cm. Conserva el borrador de números y rangos. */
export function quitarUnidades(valor: string): string {
  return valor.replace(/[\p{L}\p{M}µ°]+(?:[²³]|\^\d+)?\.?/gu, " ")
    .replace(/[^\d.,\s–—−-]/g, "").replace(/[—−-]/g, "–")
    .replace(/\s*–\s*/g, "–").trim();
}

/** Un número decimal o dos números separados por un guion; admite coma decimal al escribir. */
export const esMedida = (valor: string) => /^\d+(?:[.,]\d+)?(?:–\d+(?:[.,]\d+)?)?$/.test(quitarUnidades(valor));
export const normalizarMedida = (valor: string) => esMedida(valor) ? quitarUnidades(valor).replace(/,/g, ".") : "";
