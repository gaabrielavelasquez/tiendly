import type { DetallePedido, ItemPedido } from "../types";

// Detalle simulado de cada pedido. Los ítems salen del catálogo de Heather (mismos precios y fotos que
// Productos, la foto del color vendido) y subtotal + envío = total de la lista. Delivery en Lima entre S/ 10 y S/ 15; recojo sin costo.

const f = (archivo: string) => `/heather/${archivo}`;
const CATALOGO = {
  chloe: { producto: "Balerinas Chloé", precio: 360, fotos: { Plata: f("chloe-silver-1.jpg"), Burdeos: f("chloe-burgundy.png"), Negro: f("chloe-black.png") } },
  chlow: { producto: "Balerinas Chlow Vainilla", precio: 340, fotos: { Vainilla: f("chlow-vainilla.png") } },
  vivienne: { producto: "Zapatos de Taco Vivienne", precio: 330, fotos: { Negro: f("vivienne-black.png"), Vainilla: f("vivienne-vainilla.png"), Burdeos: f("vivienne-burgundy.png") } },
  danika: { producto: "Botas Danika", precio: 520, fotos: { Negro: f("danika-black-1.png") } },
  amelie: { producto: "Tacos Amelie", precio: 370, fotos: { Negro: f("amelie-black.png"), Vainilla: f("amelie-vainilla.png"), Burdeos: f("amelie-burgundy.png") } },
  sophie: { producto: "Botines Sophie", precio: 470, fotos: { Negro: f("sophie-black.png"), Choco: f("sophie-choco.png") } },
  maryjane: { producto: "Zapatos Mary Jane", precio: 380, fotos: { Burdeos: f("mary-jane-burgundy.png"), Negro: f("mary-jane-black.png") } },
  rouge: { producto: "Plataformas Rouge", precio: 410, fotos: { Negro: f("rouge-black-1.png") } },
} as const;

type Clave = keyof typeof CATALOGO;
/** Una línea del pedido: modelo, color, talla y cantidad. La foto es la de ese color. */
const it = <K extends Clave>(k: K, color: keyof (typeof CATALOGO)[K]["fotos"] & string, talla: string, cantidad = 1): ItemPedido => {
  const m = CATALOGO[k];
  return { producto: m.producto, precio: m.precio, foto: (m.fotos as Record<string, string>)[color], variante: `${color} · ${talla}`, cantidad };
};
const h = (dia: number, hora: string) => `2026-10-${dia}T${hora}:00-05:00`;

export const DETALLES: Record<string, DetallePedido> = {
  "t-1047": { items: [it("chloe", "Plata", "37"), it("chlow", "Vainilla", "37")], envio: 12, email: "valeria.quispe@gmail.com",
    direccion: "Av. José Larco 812, dpto. 501", referencia: "Frente al parque Kennedy.", pagadoEl: h(15, "17:55") },
  "t-1046": { items: [it("amelie", "Negro", "38")], envio: 12, email: "camila.torres@outlook.com",
    direccion: "Calle Las Begonias 441", pagadoEl: h(15, "16:06") },
  "t-1045": { items: [it("vivienne", "Vainilla", "36")], envio: 0, pagadoEl: h(15, "14:45") },
  "t-1044": { items: [it("maryjane", "Burdeos", "37")], envio: 12, email: "lucia.fdz@gmail.com",
    direccion: "Jr. Monte Rosa 233", pagadoEl: h(15, "11:22"), enviadoEl: h(15, "15:40") },
  "t-1043": { items: [it("rouge", "Negro", "38")], envio: 12, email: "daniela.ruiz@gmail.com",
    direccion: "Av. Grau 315", referencia: "Casa de rejas verdes." },
  "t-1042": { items: [it("danika", "Negro", "39"), it("chloe", "Negro", "38")], envio: 10,
    direccion: "Calle Los Fresnos 190, La Planicie", nota: "Pidió las Chloé en caja de regalo." },
  "t-1041": { items: [it("vivienne", "Negro", "37")], envio: 12, direccion: "Av. Salaverry 1840",
    enviadoEl: h(15, "10:30") },
  "t-1040": { items: [it("amelie", "Burdeos", "36")], envio: 10, email: "fer.lopez@gmail.com",
    direccion: "Av. Arequipa 2510", pagadoEl: h(14, "15:50"), enviadoEl: h(15, "09:30"), entregadoEl: h(15, "13:10") },
  "t-1039": { items: [it("chlow", "Vainilla", "38")], envio: 0, pagadoEl: h(14, "10:07"), entregadoEl: h(14, "17:20") },
  "t-1038": { items: [it("sophie", "Choco", "38")], envio: 12, direccion: "Av. Sucre 1120",
    canceladoEl: h(14, "21:30"), cancelacion: "reserva-vencida" },
  "t-1037": { items: [it("chloe", "Plata", "36"), it("maryjane", "Negro", "37")],
    envio: 10, email: "renata.vargas@gmail.com", direccion: "Av. San Luis 2050", pagadoEl: h(13, "12:11"), enviadoEl: h(13, "16:00"), entregadoEl: h(14, "11:30") },
  "t-1036": { items: [it("amelie", "Vainilla", "37")], envio: 0, pagadoEl: h(12, "19:26"), entregadoEl: h(13, "12:00") },
  "t-1035": { items: [it("danika", "Negro", "38")], envio: 10, email: "ximena.rojas@gmail.com",
    direccion: "Jr. Bolognesi 455", pagadoEl: h(12, "09:42"), enviadoEl: h(12, "15:00"), entregadoEl: h(13, "10:15") },
};

export const subtotal = (d: DetallePedido) => d.items.reduce((s, i) => s + i.precio * i.cantidad, 0);
/** Lo que paga el cliente: subtotal − cupón + envío. */
export const totalDetalle = (d: DetallePedido) => subtotal(d) - (d.cupon?.descuento ?? 0) + d.envio;
export const unidades = (d: DetallePedido) => d.items.reduce((s, i) => s + i.cantidad, 0);
