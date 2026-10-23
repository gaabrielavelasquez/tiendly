export type Escenario = "catalogo" | "vacio" | "error";

/** Texto libre de cada tienda ("Balerinas", "Velas", "Skincare"). Multirubro (decisión 0032). */
export type Categoria = string;

/** `color` lleva muestras en la vitrina; `talla` puede tener tabla de tallas; `otra`: tono, tamaño, aroma… */
export type TipoOpcion = "color" | "talla" | "otra";

/** Una opción del producto con sus valores en orden ("Color": Plata, Negro). Hasta 3 por producto. */
export type Opcion = { nombre: string; tipo: TipoOpcion; valores: string[] };

/** Una combinación de valores, uno por opción y en el orden de `opciones`, con su stock. Sin opciones: `[]`. */
export type Variante = { valores: string[]; stock: number };

/** Fechas de una oferta (decisión 0034), días AAAA-MM-DD en Lima. Sin `desde`: desde ya; sin `hasta`: sin fin. */
export type Oferta = { desde?: string; hasta?: string };

/**
 * Tabla de tallas del producto (0032, parte 4 de 0034): medidas en cm por talla. `medidas` son las columnas ("Pecho",
 * "Largo del pie"); `filas`, por cada talla de la opción Talla, un texto por medida ("88" o "86–90"; vacío: no aplica).
 */
export type TablaTallas = { medidas: string[]; filas: Record<string, string[]> };

/** 1 producto con variantes (decisión 0004, actualizada por 0032): las variantes son opciones genéricas. */
export type Producto = {
  id: string;
  nombre: string;
  /** Opcional (decisión 0027): se carga en "Más opciones". */
  sku?: string;
  /** Texto de la página del producto (opcional). */
  descripcion?: string;
  /** Una o varias; la primera define el ícono de respaldo. */
  categorias: Categoria[];
  /** Un solo interruptor (decisiones 0011 y 0027): pausado no se ve en la tienda. */
  estado: "activo" | "pausado";
  /** Soles enteros. Con oferta, es el precio de oferta. */
  precio: number;
  /** El precio normal, si el producto está en oferta (0034): mayor que `precio`. Se muestra tachado. */
  precioAntes?: number;
  /** Fechas de la oferta. Fuera de ellas se cobra `precioAntes`, sin tachado. */
  oferta?: Oferta;
  /** Hasta 3 (decisión 0032). Vacío: el producto se vende sin opciones. */
  opciones: Opcion[];
  variantes: Variante[];
  /**
   * Qué opción cambia las fotos (índice en `opciones`). Sin definir: la de tipo color o la llamada "Tono".
   * -1: una sola galería para todo el producto.
   */
  opcionFotos?: number;
  /** Foto principal (URL). Sin foto, la miniatura muestra el ícono de la categoría. */
  imagen?: string;
  /** Fotos por valor de la opción que cambia las fotos, en orden; sin esa opción, todas en la clave "". */
  fotos?: Record<string, string[]>;
  /** Solo si el producto tiene una opción Talla. Sin tabla, la tienda no muestra el link "Ver tabla de tallas". */
  tablaTallas?: TablaTallas;
};

export type Filtro = "todos" | "activos" | "en-oferta" | "bajo-stock" | "agotados" | "pausados";

export type NivelStock = "en-stock" | "bajo-stock" | "agotado";
