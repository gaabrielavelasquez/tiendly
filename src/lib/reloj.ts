// Reloj de la app: la hora real. Perú (America/Lima, UTC−5 sin horario de verano) se aplica al formatear.
// Los datos de demo de Heather se escribieron alrededor de un momento fijo (ANCLA_DEMO); `alPresente` los corre
// al presente para que la demo siempre esté al día sin tocar lo que guardan las tiendas reales.

const ZONA = "America/Lima";
const DIA_MS = 24 * 60 * 60 * 1000;

/** Momento en que se escribió la demo de Heather: jueves 15 de octubre de 2026, 6:30 p. m. en Lima. */
const ANCLA_DEMO = Date.parse("2026-10-15T18:30:00-05:00");

/** Ahora (ISO). Se toma una vez por pedido de página y se pasa hacia abajo, así todo usa el mismo instante. */
export const ahoraIso = () => new Date().toISOString();

/** AAAA-MM-DD del día en Lima. */
export const hoyLima = (iso = ahoraIso()) => new Intl.DateTimeFormat("en-CA", { timeZone: ZONA }).format(new Date(iso));

/** Corre una fecha de la demo al presente: queda a la misma distancia de `ahora` que tenía del ancla. */
export const alPresente = (iso: string, ahora = ahoraIso()) => new Date(Date.parse(iso) + (Date.parse(ahora) - ANCLA_DEMO)).toISOString();

/** La semana de Lima (lunes a domingo) que contiene `ahora`, como AAAA-MM-DD, y la posición de hoy (lunes = 0). */
export function semanaLima(ahora = ahoraIso()) {
  const mediodia = new Date(`${hoyLima(ahora)}T12:00:00Z`);
  const hoy = (mediodia.getUTCDay() + 6) % 7;
  const dias = Array.from({ length: 7 }, (_, i) => new Date(mediodia.getTime() + (i - hoy) * DIA_MS).toISOString().slice(0, 10));
  return { dias, hoy };
}
