export type Tema = "neutral" | "editorial" | "suave";
export type Acento = "tema" | "negro" | "terracota" | "rosa" | "oliva";
export type Tienda = {
  tema: Tema;
  acento: Acento;
  logo: string;
  portada: string;
  bienvenida: string;
  instagram: string;
  whatsapp: string;
  horario: string;
  /** Nombre de la sección de ofertas y de su link en el menú (0034). Vacío: "Ofertas". Vive en el servidor. */
  nombreOfertas: string;
};
export type Errores = Partial<Record<keyof Tienda, string>>;
