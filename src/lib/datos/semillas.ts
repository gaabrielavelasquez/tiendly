import { CONFIG_HEATHER } from "@/features/configuracion/lib/semilla-heather";
import type { ConfigCompra } from "@/features/configuracion/types";
import { CUPONES_HEATHER } from "@/features/cupones/lib/semilla-heather";
import type { RubroId } from "@/features/onboarding/lib/rubros";
import { CATALOGO_HEATHER } from "@/features/productos/lib/catalogo-heather";
import type { Producto } from "@/features/productos/types";
import { MODELOS_AURORA } from "./aurora";
import type { DatosTienda } from "./tienda";

// Datos de partida: la tienda de demo y las tiendas nuevas del onboarding.

/**
 * La tienda de demo: Heather en local; en Vercel, Aurora Calzado (ficticia), porque Heather todavía no dio
 * permiso para publicar su tienda. `TIENDLY_TIENDA_DEMO` la fija a mano.
 */
export const slugDemo = () => process.env.TIENDLY_TIENDA_DEMO ?? (process.env.VERCEL ? "aurora" : "heather");

/** Contenido propio de Heather (portada, fotos, beneficios, pedidos de demo): solo en su tienda. */
export const esHeather = (slug: string) => slug === "heather";

const TALLAS = ["35", "36", "37", "38", "39", "40"];
const modelo = (id: string, nombre: string, categoria: Producto["categorias"][number], precio: number, stock: Record<string, number[]>): Producto => ({
  id, nombre, categorias: [categoria], estado: "activo", precio,
  variantes: Object.entries(stock).flatMap(([color, s]) => TALLAS.map((talla, i) => ({ color, talla, stock: s[i] ?? 0 }))),
});

/** Aurora Calzado: tienda ficticia, con las fotos de public/aurora (las mismas de la vista previa del registro). */
function aurora(): DatosTienda {
  const config: ConfigCompra = structuredClone(CONFIG_HEATHER);
  config.pagos.whatsapp.celular = "900000000";
  config.pagos.cobros = { estado: "activo", tarjeta: true, yape: true, cuenta: { banco: "BCP", tipo: "Cuenta corriente", ultimos4: "0000", titular: "AURORA CALZADO (DEMO)" } };
  config.entregas.recojo.activo = false;
  return {
    tienda: { nombre: "Aurora Calzado", slug: "aurora", celularVentas: "900000000", plan: "free", hechos: { pagos: true, entregas: true, compartir: true } },
    productos: MODELOS_AURORA.map((m) => ({
      ...modelo(m.id, m.nombre, m.categoria, m.precio, { [m.color]: [...m.stock] }),
      descripcion: m.descripcion,
      imagen: m.foto,
      fotos: { [m.color]: [m.foto] },
    })),
    pedidos: { ultimo: 1000, creados: [] },
    inventario: {},
    cupones: [],
    config,
    rubros: ["calzado"],
  };
}

function heather(): DatosTienda {
  return {
    tienda: { nombre: "Heather", slug: "heather", duena: "Cecilia", celularVentas: "987654321", logo: "/heather/logo-heather-wordmark.png", plan: "pro", hechos: { pagos: true, entregas: true, compartir: true } },
    productos: structuredClone(CATALOGO_HEATHER),
    pedidos: { ultimo: 1047, creados: [] }, // los pedidos #TL-1035 a #TL-1047 son de demo (pedidos/lib/mock)
    inventario: {},
    cupones: structuredClone(CUPONES_HEATHER),
    config: structuredClone(CONFIG_HEATHER),
    rubros: ["calzado", "accesorios"],
  };
}

export const semillaDemo = () => (slugDemo() === "heather" ? heather() : aurora());

type Nueva = { nombre: string; slug: string; celularVentas: string; rubros: RubroId[]; duena?: string };

/**
 * Tienda nueva (onboarding): Pedidos por WhatsApp activo con su número; nada más. Sin zonas de delivery
 * (cualquier precio sería inventado) ni recojo: "Define cómo entregas" queda pendiente en Inicio y, mientras
 * tanto, el checkout ofrece "Coordinar la entrega por WhatsApp". Sin cobros automáticos hasta afiliarse.
 */
export function tiendaNueva(t: Nueva): DatosTienda {
  const zona = (id: "lima" | "callao" | "provincias") => ({ id, activa: false, costo: "", plazo: "" });
  return {
    tienda: { nombre: t.nombre, slug: t.slug, duena: t.duena, celularVentas: t.celularVentas, plan: "free", hechos: { pagos: false, entregas: false, compartir: false } },
    productos: [],
    pedidos: { ultimo: 1000, creados: [] },
    inventario: {},
    cupones: [],
    config: {
      pagos: { whatsapp: { activo: true, celular: t.celularVentas }, cobros: { estado: "sin-activar", tarjeta: false, yape: false } },
      entregas: {
        delivery: { activo: false, zonas: [zona("lima"), zona("callao"), zona("provincias")], envioGratis: { activo: false, desde: "" } },
        recojo: { activo: false, direccion: "", distrito: "", horario: "", nota: "" },
      },
    },
    rubros: t.rubros,
  };
}
