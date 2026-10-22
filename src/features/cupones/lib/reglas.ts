import { formatoSoles } from "@/lib/formato";
import type { Cupon, EstadoCupon } from "../types";

// Reglas de cupones (decisión 0008). Funciones puras. Las fechas son días "AAAA-MM-DD" en Lima.

/** Plan Free: hasta 3 cupones en uso a la vez (activos y programados; Figma, módulo 3). */
export const LIMITE_FREE = 3;

const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
/** "2026-10-31" → "31 oct". */
export const diaCorto = (d: string) => `${Number(d.slice(8, 10))} ${MESES[Number(d.slice(5, 7)) - 1]}`;

export function estadoCupon(c: Cupon, hoy: string): EstadoCupon {
  if (c.hasta && c.hasta < hoy) return "vencido";
  if (c.limiteUsos && c.usos >= c.limiteUsos) return "agotado";
  if (!c.activo) return "pausado";
  if (c.desde && c.desde > hoy) return "programado";
  return "activo";
}

export const enUso = (c: Cupon, hoy: string) => ["activo", "programado"].includes(estadoCupon(c, hoy));
export const cuponesEnUso = (lista: Cupon[], hoy: string) => lista.filter((c) => enUso(c, hoy)).length;

/** "10% de descuento", "S/ 30 de descuento" o "Envío gratis". */
export function textoDescuento(c: Pick<Cupon, "tipo" | "valor">) {
  if (c.tipo === "envio") return "Envío gratis";
  return c.tipo === "porcentaje" ? `${c.valor}% de descuento` : `${formatoSoles(c.valor ?? 0)} de descuento`;
}

/** Línea principal de la tarjeta: descuento y condición ("· Compra mínima S/ 100"). */
export function textoCondicion(c: Cupon) {
  const extra = c.compraMinima ? `Compra mínima ${formatoSoles(c.compraMinima)}` : c.limiteUsos ? `Para las primeras ${c.limiteUsos} compras` : "";
  return [textoDescuento(c), extra].filter(Boolean).join(" · ");
}

/** Línea de estado: "12 usos · Hasta el 31 oct", "Empieza el 1 nov", "50 de 50 usos"… */
export function textoUso(c: Cupon, estado: EstadoCupon) {
  if (estado === "programado" && c.desde) return `Empieza el ${diaCorto(c.desde)}`;
  if (estado === "agotado") return `${c.usos} de ${c.limiteUsos} usos`;
  const usos = `${c.usos} ${c.usos === 1 ? "uso" : "usos"}`;
  if (estado === "vencido" && c.hasta) return `${usos} · Terminó el ${diaCorto(c.hasta)}`;
  return `${usos} · ${c.hasta ? `Hasta el ${diaCorto(c.hasta)}` : "Sin fecha de fin"}`;
}

/** Lo que se descuenta de los productos (nunca del envío ni más que los productos). */
export function descuentoDe(c: Pick<Cupon, "tipo" | "valor">, productos: number) {
  if (c.tipo === "porcentaje") return Math.min(productos, Math.round((productos * (c.valor ?? 0)) / 100));
  if (c.tipo === "monto") return Math.min(productos, c.valor ?? 0);
  return 0;
}

export type FormCupon = { codigo: string; tipo: Cupon["tipo"]; valor: string; conMinimo: boolean; minimo: string; conFechas: boolean; desde: string; hasta: string; conLimite: boolean; limite: string; activo: boolean };
export type ErroresCupon = Partial<Record<"codigo" | "valor" | "minimo" | "hasta" | "limite", string>>;

const num = (s: string) => Number(s.replace(",", "."));

/** Mensajes con punto final (Figma "Cupón · errores al guardar"). */
export function validarCupon(f: FormCupon, otros: Cupon[]): ErroresCupon {
  const e: ErroresCupon = {};
  if (!/^[A-Z0-9]{3,20}$/.test(f.codigo)) e.codigo = "Usa de 3 a 20 letras o números, sin espacios.";
  else if (otros.some((c) => c.codigo === f.codigo)) e.codigo = "Ya tienes un cupón con este código. Usa otro.";
  if (f.tipo === "porcentaje" && !(num(f.valor) > 0)) e.valor = "Escribe el porcentaje de descuento.";
  else if (f.tipo === "porcentaje" && num(f.valor) > 100) e.valor = "El descuento no puede ser mayor a 100%.";
  if (f.tipo === "monto" && !(num(f.valor) > 0)) e.valor = "Escribe cuánto se descuenta.";
  if (f.conMinimo && !(num(f.minimo) > 0)) e.minimo = "Escribe el monto mínimo de compra.";
  if (f.conFechas && (!f.desde || !f.hasta)) e.hasta = "Elige las dos fechas.";
  else if (f.conFechas && f.hasta < f.desde) e.hasta = "La fecha de fin tiene que ser después de la de inicio.";
  if (f.conLimite && !(Number.isInteger(num(f.limite)) && num(f.limite) > 0)) e.limite = "Escribe cuántas veces se puede usar.";
  return e;
}

export function aCupon(f: FormCupon, base: Pick<Cupon, "id" | "usos">): Cupon {
  return {
    ...base,
    codigo: f.codigo,
    tipo: f.tipo,
    valor: f.tipo === "envio" ? undefined : num(f.valor),
    compraMinima: f.conMinimo ? num(f.minimo) : undefined,
    desde: f.conFechas ? f.desde : undefined,
    hasta: f.conFechas ? f.hasta : undefined,
    limiteUsos: f.conLimite ? num(f.limite) : undefined,
    activo: f.activo,
  };
}

export const aForm = (c?: Cupon): FormCupon => ({
  codigo: c?.codigo ?? "",
  tipo: c?.tipo ?? "porcentaje",
  valor: c?.valor ? String(c.valor) : "",
  conMinimo: Boolean(c?.compraMinima),
  minimo: c?.compraMinima ? String(c.compraMinima) : "",
  conFechas: Boolean(c?.desde || c?.hasta),
  desde: c?.desde ?? "",
  hasta: c?.hasta ?? "",
  conLimite: Boolean(c?.limiteUsos),
  limite: c?.limiteUsos ? String(c.limiteUsos) : "",
  activo: c?.activo ?? true,
});

/**
 * ¿Se puede usar en el carrito? (Figma C3b y C5). `envioGratisYa`: el pedido ya llega al envío gratis
 * por monto, así que un cupón de envío gratis no suma nada.
 */
export function usarEnCarrito(codigo: string, lista: Cupon[], productos: number, envioGratisYa: boolean, hoy: string): { ok: true; cupon: Cupon } | { ok: false; error: string } {
  const limpio = codigo.trim().toUpperCase();
  if (!limpio) return { ok: false, error: "Escribe el código de tu cupón." };
  const c = lista.find((x) => x.codigo === limpio);
  const estado = c && estadoCupon(c, hoy);
  if (!c || estado === "vencido" || estado === "pausado" || estado === "agotado") return { ok: false, error: "Este cupón no existe o ya venció. Revisa cómo lo escribiste." };
  if (estado === "programado" && c.desde) return { ok: false, error: `Este cupón empieza el ${diaCorto(c.desde)}.` };
  if (c.compraMinima && productos < c.compraMinima) return { ok: false, error: `Este cupón funciona en compras desde ${formatoSoles(c.compraMinima)}.` };
  if (c.tipo === "envio" && envioGratisYa) return { ok: false, error: "Tu pedido ya cuenta con envío gratis automático, así que no necesitas este cupón." };
  return { ok: true, cupon: c };
}
