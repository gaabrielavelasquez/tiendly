import type { ConfigCompra, IdZona } from "@/features/configuracion/types";
import type { Distrito, ReglasCompra } from "../types";

// Reglas de compra que ve el cliente. Salen de lo que la tienda configuró en Configuración → Pagos y
// Entregas (módulo 2): este archivo solo sabe de geografía y de cómo traducir esa configuración.

/** Horas que se separan los productos de un pedido por WhatsApp (decisión 0010). */
export const HORAS_RESERVA = 24;

type Lugar = { nombre: string; lugar: string; zona: IdZona };
const lima = ["Barranco", "Breña", "Chorrillos", "Jesús María", "La Molina", "La Victoria", "Lince", "Magdalena del Mar", "Miraflores", "Pueblo Libre", "San Borja", "San Isidro", "San Miguel", "Santiago de Surco", "Surquillo"];
const callao = ["Callao", "Bellavista", "La Perla", "Ventanilla"];
const GEOGRAFIA: Lugar[] = [
  ...lima.map((nombre) => ({ nombre, lugar: "Lima", zona: "lima" as const })),
  ...callao.map((nombre) => ({ nombre, lugar: "Callao", zona: "callao" as const })),
  { nombre: "Cayma", lugar: "Arequipa, Arequipa", zona: "provincias" },
  { nombre: "Yanahuara", lugar: "Arequipa, Arequipa", zona: "provincias" },
  { nombre: "Cayaltí", lugar: "Chiclayo, Lambayeque", zona: "provincias" },
  { nombre: "Trujillo", lugar: "Trujillo, La Libertad", zona: "provincias" },
  { nombre: "Cusco", lugar: "Cusco, Cusco", zona: "provincias" },
  { nombre: "Piura", lugar: "Piura, Piura", zona: "provincias" },
];

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
