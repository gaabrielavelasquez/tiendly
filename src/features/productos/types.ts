export type Escenario = "catalogo" | "vacio" | "error";

export type Categoria = "ropa" | "calzado" | "accesorios" | "joyeria";

/** Una combinación de colorway y talla, con su propio stock. */
export type Variante = { color: string; talla: string; stock: number };

/** 1 modelo = 1 producto con variantes de colorway y talla (regla de catálogo). */
export type Producto = {
  id: string;
  nombre: string;
  sku: string;
  categoria: Categoria;
  estado: "activo" | "borrador" | "archivado";
  precio: number;
  /** Precio antes de la rebaja, si hay. */
  precioAntes?: number;
  variantes: Variante[];
  /** Foto principal (URL). Sin foto, la miniatura muestra el ícono de la categoría. */
  imagen?: string;
};

export type Filtro = "todos" | "activos" | "bajo-stock" | "agotados";

export type NivelStock = "en-stock" | "bajo-stock" | "agotado";
