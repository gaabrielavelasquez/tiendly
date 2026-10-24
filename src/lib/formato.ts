// Formatos compartidos del panel (Perú).
const enteros = new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN", maximumFractionDigits: 0 });
const decimales = new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN", minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** Importes monetarios a precisión de céntimos, sin residuos de la aritmética binaria. */
export const redondearSoles = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

/** "S/ 712" o "S/ 179.10": dos decimales solo cuando el importe tiene céntimos. */
export function formatoSoles(n: number) {
  const valor = redondearSoles(n);
  return (Number.isInteger(valor) ? enteros : decimales).format(valor);
}

export const plural = (n: number, uno: string, varios: string) => `${n} ${n === 1 ? uno : varios}`;

/** Hora con su artículo: la 1 va en singular ("la 1:03 p. m."); las demás, en plural ("las 6:30 p. m."). */
export const conArticulo = (hora: string) => `${/^1:/.test(hora.trim()) ? "la" : "las"} ${hora.trim()}`;
