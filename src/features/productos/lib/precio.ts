/** Texto de precio: teclado decimal, punto o coma; nunca más de dos céntimos. */
export const entradaPrecio = (v: string) => /^\d*(?:[.,]\d{0,2})?$/.test(v);

/** Valida también en servidor. Vacío o un texto inválido no se convierten en otro precio. */
export function leerPrecio(v: string) {
  const s = v.trim().replace(",", ".");
  return /^\d+(?:\.\d{0,2})?$/.test(s) ? Number(s) : NaN;
}
