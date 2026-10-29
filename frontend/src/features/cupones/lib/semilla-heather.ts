import type { Cupon } from "../types";

// Cupones de Heather (Figma, módulo 3): tienda de demo local.

export const CUPONES_HEATHER: Cupon[] = [
  { id: "c1", codigo: "BIENVENIDA10", tipo: "porcentaje", valor: 10, compraMinima: 100, hasta: "2026-10-31", usos: 12, activo: true },
  { id: "c2", codigo: "ENVIOGRATIS", tipo: "envio", compraMinima: 200, desde: "2026-11-01", usos: 0, activo: true },
  { id: "c3", codigo: "ANDREAXHEATHER", tipo: "monto", valor: 30, usos: 4, activo: false },
  { id: "c4", codigo: "PRIMERAS50", tipo: "porcentaje", valor: 15, limiteUsos: 50, usos: 50, activo: true },
  { id: "c5", codigo: "VERANO20", tipo: "porcentaje", valor: 20, desde: "2026-09-01", hasta: "2026-09-30", usos: 48, activo: true },
];
/** Solo para el escenario "limite" (?escenario=limite). */
export const NAVIDAD: Cupon = { id: "c6", codigo: "NAVIDAD15", tipo: "porcentaje", valor: 15, hasta: "2026-12-25", usos: 0, activo: true };

