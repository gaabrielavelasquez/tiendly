// Formatos compartidos del panel (Perú).
const soles = new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN", maximumFractionDigits: 0 });

/** "S/ 1,320". */
export const formatoSoles = (n: number) => soles.format(n);

export const plural = (n: number, uno: string, varios: string) => `${n} ${n === 1 ? uno : varios}`;
