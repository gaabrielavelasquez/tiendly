export type Escenario = "catalogo" | "vacio" | "error";

/** Heather es una marca de calzado hecho a mano. */
export type Categoria = "balerinas" | "tacos" | "botas" | "plataformas";

/** Una combinación de colorway y talla, con su propio stock. */
export type Variante = { color: string; talla: string; stock: number };

/** 1 modelo = 1 producto con variantes de colorway y talla (regla de catálogo). */
export type Producto = {
  id: string;
  nombre: string;
  sku: string;
  /** Una o varias; la primera define el ícono de respaldo. */
  categorias: Categoria[];
  estado: "activo" | "borrador" | "archivado";
  precio: number;
  /** Precio antes de la rebaja, si hay. */
  precioAntes?: number;
  variantes: Variante[];
  /** Foto principal (URL). Sin foto, la miniatura muestra el ícono de la categoría. */
  imagen?: string;
  /** Fotos por color, en orden (la primera de cada color es la principal de ese color). */
  fotos?: Record<string, string[]>;
};

export type Filtro = "todos" | "activos" | "bajo-stock" | "agotados";

export type NivelStock = "en-stock" | "bajo-stock" | "agotado";
