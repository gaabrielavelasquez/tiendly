import { CONFIG_HEATHER } from "@/features/configuracion/lib/semilla-heather";
import type { ConfigCompra } from "@/features/configuracion/types";
import { CUPONES_HEATHER } from "@/features/cupones/lib/semilla-heather";
import type { RubroId } from "@/features/onboarding/lib/rubros";
import { CATALOGO_HEATHER } from "@/features/productos/lib/catalogo-heather";
import type { Producto } from "@/features/productos/types";
import type { DatosTienda } from "./tienda";
import { TIENDAS_EJEMPLO } from "./tiendas-ejemplo";

// Datos de partida: la tienda de demo y las tiendas nuevas del onboarding.

/**
 * La tienda de demo: Heather en local; en Vercel, MUÑA (ficticia, la misma de la vista previa del registro),
 * porque Heather todavía no dio permiso para publicar su tienda. `TIENDLY_TIENDA_DEMO` la fija a mano.
 */
export const slugDemo = () => process.env.TIENDLY_TIENDA_DEMO ?? (process.env.VERCEL ? "muna" : "heather");

/** Tiendas de demo retiradas: ya no existen aunque sigan guardadas (Aurora Calzado, reemplazada por MUÑA en 0033). */
export const RETIRADAS = new Set(["aurora"]);

/** Contenido propio de Heather (portada, fotos, beneficios, pedidos de demo): solo en su tienda. */
export const esHeather = (slug: string) => slug === "heather";

/** Datos de tienda de los productos de MUÑA (la vista previa del registro solo usa nombre, precio y foto). */
const DETALLE_MUNA: Record<string, { id: string; categoria: Producto["categorias"][number]; color: string; tallas: string[]; stock: number[]; descripcion: string }> = {
  "Botín Saya": { id: "m1", categoria: "botas", color: "Café", tallas: ["35", "36", "37", "38", "39", "40"], stock: [1, 2, 3, 2, 1, 0],
    descripcion: "Botín de cuero liso con punta fina y taco de 5 cm. Va con jean, con falda y con vestido." },
  "Chompa Qori": { id: "m2", categoria: "ropa", color: "Oliva", tallas: ["S", "M", "L"], stock: [2, 3, 1],
    descripcion: "Chompa tejida de cuello alto con medio cierre. Abriga sin pesar y no pica." },
  "Falda Lluvia": { id: "m3", categoria: "ropa", color: "Plata", tallas: ["S", "M", "L"], stock: [1, 2, 2],
    descripcion: "Falda midi de lentejuelas que se mueve al caminar. Forrada por dentro, con elástico en la cintura." },
};

/** MUÑA: la tienda de demo pública (moda, ficticia). Mismos productos y fotos que la vista previa del registro. */
function muna(): DatosTienda {
  const ejemplo = TIENDAS_EJEMPLO.find((t) => t.slug === "muna")!;
  const config: ConfigCompra = structuredClone(CONFIG_HEATHER);
  config.pagos.whatsapp.celular = "900000000";
  config.pagos.cobros = { estado: "activo", tarjeta: true, yape: true, cuenta: { banco: "BCP", tipo: "Cuenta corriente", ultimos4: "0000", titular: "MUÑA (DEMO)" } };
  config.entregas.recojo.activo = false;
  return {
    tienda: { nombre: ejemplo.nombre, slug: ejemplo.slug, celularVentas: "900000000", plan: "free", hechos: { pagos: true, entregas: true, compartir: true } },
    productos: ejemplo.productos.map((p) => {
      const d = DETALLE_MUNA[p.nombre];
      return {
        id: d.id, nombre: p.nombre, descripcion: d.descripcion, categorias: [d.categoria], estado: "activo", precio: p.precio,
        variantes: d.tallas.map((talla, i) => ({ color: d.color, talla, stock: d.stock[i] ?? 0 })),
        imagen: p.foto, fotos: { [d.color]: [p.foto] },
      };
    }),
    pedidos: { ultimo: 1000, creados: [] },
    inventario: {},
    cupones: [],
    config,
    rubros: ["moda", "calzado"],
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

export const semillaDemo = () => (slugDemo() === "heather" ? heather() : muna());

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
