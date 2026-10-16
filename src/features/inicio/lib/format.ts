// Formatos de Perú, siempre en hora de Lima para que servidor y navegador muestren lo mismo.
const ZONA = "America/Lima";

const soles = new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN", maximumFractionDigits: 0 });
export const formatoSoles = (n: number) => soles.format(n);

const mayuscula = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** "Jueves 15 de octubre". */
export function fechaLarga(iso: string) {
  const f = new Date(iso);
  const dia = new Intl.DateTimeFormat("es-PE", { weekday: "long", timeZone: ZONA }).format(f);
  const resto = new Intl.DateTimeFormat("es-PE", { day: "numeric", month: "long", timeZone: ZONA }).format(f);
  return `${mayuscula(dia)} ${resto}`;
}

/** "Jue 15" (tooltip) o "Jueves 15" (lector de pantalla). `fecha` va como AAAA-MM-DD. */
export function fechaDia(fecha: string, largo = false) {
  const f = new Date(`${fecha}T12:00:00-05:00`);
  const dia = new Intl.DateTimeFormat("es-PE", { weekday: largo ? "long" : "short", timeZone: ZONA }).format(f);
  return `${mayuscula(dia.replace(".", ""))} ${f.getUTCDate()}`;
}

/** "6:30 p. m.". */
export const hora = (iso: string) =>
  new Intl.DateTimeFormat("es-PE", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: ZONA }).format(new Date(iso));

/** AAAA-MM-DD en Lima. */
export const fechaCorta = (iso: string) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: ZONA }).format(new Date(iso));

export const linkTienda = (slug: string) => `tiendly.pe/${slug}`;

/** Abre WhatsApp con el mensaje para compartir la tienda (wa.me sin número: elige el chat). */
export const whatsappCompartir = (slug: string) =>
  `https://wa.me/?text=${encodeURIComponent(`¡Hola! Ya puedes comprar en mi tienda: ${linkTienda(slug)}`)}`;
