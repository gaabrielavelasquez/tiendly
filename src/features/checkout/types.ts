import type { ItemCarrito } from "@/features/vitrina/lib/carrito";

/** Lo que la compra necesita saber de cada producto (lo arma el servidor desde el catálogo publicado). */
export type ProductoCompra = { nombre: string; slug: string; precio: number; foto?: string; fotos: Record<string, string>; stock: Record<string, number> };
export type CatalogoCompra = Record<string, ProductoCompra>;

/** Una línea del carrito ya resuelta: el ítem guardado + lo que se muestra y se cobra. */
export type Linea = ItemCarrito & { nombre: string; slug: string; precio: number; foto?: string; maximo: number };

export type Cupon = { codigo: string; tipo: "porcentaje"; valor: number } | { codigo: string; tipo: "envio" };

export type Distrito = { nombre: string; zona: string; costo: number; plazo: string };

export type Datos = { nombre: string; celular: string };
export type Entrega = { tipo: "delivery"; distrito: Distrito; direccion: string; referencia: string } | { tipo: "recojo" };
export type MetodoPago = "tarjeta" | "yape" | "whatsapp";

/** Montos de la compra. `envio` es null mientras no se elige la entrega. */
export type Totales = { productos: number; unidades: number; descuento: number; envio: number | null; envioGratis: boolean; total: number };

/** El pedido que se crea al pagar o al enviarlo por WhatsApp (se guarda en este navegador hasta tener backend). */
export type PedidoCreado = {
  numero: string;
  creadoEl: string;
  datos: Datos;
  entrega: Entrega;
  lineas: Linea[];
  cupon?: string;
  totales: Totales;
  pago: { metodo: "tarjeta"; ultimos4: string } | { metodo: "yape" } | { metodo: "whatsapp"; reservadoHasta: string };
};
