import { esHeather } from "@/lib/datos/semillas";
import type { DatosTienda } from "@/lib/datos/tienda";
import { datosPanel } from "@/lib/sesion";
import { obtenerPedidos } from "@/features/pedidos/lib/mock";
import { obtenerProductos } from "@/features/productos/lib/mock";
import type { DiaVentas, Escenario, InicioData, Paso } from "../types";
import { urlTienda } from "@/lib/link-tienda";
import { ahoraIso, alPresente, semanaLima } from "@/lib/reloj";
import { actividadDe } from "./datos";

// Datos simulados hasta tener backend. Se elige el escenario con ?escenario= en /panel.
// "actividad" (por defecto) se arma con los pedidos y el catálogo reales del servidor (ver datos.ts).

const TIENDA = { nombre: "", slug: "", link: "" }; // la tienda de la sesión y su link los pone obtenerInicio

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

/**
 * Historia de la semana de Heather, contada hacia atrás desde hoy (ayer, anteayer… hasta 6 días), así la demo
 * siempre cae en la semana actual. "Hoy" no está: sale de los pedidos (actividadDe).
 */
const HISTORIA = [
  { monto: 1700, pedidos: 4 },
  { monto: 2210, pedidos: 6 },
  { monto: 1450, pedidos: 4 },
  { monto: 1980, pedidos: 5 },
  { monto: 1320, pedidos: 3 },
  { monto: 1540, pedidos: 4 },
];
/** Semana pasada de Heather, de lunes a domingo: se compara hasta el mismo día (lunes a jueves = 6,410). */
const SEMANA_PASADA = [1380, 1990, 1560, 1480, 2100, 2300, 1200];

/** Lunes a domingo de la semana actual en Lima. Días que no llegan en `null`; hoy en 0 (lo completan los pedidos). */
function semanaDe(ahora: string, conHistoria: boolean): DiaVentas[] {
  const { dias, hoy } = semanaLima(ahora);
  return dias.map((fecha, i) => {
    if (i > hoy) return { fecha, monto: null, pedidos: 0 };
    const previo = i < hoy && conHistoria ? HISTORIA[hoy - i - 1] : undefined;
    return { fecha, monto: previo?.monto ?? 0, pedidos: previo?.pedidos ?? 0 };
  });
}

const pasadaHastaHoy = (ahora: string) => SEMANA_PASADA.slice(0, semanaLima(ahora).hoy + 1).reduce((s, m) => s + m, 0);

/** Inicio de Heather con actividad, en el reloj real: las reservas de la demo se corren al presente. */
const actividad = (ahora: string): InicioData => ({
  tienda: TIENDA,
  ahora,
  // El último no está pagado: no suma en "Hoy".
  pedidosHoy: [
    { monto: 712, pagado: true, entrega: "delivery", enviado: false },
    { monto: 382, pagado: true, entrega: "delivery", enviado: false },
    { monto: 330, pagado: true, entrega: "recojo", enviado: false },
    { monto: 392, pagado: true, entrega: "delivery", enviado: true },
    { monto: 422, pagado: false, entrega: "delivery", enviado: false },
  ],
  reservas: ["2026-10-15T20:10:00-05:00", "2026-10-15T22:45:00-05:00", "2026-10-16T11:00:00-05:00"].map((v) => ({ venceEl: alPresente(v, ahora) })),
  productos: [
    { nombre: "Chloé", stock: 6 },
    { nombre: "Botines Sophie", stock: 0 },
  ],
  semana: semanaDe(ahora, true),
  semanaPasadaTotal: pasadaHastaHoy(ahora),
  pasos: pasos(todos(4)),
});

/** Escenarios de prueba (?escenario=, solo con herramientas de desarrollo). */
function escenarioDePrueba(e: Exclude<Escenario, "error" | "actividad">, ahora: string): InicioData {
  const base = actividad(ahora);
  if (e === "al-dia") {
    return { ...base, pedidosHoy: base.pedidosHoy.map((p) => ({ ...p, enviado: true })), reservas: [], productos: [{ nombre: "Chloé", stock: 6 }] };
  }
  return {
    tienda: TIENDA,
    ahora,
    pedidosHoy: [],
    reservas: [],
    productos: [{ nombre: "Chloé", stock: 4 }],
    semana: semanaDe(ahora, false),
    semanaPasadaTotal: 0,
    pasos: pasos(todos(1)),
  };
}
export function leerEscenario(valor: string | string[] | undefined): Escenario {
  const v = Array.isArray(valor) ? valor[0] : valor;
  return v === "al-dia" || v === "nueva" || v === "error" ? v : "actividad";
}

/**
 * Tiendas sin datos de demo (la ficticia de Vercel y las del onboarding): todo sale de sus datos reales.
 * Mientras falte un paso, Inicio muestra "Pasos para arrancar"; con los 4 (o con el primer pedido), la actividad.
 */
async function deSusDatos(tienda: InicioData["tienda"], d: DatosTienda, ahora: string): Promise<InicioData> {
  const [pedidos, catalogo] = await Promise.all([obtenerPedidos("pedidos", tienda.slug, ahora), obtenerProductos("catalogo", tienda.slug)]);
  return {
    tienda,
    ahora,
    ...actividadDe(pedidos, catalogo, ahora, semanaDe(ahora, false)),
    semanaPasadaTotal: 0,
    pasos: pasos({ producto: catalogo.length > 0, ...d.tienda.hechos }, catalogo.at(-1)?.nombre),
  };
}

/** Inicio de la tienda del panel. Heather (demo local) suma su historia de la semana y los escenarios de prueba. */
export async function obtenerInicio(escenario: Escenario): Promise<InicioData> {
  if (escenario === "error") throw new Error("No se pudo cargar Inicio (simulado).");
  const ahora = ahoraIso();
  const d = await datosPanel();
  const { nombre, slug, duena } = d.tienda;
  const tienda = { nombre, slug, duena, link: await urlTienda(slug) };
  if (!esHeather(slug)) return deSusDatos(tienda, d, ahora);
  if (escenario !== "actividad") return { ...escenarioDePrueba(escenario, ahora), tienda };
  const [pedidos, catalogo] = await Promise.all([obtenerPedidos("pedidos", slug, ahora), obtenerProductos("catalogo", slug)]);
  const base = actividad(ahora);
  return { ...base, ...actividadDe(pedidos, catalogo, ahora, base.semana), tienda };
}
