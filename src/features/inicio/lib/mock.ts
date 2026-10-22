import { tiendaActual } from "@/lib/sesion";
import { obtenerPedidos } from "@/features/pedidos/lib/mock";
import { obtenerProductos } from "@/features/productos/lib/mock";
import type { Escenario, InicioData, Paso } from "../types";
import { actividadDe } from "./datos";

// Datos simulados hasta tener backend. Se elige el escenario con ?escenario= en /panel.
// "actividad" (por defecto) se arma con los pedidos y el catálogo reales del servidor (ver datos.ts).

const TIENDA = tiendaActual;
const AHORA = "2026-10-15T18:30:00-05:00";

const pasos = (hechos: number): Paso[] =>
  [
    { id: "producto", titulo: "Agrega tu primer producto", descripcion: "Hecho: Chloé.", href: "/panel/productos/nuevo" },
    {
      id: "pagos",
      titulo: "Elige cómo te pagan",
      descripcion: "Pedidos por WhatsApp ya está activo. Suma tarjeta y Yape cuando quieras.",
      href: "/panel/pagos",
    },
    { id: "entregas", titulo: "Define cómo entregas", descripcion: "Delivery por zona o recojo en tienda.", href: "/panel/entregas" },
    {
      id: "compartir",
      titulo: "Comparte el link de tu tienda",
      descripcion: "Mándalo por WhatsApp o ponlo en tu Instagram.",
      href: "/panel/mi-tienda",
    },
  ].map((p, i) => ({ ...p, id: p.id as Paso["id"], hecho: i < hechos }));

const SEMANA = [
  { fecha: "2026-10-12", monto: 1450, pedidos: 4 },
  { fecha: "2026-10-13", monto: 2210, pedidos: 6 },
  { fecha: "2026-10-14", monto: 1700, pedidos: 4 },
  { fecha: "2026-10-15", monto: 1816, pedidos: 4 },
  { fecha: "2026-10-16", monto: null, pedidos: 0 },
  { fecha: "2026-10-17", monto: null, pedidos: 0 },
  { fecha: "2026-10-18", monto: null, pedidos: 0 },
];

const ACTIVIDAD: InicioData = {
  tienda: TIENDA,
  ahora: AHORA,
  // El último no está pagado: no suma en "Hoy".
  pedidosHoy: [
    { monto: 712, pagado: true, entrega: "delivery", enviado: false },
    { monto: 382, pagado: true, entrega: "delivery", enviado: false },
    { monto: 330, pagado: true, entrega: "recojo", enviado: false },
    { monto: 392, pagado: true, entrega: "delivery", enviado: true },
    { monto: 422, pagado: false, entrega: "delivery", enviado: false },
  ],
  reservas: [{ venceEl: "2026-10-15T20:10:00-05:00" }, { venceEl: "2026-10-15T22:45:00-05:00" }, { venceEl: "2026-10-16T11:00:00-05:00" }],
  productos: [
    { nombre: "Chloé", stock: 6 },
    { nombre: "Botines Sophie", stock: 0 },
  ],
  semana: SEMANA,
  semanaPasadaTotal: 6410,
  pasos: pasos(4),
};

const ESCENARIOS: Record<Exclude<Escenario, "error">, InicioData> = {
  actividad: ACTIVIDAD,
  "al-dia": {
    ...ACTIVIDAD,
    pedidosHoy: ACTIVIDAD.pedidosHoy.map((p) => ({ ...p, enviado: true })),
    reservas: [],
    productos: [{ nombre: "Chloé", stock: 6 }],
  },
  nueva: {
    tienda: TIENDA,
    ahora: AHORA,
    pedidosHoy: [],
    reservas: [],
    productos: [{ nombre: "Chloé", stock: 4 }],
    semana: SEMANA.map((d) => ({ ...d, monto: d.monto === null ? null : 0, pedidos: 0 })),
    semanaPasadaTotal: 0,
    pasos: pasos(1),
  },
};

export function leerEscenario(valor: string | string[] | undefined): Escenario {
  const v = Array.isArray(valor) ? valor[0] : valor;
  return v === "al-dia" || v === "nueva" || v === "error" ? v : "actividad";
}

/** Simula la llamada al backend: tarda un poco (se ve el esqueleto) y puede fallar. */
export async function obtenerInicio(escenario: Escenario): Promise<InicioData> {
  await new Promise((r) => setTimeout(r, 600));
  if (escenario === "error") throw new Error("No se pudo cargar Inicio (simulado).");
  if (escenario !== "actividad") return ESCENARIOS[escenario];
  const [pedidos, catalogo] = await Promise.all([obtenerPedidos("pedidos"), obtenerProductos("catalogo")]);
  return { ...ACTIVIDAD, ...actividadDe(pedidos, catalogo, AHORA, SEMANA) };
}

