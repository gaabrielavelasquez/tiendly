export type Escenario = "catalogo" | "vacio" | "error";

/** Texto libre de cada tienda ("Balerinas", "Velas", "Skincare"). Multirubro (decisión 0032). */
export type Categoria = string;

/** `color` lleva muestras en la vitrina; `talla` puede tener tabla de tallas; `otra`: tono, tamaño, aroma… */
export type TipoOpcion = "color" | "talla" | "otra";

/** Una opción del producto con sus valores en orden ("Color": Plata, Negro). Hasta 3 por producto. */
export type Opcion = { nombre: string; tipo: TipoOpcion; valores: string[] };

/** Una combinación de valores, uno por opción y en el orden de `opciones`, con su stock. Sin opciones: `[]`. */
export type Variante = { valores: string[]; stock: number };

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
  precio: number;
  /** Precio antes de la rebaja, si hay. */
  precioAntes?: number;
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
};

export type Filtro = "todos" | "activos" | "bajo-stock" | "agotados" | "pausados";

export type NivelStock = "en-stock" | "bajo-stock" | "agotado";
