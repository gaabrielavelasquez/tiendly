import type { DetallePedido, ItemPedido } from "../types";

// Detalle simulado de cada pedido. Los ítems salen del catálogo (mismos precios y fotos que Productos) y
// subtotal + envío = total de la lista. Delivery en Lima entre S/ 10 y S/ 15; recojo sin costo.

const foto = (id: number) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=160&h=160&fit=crop`;
const CATALOGO = {
  vestido: { producto: "Vestido Chloé", precio: 189, foto: foto(6046220) },
  botines: { producto: "Botines Sophie", precio: 249, foto: foto(4786126) },
  blazer: { producto: "Blazer Amalia", precio: 229, foto: foto(12951783) },
  polo: { producto: "Polo básico oversize", precio: 69, foto: foto(4440567) },
  jean: { producto: "Jean mom fit", precio: 139, foto: foto(4109797) },
  sandalias: { producto: "Sandalias Lía", precio: 159, foto: foto(6862846) },
  cartera: { producto: "Cartera Bruna", precio: 199, foto: foto(6650001) },
  aretes: { producto: "Aretes Luna", precio: 59, foto: foto(18597841) },
  falda: { producto: "Falda plisada Inés", precio: 119, foto: foto(15240413) },
  top: { producto: "Top de lino Mar", precio: 89, foto: foto(4256573) },
} as const;

const it = (k: keyof typeof CATALOGO, variante: string, cantidad = 1): ItemPedido => ({ ...CATALOGO[k], variante, cantidad });
const h = (dia: number, hora: string) => `2026-10-${dia}T${hora}:00-05:00`;

export const DETALLES: Record<string, DetallePedido> = {
  "t-1047": { items: [it("botines", "Negro · 38"), it("sandalias", "Dorado · 37")], envio: 12, email: "valeria.quispe@gmail.com",
    direccion: "Av. José Larco 812, dpto. 501", referencia: "Frente al parque Kennedy.", pagadoEl: h(15, "17:55") },
  "t-1046": { items: [it("botines", "Camel · 37"), it("falda", "Verde oliva · S")], envio: 12, email: "camila.torres@outlook.com",
    direccion: "Calle Las Begonias 441", pagadoEl: h(15, "16:06") },
  "t-1045": { items: [it("blazer", "Crudo · M"), it("aretes", "Oro · Única")], envio: 0, pagadoEl: h(15, "14:45") },
  "t-1044": { items: [it("sandalias", "Dorado · 38"), it("aretes", "Plata · Única")], envio: 12, email: "lucia.fdz@gmail.com",
    direccion: "Jr. Monte Rosa 233", pagadoEl: h(15, "11:22"), enviadoEl: h(15, "15:40") },
  "t-1043": { items: [it("blazer", "Crudo · S"), it("polo", "Blanco · M")], envio: 12, email: "daniela.ruiz@gmail.com",
    direccion: "Av. Grau 315", referencia: "Casa de rejas verdes." },
  "t-1042": { items: [it("botines", "Negro · 37"), it("polo", "Negro · L"), it("cartera", "Chocolate · Única")], envio: 10,
    direccion: "Calle Los Fresnos 190, La Planicie", nota: "Pidió envolver la cartera para regalo." },
  "t-1041": { items: [it("aretes", "Oro · Única", 2), it("aretes", "Plata · Única")], envio: 12, direccion: "Av. Salaverry 1840",
    enviadoEl: h(15, "10:30") },
  "t-1040": { items: [it("vestido", "Negro · M"), it("falda", "Negro · S")], envio: 10, email: "fer.lopez@gmail.com",
    direccion: "Av. Arequipa 2510", pagadoEl: h(14, "15:50"), enviadoEl: h(15, "09:30"), entregadoEl: h(15, "13:10") },
  "t-1039": { items: [it("jean", "Azul claro · 28")], envio: 0, pagadoEl: h(14, "10:07"), entregadoEl: h(14, "17:20") },
  "t-1038": { items: [it("aretes", "Plata · Única", 2), it("falda", "Verde oliva · M")], envio: 12, direccion: "Av. Sucre 1120",
    canceladoEl: h(14, "21:30"), cancelacion: "reserva-vencida" },
  "t-1037": { items: [it("vestido", "Arena · S"), it("polo", "Gris · M"), it("jean", "Azul oscuro · 30"), it("falda", "Negro · M"), it("top", "Blanco · M")],
    envio: 10, email: "renata.vargas@gmail.com", direccion: "Av. San Luis 2050", pagadoEl: h(13, "12:11"), enviadoEl: h(13, "16:00"), entregadoEl: h(14, "11:30") },
  "t-1036": { items: [it("aretes", "Oro · Única")], envio: 0, pagadoEl: h(12, "19:26"), entregadoEl: h(13, "12:00") },
  "t-1035": { items: [it("vestido", "Negro · S"), it("cartera", "Negro · Única")], envio: 10, email: "ximena.rojas@gmail.com",
    direccion: "Jr. Bolognesi 455", pagadoEl: h(12, "09:42"), enviadoEl: h(12, "15:00"), entregadoEl: h(13, "10:15") },
};

export const subtotal = (d: DetallePedido) => d.items.reduce((s, i) => s + i.precio * i.cantidad, 0);
export const unidades = (d: DetallePedido) => d.items.reduce((s, i) => s + i.cantidad, 0);
