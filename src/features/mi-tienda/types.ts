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
};
export type Errores = Partial<Record<keyof Tienda, string>>;
