import type { Tema } from "@/features/onboarding/lib/rubros";

// Tiendas de ejemplo de la vista previa del registro (decisiones 0032 y 0033): tres rubros distintos, cada una
// con su tema. Ficticias: nombres (cortos, para que entren en una línea) y precios inventados. Fotos reales de Unsplash y Pexels, optimizadas en
// public/tiendas-ejemplo (portada 16:9 a 1280 × 720, la de MUÑA a 1920 × 1080 porque también es la de su tienda;
// productos 4:5 a 480 × 600, WebP). Originales: fotos-originales/. Paleta en tonos tierra: sin fotos rosadas.

export type ProductoEjemplo = { nombre: string; precio: number; foto: string; alt: string };
/** `titulo` y `bajada`: los de su portada, si la tienda existe de verdad (MUÑA es la tienda de demo pública). */
export type TiendaEjemplo = { nombre: string; slug: string; tema: Tema; portada: { src: string; alt: string; titulo: string; bajada: string }; productos: ProductoEjemplo[] };

const f = (tienda: string, archivo: string) => `/tiendas-ejemplo/${tienda}/${archivo}.webp`;

export const TIENDAS_EJEMPLO: TiendaEjemplo[] = [
  {
    nombre: "MUÑA",
    slug: "muna",
    tema: "editorial",
    portada: {
      src: f("muna", "portada"),
      alt: "Seis personas en fila contra una pared de concreto, con ropa en tonos tierra, negro y beige",
      titulo: "Piezas para usar mucho",
      bajada: "Ropa, carteras y botines en pocas unidades. Pide por WhatsApp y coordinamos la entrega.",
    },
    // Los 4 primeros salen en la vista previa del registro; la tienda muestra los 6.
    productos: [
      { nombre: "Traje Arena", precio: 389, foto: f("muna", "conjunto-arena"), alt: "Conjunto beige de chaqueta corta y pantalón ancho, frente a una pared de concreto" },
      { nombre: "Bolso Puyu", precio: 199, foto: f("muna", "bolso-puyu"), alt: "Bolso acolchado gris con cadena dorada, colgado de una mano" },
      { nombre: "Botín Saya", precio: 289, foto: f("muna", "botin-saya"), alt: "Botín de cuero marrón oscuro con taco, sobre un banco metálico" },
      { nombre: "Falda Lluvia", precio: 249, foto: f("muna", "falda-lluvia"), alt: "Falda de lentejuelas plateadas en movimiento, con un blazer de jean" },
      { nombre: "Chompa Qori", precio: 189, foto: f("muna", "chompa-qori"), alt: "Chompa tejida verde oliva con cierre, sobre una silla transparente" },
      { nombre: "Cartera Wari", precio: 219, foto: f("muna", "cartera-wari"), alt: "Cartera de cuero vino con hebilla plateada colgada en una pared clara, junto a una planta" },
    ],
  },
  {
    nombre: "keyhaus",
    slug: "keyhaus",
    tema: "neutral",
    portada: {
      src: f("keyhaus", "portada"),
      alt: "Teclado mecánico gris con teclas negras y Esc rojo, sobre fondo negro",
      titulo: "Tu setup, tecla por tecla",
      bajada: "Teclados, switches y mouse. Pide por WhatsApp y coordinamos la entrega.",
    },
    productos: [
      { nombre: "Teclado K75", precio: 459, foto: f("keyhaus", "teclado-k75"), alt: "Teclado mecánico 75 % de aluminio con perilla, teclas grises y Enter rosado" },
      { nombre: "Switches ×70", precio: 129, foto: f("keyhaus", "switches-lineales"), alt: "Switches mecánicos transparentes en una bandeja de madera" },
      { nombre: "Mouse Hoshi", precio: 239, foto: f("keyhaus", "mouse-hoshi"), alt: "Mouse negro ultraligero con carcasa de panal, junto a teclas blancas" },
      { nombre: "Split Sora", precio: 689, foto: f("keyhaus", "teclado-split-sora"), alt: "Teclado ergonómico partido en dos, azul con teclas negras" },
    ],
  },
  {
    nombre: "Glow Labo",
    slug: "glow-labo",
    tema: "suave",
    portada: {
      src: f("glow-labo", "portada"),
      alt: "Frasco gotero ámbar de sérum sobre una piedra, con fondo durazno",
      titulo: "Skincare sin apuro",
      bajada: "Sérums, bases y jabones, importados y en tonos para piel latina. Pide por WhatsApp.",
    },
    productos: [
      { nombre: "BB cream Nube", precio: 75, foto: f("glow-labo", "bb-cream-nube"), alt: "Tubo de BB cream granate entre cáscaras de huevo" },
      { nombre: "Aceite Kiwano", precio: 98, foto: f("glow-labo", "aceite-kiwano"), alt: "Frasco gotero de aceite facial sobre dos mitades de kiwano" },
      { nombre: "Base Piel", precio: 119, foto: f("glow-labo", "base-piel"), alt: "Frasco de vidrio de base líquida tono medio, visto de cerca" },
      { nombre: "Jabón Avena", precio: 29, foto: f("glow-labo", "jabon-avena"), alt: "Jabones artesanales beige y verde junto a un peine de madera, sobre tela blanca" },
    ],
  },
];

/** Cada cuánto cambia la tienda de la vista previa (ms). Con "reducir movimiento", no cambia. */
export const ROTACION_MS = 5000;
