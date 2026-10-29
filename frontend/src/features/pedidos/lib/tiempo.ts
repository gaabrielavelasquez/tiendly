// Fechas en hora de Lima sin Intl: el mismo resultado en servidor y navegador (sin errores de hidratación).
// Lima está siempre en UTC−5 (sin horario de verano).
const OFFSET_LIMA_MIN = -5 * 60;

export function enLima(ms: number) {
  const d = new Date(ms + OFFSET_LIMA_MIN * 60000);
  return { dia: `${d.getUTCFullYear()}-${d.getUTCMonth()}-${d.getUTCDate()}`, mes: d.getUTCMonth(), fecha: d.getUTCDate(), h: d.getUTCHours(), min: d.getUTCMinutes() };
}

/** ¿Los dos instantes caen el mismo día en Lima? */
export const mismoDiaLima = (a: number, b: number) => enLima(a).dia === enLima(b).dia;
