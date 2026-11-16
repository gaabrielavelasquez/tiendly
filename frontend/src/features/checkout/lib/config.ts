import { DISTRICT_ZONES, type ShippingZone } from "@tiendly/contracts";
import type { ConfigCompra, IdZona } from "@/features/configuracion/types";
import type { Distrito, ReglasCompra } from "../types";

// Reglas de compra que ve el cliente. Salen de lo que la tienda configuró en Configuración → Pagos y
// Entregas (módulo 2): la geografía vive en @tiendly/contracts y acá solo se traduce esa configuración.

/** Horas que se separan los productos de un pedido por WhatsApp (decisión 0010). */
export const HORAS_RESERVA = 24;

// IdZona debe seguir siendo exactamente ShippingZone (la zona es un dato de contracts desde ahora):
// si alguna de las dos cambia, este chequeo a nivel de tipos deja de compilar.
type ZonaCoincide = [IdZona] extends [ShippingZone] ? ([ShippingZone] extends [IdZona] ? true : never) : never;
const zonaCoincide: ZonaCoincide = true;

type Lugar = { nombre: string; lugar: string; zona: IdZona };
/** Etiqueta visible por distrito; el distrito y su zona vienen de DISTRICT_ZONES en @tiendly/contracts. */
const LUGARES: Record<keyof typeof DISTRICT_ZONES, string> = {
  Barranco: "Lima", "Breña": "Lima", Chorrillos: "Lima", "Jesús María": "Lima", "La Molina": "Lima",
  "La Victoria": "Lima", Lince: "Lima", "Magdalena del Mar": "Lima", Miraflores: "Lima",
  "Pueblo Libre": "Lima", "San Borja": "Lima", "San Isidro": "Lima", "San Miguel": "Lima",
  "Santiago de Surco": "Lima", Surquillo: "Lima",
  Callao: "Callao", Bellavista: "Callao", "La Perla": "Callao", Ventanilla: "Callao",
  Cayma: "Arequipa, Arequipa", Yanahuara: "Arequipa, Arequipa", "Cayaltí": "Chiclayo, Lambayeque",
  Trujillo: "Trujillo, La Libertad", Cusco: "Cusco, Cusco", Piura: "Piura, Piura",
};
// El orden de DISTRICT_ZONES (lima, callao, provincias) es el orden que ve el cliente en el checkout.
const GEOGRAFIA: Lugar[] = (Object.entries(DISTRICT_ZONES) as [keyof typeof DISTRICT_ZONES, ShippingZone][]).map(
  ([nombre, zona]) => ({ nombre, lugar: LUGARES[nombre], zona }),
);

const monto = (s: string) => Number(s.replace(",", "."));

/** Traduce la configuración de la tienda a lo que el checkout necesita (todo serializable). */
export function reglasCompra({ pagos, entregas }: ConfigCompra): ReglasCompra {
  const { delivery, recojo } = entregas;
  const zonas = delivery.activo ? delivery.zonas.filter((z) => z.activa && monto(z.costo) >= 0 && z.costo.trim() !== "") : [];
  const distritos: Distrito[] = GEOGRAFIA.flatMap((g) => {
    const z = zonas.find((x) => x.id === g.zona);
    return z ? [{ nombre: g.nombre, lugar: g.lugar, zona: g.zona, costo: monto(z.costo), plazo: z.plazo }] : [];
  });
  const cobros = pagos.cobros.estado === "activo";
  return {
    celular: pagos.whatsapp.celular,
    pagos: { tarjeta: cobros && pagos.cobros.tarjeta, yape: cobros && pagos.cobros.yape, whatsapp: pagos.whatsapp.activo },
    envioGratisDesde: delivery.activo && delivery.envioGratis.activo && monto(delivery.envioGratis.desde) > 0 ? monto(delivery.envioGratis.desde) : null,
    delivery: distritos.length ? { distritos, soloLima: zonas.length === 1 && zonas[0].id === "lima" } : null,
    recojo: recojo.activo ? { direccion: recojo.direccion, distrito: recojo.distrito, horario: recojo.horario, nota: recojo.nota } : null,
    coordinar: !distritos.length && !recojo.activo && pagos.whatsapp.activo,
  };
}
