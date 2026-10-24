import { CONFIG_HEATHER } from "@/features/configuracion/lib/semilla-heather";
import type { ConfigCompra } from "@/features/configuracion/types";
import { CUPONES_HEATHER } from "@/features/cupones/lib/semilla-heather";
import type { RubroId } from "@/features/onboarding/lib/rubros";
import { CATALOGO_HEATHER } from "@/features/productos/lib/catalogo-heather";
import type { Producto } from "@/features/productos/types";
import { colorPorTalla } from "@/features/productos/lib/variantes";
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
/** Sin `tallas` (carteras y bolsos), el producto tiene solo la opción Color y `stock` es una cantidad. */
const DETALLE_MUNA: Record<string, { id: string; categoria: string; color: string; tallas?: string[]; stock: number[]; descripcion: string }> = {
  "Botín Saya": { id: "m1", categoria: "Botas", color: "Camel (gamuza)", tallas: ["35", "36", "37", "38", "39", "40"], stock: [1, 2, 3, 2, 1, 0],
    descripcion: "Botín de punta fina en gamuza camel o cuero vino. Va con jean, con falda y con vestido." },
  "Chompa Qori": { id: "m2", categoria: "Ropa", color: "Oliva", tallas: ["S", "M", "L"], stock: [2, 3, 1],
    descripcion: "Chompa tejida de cuello alto con medio cierre. Abriga sin pesar y no pica." },
  "Falda Lluvia": { id: "m3", categoria: "Ropa", color: "Plata", tallas: ["S", "M", "L"], stock: [1, 2, 2],
    descripcion: "Falda midi de lentejuelas que se mueve al caminar. Forrada por dentro, con elástico en la cintura." },
  "Traje Arena": { id: "m4", categoria: "Ropa", color: "Arena", tallas: ["S", "M", "L"], stock: [2, 2, 1],
    descripcion: "Chaqueta corta de drill con cuello camisero y pantalón ancho de tiro alto. Se venden juntos." },
  "Bolso Puyu": { id: "m5", categoria: "Accesorios", color: "Gris", stock: [4],
    descripcion: "Bolso acolchado de cuero sintético con cadena dorada. Entran el celular, la billetera y las llaves." },
  "Cartera Wari": { id: "m6", categoria: "Accesorios", color: "Vino", stock: [3],
    descripcion: "Cartera de cuero vino con correa regulable y hebilla plateada. Se lleva al hombro o cruzada." },
  "Guantes Killa": { id: "m7", categoria: "Accesorios", color: "Burdeos", tallas: ["S", "M", "L"], stock: [2, 3, 1],
    descripcion: "Guantes de cuero burdeos, suaves y flexibles. Un abrigo ligero para los días frescos." },
  "Slingback Inti": { id: "m8", categoria: "Tacos", color: "Burdeos", tallas: ["35", "36", "37", "38", "39"], stock: [1, 2, 3, 2, 0],
    descripcion: "Zapatos de charol burdeos con punta fina y tira posterior. Un toque de brillo para tus planes de día o de noche." },
};

const fotoMuna = (archivo: string) => `/tiendas-ejemplo/muna/${archivo}.webp`;
const galeriaMuna = (base: string, cantidad: number) => Array.from({ length: cantidad }, (_, i) => fotoMuna(`${base}-${i + 1}`));

