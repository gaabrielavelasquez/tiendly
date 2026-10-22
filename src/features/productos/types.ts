export type Escenario = "catalogo" | "vacio" | "error";

/** Calzado: las de Heather (hecho a mano) y las de Aurora (sandalias, zapatillas y mocasines). */
export type Categoria = "balerinas" | "tacos" | "botas" | "plataformas" | "sandalias" | "zapatillas" | "mocasines";

/** Una combinación de colorway y talla, con su propio stock. */
export type Variante = { color: string; talla: string; stock: number };

/** 1 modelo = 1 producto con variantes de colorway y talla (regla de catálogo). */
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
  variantes: Variante[];
  /** Foto principal (URL). Sin foto, la miniatura muestra el ícono de la categoría. */
  imagen?: string;
  /** Fotos por color, en orden (la primera de cada color es la principal de ese color). */
  fotos?: Record<string, string[]>;
};

export type Filtro = "todos" | "activos" | "bajo-stock" | "agotados" | "pausados";

export type NivelStock = "en-stock" | "bajo-stock" | "agotado";
