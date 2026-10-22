import type { Cupon, Escenario } from "../types";

// Cupones simulados de Heather (Figma, módulo 3) en la memoria del servidor. El checkout los valida
// al aplicarlos y suma un uso cuando se crea el pedido.

const INICIALES: Cupon[] = [
  { id: "c1", codigo: "BIENVENIDA10", tipo: "porcentaje", valor: 10, compraMinima: 100, hasta: "2026-10-31", usos: 12, activo: true },
  { id: "c2", codigo: "ENVIOGRATIS", tipo: "envio", compraMinima: 200, desde: "2026-11-01", usos: 0, activo: true },
  { id: "c3", codigo: "ANDREAXHEATHER", tipo: "monto", valor: 30, usos: 4, activo: false },
  { id: "c4", codigo: "PRIMERAS50", tipo: "porcentaje", valor: 15, limiteUsos: 50, usos: 50, activo: true },
  { id: "c5", codigo: "VERANO20", tipo: "porcentaje", valor: 20, desde: "2026-09-01", hasta: "2026-09-30", usos: 48, activo: true },
];
const NAVIDAD: Cupon = { id: "c6", codigo: "NAVIDAD15", tipo: "porcentaje", valor: 15, hasta: "2026-12-25", usos: 0, activo: true };

const g = globalThis as typeof globalThis & { __tiendlyCupones?: Cupon[] };
const almacen = () => (g.__tiendlyCupones ??= INICIALES.map((c) => ({ ...c })));

export const cuponesActuales = (): Cupon[] => almacen().map((c) => ({ ...c }));

export function guardarCupon(c: Cupon) {
  const lista = almacen();
  const i = lista.findIndex((x) => x.id === c.id);
  if (i >= 0) lista[i] = { ...c };
  else lista.unshift({ ...c });
}

export function eliminarCupon(id: string) {
  g.__tiendlyCupones = almacen().filter((c) => c.id !== id);
}

/** Suma un uso al crear un pedido con el cupón (puede pasar a "Agotado"). */
export function sumarUso(codigo: string) {
  const c = almacen().find((x) => x.codigo === codigo);
  if (c) c.usos += 1;
}

export function leerEscenario(v: string | string[] | undefined): Escenario {
  const e = Array.isArray(v) ? v[0] : v;
  return e === "vacio" || e === "limite" || e === "error" ? e : "cupones";
}

export async function obtenerCupones(escenario: Escenario = "cupones"): Promise<Cupon[]> {
  await new Promise((r) => setTimeout(r, 400));
  if (escenario === "error") throw new Error("No se pudo cargar Cupones (simulado).");
  if (escenario === "vacio") return [];
  return escenario === "limite" ? [NAVIDAD, ...cuponesActuales()] : cuponesActuales();
}