/** MUÑA: la tienda de demo pública (moda, ficticia). Mismos productos y fotos que la vista previa del registro. */
function muna(): DatosTienda {
  const ejemplo = TIENDAS_EJEMPLO.find((t) => t.slug === "muna")!;
  const config: ConfigCompra = structuredClone(CONFIG_HEATHER);
  config.pagos.whatsapp.celular = "900000000";
  config.pagos.cobros = { estado: "activo", tarjeta: true, yape: true, cuenta: { banco: "BCP", tipo: "Cuenta corriente", ultimos4: "0000", titular: "MUÑA (DEMO)" } };
  config.entregas.recojo.activo = false;
  return {
    tienda: { nombre: ejemplo.nombre, slug: ejemplo.slug, celularVentas: "900000000", plan: "free", hechos: { pagos: true, entregas: true, compartir: true } },
    productos: ejemplo.productos.map((p): Producto => {
      const d = DETALLE_MUNA[p.nombre];
      return {
        id: d.id, nombre: p.nombre, descripcion: d.descripcion, categorias: [d.categoria], estado: "activo", precio: p.precio,
        ...(d.tallas
          ? colorPorTalla({ [d.color]: d.stock }, d.tallas)
          : { opciones: [{ nombre: "Color", tipo: "color" as const, valores: [d.color] }], variantes: [{ valores: [d.color], stock: d.stock[0] ?? 0 }] }),
        // La falda conserva su oferta: antes S/ 249, ahora S/ 199, sin fechas.
        ...(p.nombre === "Falda Lluvia" ? { precio: 199, precioAntes: p.precio } : {}),
        imagen: p.foto, fotos: { [d.color]: [p.foto] },
        ...(d.id === "m1" ? {
          ...colorPorTalla({ "Camel (gamuza)": d.stock, "Vino (cuero)": [1, 2, 2, 1, 0, 0] }, d.tallas!),
          opcionFotos: 0, fotos: { "Camel (gamuza)": galeriaMuna("botin-camel", 3), "Vino (cuero)": galeriaMuna("botin-vino", 2) },
        } : {}),
        ...(d.id === "m6" ? { fotos: { [d.color]: [p.foto, fotoMuna("bolso-detalle")] } } : {}),
        ...(d.id === "m7" ? { fotos: { [d.color]: galeriaMuna("guantes", 3) } } : {}),
        ...(d.id === "m8" ? { fotos: { [d.color]: galeriaMuna("slingback", 3) } } : {}),
      };
    }),
    pedidos: { ultimo: 1000, creados: [] },
    inventario: {},
    cupones: [],
    config,
    rubros: ["accesorios", "calzado", "moda"],
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

/** Glow Labo (skincare y maquillaje, tema Suave): tienda de ejemplo con opciones Tono y Tamaño y dos ofertas activas. */
function glowLabo(): DatosTienda {
  const ejemplo = TIENDAS_EJEMPLO.find((t) => t.slug === "glow-labo")!;
  const foto = (n: string) => ejemplo.productos.find((p) => p.nombre === n)!.foto;
  const config: ConfigCompra = structuredClone(CONFIG_HEATHER);
  config.pagos.whatsapp.celular = "900000001";
  config.pagos.cobros = { estado: "activo", tarjeta: true, yape: true, cuenta: { banco: "BCP", tipo: "Cuenta corriente", ultimos4: "0001", titular: "GLOW LABO (DEMO)" } };
  config.entregas.recojo.activo = false;
  const conOpcion = (nombre: string, valores: string[], stock: number[]) => ({
    opciones: [{ nombre, tipo: "otra" as const, valores }], variantes: valores.map((v, i) => ({ valores: [v], stock: stock[i] ?? 0 })),
  });
  const productos: Producto[] = [
    { id: "g1", nombre: "BB cream Nube", categorias: ["Maquillaje"], estado: "activo", precio: 55, precioAntes: 75, ...conOpcion("Tono", ["Claro", "Medio", "Canela"], [3, 5, 0]),
      descripcion: "BB cream de cobertura ligera con SPF 30. Unifica el tono sin sentirse pesada.", imagen: foto("BB cream Nube"), fotos: { "": [foto("BB cream Nube")] } },
    { id: "g2", nombre: "Aceite Kiwano", categorias: ["Skincare"], estado: "activo", precio: 79, precioAntes: 98, ...conOpcion("Tamaño", ["15 ml", "30 ml"], [6, 4]),
      descripcion: "Aceite facial de semilla de kiwano. Nutre de noche y deja la piel suave por la mañana.", imagen: foto("Aceite Kiwano"), fotos: { "": [foto("Aceite Kiwano")] } },
    { id: "g3", nombre: "Base Piel", categorias: ["Maquillaje"], estado: "activo", precio: 119, ...conOpcion("Tono", ["02", "04", "06"], [2, 3, 1]),
      descripcion: "Base líquida de larga duración, acabado natural. Tres tonos pensados para piel latina.", imagen: foto("Base Piel"), fotos: { "": [foto("Base Piel")] } },
    { id: "g4", nombre: "Jabón Avena", categorias: ["Cuerpo"], estado: "activo", precio: 29, opciones: [], variantes: [{ valores: [], stock: 20 }],
      descripcion: "Jabón artesanal de avena y miel. Para piel sensible, sin perfume agregado.", imagen: foto("Jabón Avena"), fotos: { "": [foto("Jabón Avena")] } },
  ];
  return {
    tienda: { nombre: ejemplo.nombre, slug: ejemplo.slug, celularVentas: "900000001", plan: "free", nombreOfertas: "Cyber Wow", hechos: { pagos: true, entregas: true, compartir: true } },
    productos, pedidos: { ultimo: 1000, creados: [] }, inventario: {}, cupones: [], config, rubros: ["belleza"],
  };
}

/** Tiendas de ejemplo que existen de verdad en todos los entornos (además de la demo): se crean la primera vez que se piden. */
const EJEMPLOS: Record<string, () => DatosTienda> = { "glow-labo": glowLabo };

/** La semilla de una tienda (demo o ejemplo), o null si no es una de ellas. */
export const semillaDe = (slug: string) => (slug === slugDemo() ? semillaDemo() : EJEMPLOS[slug]?.() ?? null);
export const esEjemplo = (slug: string) => slug === slugDemo() || slug in EJEMPLOS;

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
