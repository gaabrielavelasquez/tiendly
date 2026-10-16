import type { Cupon, Distrito } from "../types";

// Configuración de compra de la tienda (simulada). La define la tienda en Configuración → Pagos y Entregas
// (módulo 2); hasta entonces vive aquí. Al menos un método de pago activo siempre (Figma, módulo 1).

export const CONFIG_COMPRA = {
  envioGratisDesde: 700,
  /** Lima: precio fijo. Si la tienda envía a provincias, el costo depende del distrito (Figma E3). */
  enviaAProvincias: true,
  recojo: { direccion: "Calle Los Pinos 245", distrito: "Santiago de Surco", horario: "Lunes a sábado, de 10 a. m. a 7 p. m." },
  pagos: { tarjeta: true, yape: true, whatsapp: true },
  /** Horas que se separan los productos de un pedido por WhatsApp (decisión 0010). */
  horasReserva: 24,
};

export const CUPONES: Cupon[] = [
  { codigo: "BIENVENIDA10", tipo: "porcentaje", valor: 10 },
  { codigo: "ENVIOGRATIS", tipo: "envio" },
];

const LIMA = { zona: "Lima", costo: 15, plazo: "2 a 3 días hábiles" };
const lima = ["Barranco", "Jesús María", "La Molina", "Lince", "Magdalena del Mar", "Miraflores", "Pueblo Libre", "San Borja", "San Isidro", "San Miguel", "Santiago de Surco", "Surquillo"];

export const DISTRITOS: Distrito[] = [
  ...lima.map((nombre) => ({ nombre, ...LIMA })),
  { nombre: "Cayma", zona: "Arequipa, Arequipa", costo: 25, plazo: "3 a 5 días hábiles" },
  { nombre: "Yanahuara", zona: "Arequipa, Arequipa", costo: 25, plazo: "3 a 5 días hábiles" },
  { nombre: "Cayaltí", zona: "Chiclayo, Lambayeque", costo: 30, plazo: "4 a 6 días hábiles" },
  { nombre: "Trujillo", zona: "Trujillo, La Libertad", costo: 25, plazo: "3 a 5 días hábiles" },
  { nombre: "Cusco", zona: "Cusco, Cusco", costo: 30, plazo: "4 a 6 días hábiles" },
  { nombre: "Piura", zona: "Piura, Piura", costo: 30, plazo: "4 a 6 días hábiles" },
];
