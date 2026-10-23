// PROTOTIPO (decisión 0034): reglas de la oferta que la implementación real moverá a productos/lib.
// Funciones puras sobre días de Lima (AAAA-MM-DD): se calculan al mostrar, sin cuenta regresiva.

export type Oferta = { desde?: string; hasta?: string };
export type ConPrecio = { precio: number; precioAntes?: number; oferta?: Oferta };
export type EstadoOferta = "sin-oferta" | "activa" | "programada" | "terminada";

const DIA_MS = 86_400_000;
const DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

const mediodia = (dia: string) => new Date(`${dia}T12:00:00Z`);
const diferencia = (a: string, b: string) => Math.round((mediodia(a).getTime() - mediodia(b).getTime()) / DIA_MS);

/** Suma días a un AAAA-MM-DD. */
export const sumarDias = (dia: string, n: number) => new Date(mediodia(dia).getTime() + n * DIA_MS).toISOString().slice(0, 10);

/** El próximo día de la semana (0 = domingo) desde `hoy`, sin contar hoy. */
export const proximo = (hoy: string, semana: number) => sumarDias(hoy, ((semana - mediodia(hoy).getUTCDay() + 7) % 7) || 7);

export function estadoOferta(p: ConPrecio, hoy: string): EstadoOferta {
  if (!p.precioAntes || p.precioAntes <= p.precio) return "sin-oferta";
  if (p.oferta?.desde && p.oferta.desde > hoy) return "programada";
  if (p.oferta?.hasta && p.oferta.hasta < hoy) return "terminada";
  return "activa";
}

/** Lo que paga el cliente hoy: el de oferta si está activa; si no, el precio antes (el normal). El cupón va encima. */
export const precioVigente = (p: ConPrecio, hoy: string) => (estadoOferta(p, hoy) === "activa" || !p.precioAntes ? p.precio : Math.max(p.precio, p.precioAntes));

/** "−26 %" sin el signo: 26. */
export const descuento = (precio: number, antes?: number) => (antes && antes > precio ? Math.round((1 - precio / antes) * 100) : 0);

/** "hoy", "mañana", "el domingo 25" (esta semana) o "el 15 de noviembre". */
export function cuando(dia: string, hoy: string) {
  const d = diferencia(dia, hoy);
  if (d === 0) return "hoy";
  if (d === 1) return "mañana";
  const f = mediodia(dia);
  if (d > 1 && d < 7) return `el ${DIAS[f.getUTCDay()]} ${f.getUTCDate()}`;
  return `el ${f.getUTCDate()} de ${MESES[f.getUTCMonth()]}`;
}

/** Texto de vigencia para la tienda y el panel. `urgente`: el último día, como texto de color (0031). */
export function vigencia(p: ConPrecio, hoy: string): { texto: string; urgente: boolean } | null {
  const estado = estadoOferta(p, hoy);
  if (estado === "programada") return { texto: `Empieza ${cuando(p.oferta!.desde!, hoy)}`, urgente: false };
  if (estado === "terminada") return { texto: `Terminó ${cuando(p.oferta!.hasta!, hoy)}`, urgente: false };
  if (estado !== "activa" || !p.oferta?.hasta) return null;
  if (p.oferta.hasta === hoy) return { texto: "Termina hoy", urgente: true };
  const c = cuando(p.oferta.hasta, hoy);
  return { texto: c === "mañana" ? "Hasta mañana" : `Hasta ${c}`, urgente: false };
}

/** Precio de oferta en lote: % sobre el precio normal o un precio fijo. Al sol entero, como se muestran los precios. */
export function precioEnLote(normal: number, modo: "porcentaje" | "precio", valor: number) {
  return Math.round(modo === "porcentaje" ? normal * (1 - valor / 100) : valor);
}
