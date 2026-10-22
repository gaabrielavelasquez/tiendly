import { esHeather } from "@/lib/datos/semillas";
import type { DatosTienda } from "@/lib/datos/tienda";
import { datosPanel } from "@/lib/sesion";
import { obtenerPedidos } from "@/features/pedidos/lib/mock";
import { obtenerProductos } from "@/features/productos/lib/mock";
import type { Escenario, InicioData, Paso } from "../types";
import { urlTienda } from "@/lib/link-tienda";
import { actividadDe } from "./datos";

// Datos simulados hasta tener backend. Se elige el escenario con ?escenario= en /panel.
// "actividad" (por defecto) se arma con los pedidos y el catálogo reales del servidor (ver datos.ts).

const TIENDA = { nombre: "", slug: "", link: "" }; // la tienda de la sesión y su link los pone obtenerInicio
const AHORA = "2026-10-15T18:30:00-05:00";

type Hechos = Record<Paso["id"], boolean>;
const todos = (n: number): Hechos => ({ producto: n > 0, pagos: n > 1, entregas: n > 2, compartir: n > 3 });

/** `producto`: el primero del catálogo, para "Hecho: …". */
const pasos = (hechos: Hechos, producto = "Chloé"): Paso[] =>
  [
    {
      id: "producto",
      titulo: "Agrega tu primer producto",
      descripcion: hechos.producto ? `Hecho: ${producto}.` : "Con foto, precio y tallas ya se puede vender.",
      href: "/panel/productos/nuevo",
    },
    {
      id: "pagos",
      titulo: "Elige cómo te pagan",
      descripcion: "Pedidos por WhatsApp ya está activo. Suma tarjeta y Yape cuando quieras.",
      href: "/panel/configuracion/pagos",
    },
    { id: "entregas", titulo: "Define cómo entregas", descripcion: "Delivery por zona o recojo en tienda.", href: "/panel/configuracion/entregas" },
    {
      id: "compartir",
      titulo: "Comparte el link de tu tienda",
      descripcion: "Mándalo por WhatsApp o ponlo en tu Instagram.",
      href: "/panel/mi-tienda",
    },
  ].map((p) => ({ ...p, id: p.id as Paso["id"], hecho: hechos[p.id as Paso["id"]] }));

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
  pasos: pasos(todos(4)),
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
    pasos: pasos(todos(1)),
  },
};

export function leerEscenario(valor: string | string[] | undefined): Escenario {
  const v = Array.isArray(valor) ? valor[0] : valor;
  return v === "al-dia" || v === "nueva" || v === "error" ? v : "actividad";
}

/**
 * Tiendas sin datos de demo (la ficticia de Vercel y las del onboarding): todo sale de sus datos reales.
 * Mientras falte un paso, Inicio muestra "Pasos para arrancar"; con los 4 (o con el primer pedido), la actividad.
 */
async function deSusDatos(tienda: InicioData["tienda"], d: DatosTienda): Promise<InicioData> {
  const [pedidos, catalogo] = await Promise.all([obtenerPedidos("pedidos", tienda.slug), obtenerProductos("catalogo", tienda.slug)]);
  const semana = SEMANA.map((x) => ({ ...x, monto: x.monto === null ? null : 0, pedidos: 0 }));
  return {
    tienda,
    ahora: AHORA,
    ...actividadDe(pedidos, catalogo, AHORA, semana),
    semanaPasadaTotal: 0,
    pasos: pasos({ producto: catalogo.length > 0, ...d.tienda.hechos }, catalogo.at(-1)?.nombre),
  };
}

/** Inicio de la tienda del panel. Heather (demo local) suma su historia de la semana y los escenarios de prueba. */
export async function obtenerInicio(escenario: Escenario): Promise<InicioData> {
  if (escenario === "error") throw new Error("No se pudo cargar Inicio (simulado).");
  const d = await datosPanel();
  const { nombre, slug, duena } = d.tienda;
  const tienda = { nombre, slug, duena, link: await urlTienda(slug) };
  if (!esHeather(slug)) return deSusDatos(tienda, d);
  if (escenario !== "actividad") return { ...ESCENARIOS[escenario], tienda };
  const [pedidos, catalogo] = await Promise.all([obtenerPedidos("pedidos", slug), obtenerProductos("catalogo", slug)]);
  return { ...ACTIVIDAD, ...actividadDe(pedidos, catalogo, AHORA, SEMANA), tienda };
}
