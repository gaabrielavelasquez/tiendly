import type { ItemCarrito } from "@/features/vitrina/lib/carrito";

/** Lo que la compra necesita saber de cada producto (lo arma el servidor desde el catálogo publicado). */
export type ProductoCompra = { nombre: string; slug: string; precio: number; foto?: string; fotos: Record<string, string>; stock: Record<string, number> };
export type CatalogoCompra = Record<string, ProductoCompra>;

/** Una línea del carrito ya resuelta: el ítem guardado + lo que se muestra y se cobra. */
export type Linea = ItemCarrito & { nombre: string; slug: string; precio: number; foto?: string; maximo: number };

/** El cupón ya validado en el servidor (decisión 0008): lo justo para calcular el descuento. */
export type Cupon = { codigo: string; tipo: "porcentaje" | "monto" | "envio"; valor?: number };

/** Un distrito donde la tienda entrega, con el costo y el plazo de su zona (decisión 0009). */
export type Distrito = { nombre: string; lugar: string; zona: "lima" | "callao" | "provincias"; costo: number; plazo: string };

export type Recojo = { direccion: string; distrito: string; horario: string; nota: string };

/** Lo que la tienda configuró, ya listo para el checkout (sale de Configuración → Pagos y Entregas). */
export type ReglasCompra = {
  celular: string;
  pagos: { tarjeta: boolean; yape: boolean; whatsapp: boolean };
  envioGratisDesde: number | null;
  delivery: { distritos: Distrito[]; soloLima: boolean } | null;
  recojo: Recojo | null;
  /** Sin delivery ni recojo configurados: la entrega se acuerda por WhatsApp (tienda nueva). */
  coordinar: boolean;
};

export type Datos = { nombre: string; celular: string };
/** "coordinar": la tienda todavía no definió sus entregas; se acuerda por WhatsApp (costo aparte). */
export type Entrega = { tipo: "delivery"; distrito: Distrito; direccion: string; referencia: string } | { tipo: "recojo" } | { tipo: "coordinar" };
export type TipoEntrega = Entrega["tipo"];
export type MetodoPago = "tarjeta" | "yape" | "whatsapp";

/** Montos de la compra. `envio` es null mientras no se elige la entrega. */
/** `envioPorCoordinar`: entrega por WhatsApp; el envío no se suma al total. */
export type Totales = { productos: number; unidades: number; descuento: number; envio: number | null; envioGratis: boolean; envioPorCoordinar?: boolean; total: number };

/** El pedido que se crea al pagar o al enviarlo por WhatsApp (se guarda en este navegador hasta tener backend). */
export type PedidoCreado = {
  numero: string;
  creadoEl: string;
  datos: Datos;
  entrega: Entrega;
  lineas: Linea[];
  cupon?: string;
  totales: Totales;
  /** Dónde recoger, tal como estaba al comprar (la tienda puede cambiarlo después). */
  recojo?: Recojo;
  pago: { metodo: "tarjeta"; ultimos4: string } | { metodo: "yape" } | { metodo: "whatsapp"; reservadoHasta: string };
};
