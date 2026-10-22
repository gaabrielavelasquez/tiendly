// Aurora Calzado: la tienda de demo pública (ficticia). Sus modelos y fotos los comparten la semilla de la
// tienda y la vista previa del registro, para que lo que se promete en el registro sea lo que se ve al abrir el link.

export const AURORA = {
  nombre: "Aurora Calzado",
  slug: "aurora",
  portada: { src: "/aurora/portada.webp", alt: "Botines camel, sandalias negras y un bolso de lino sobre un piso de piedra clara" },
} as const;

/** Fotos en WebP, 4:5 y 960 × 1200 (public/aurora). */
export const MODELOS_AURORA = [
  { id: "a1", nombre: "Botín Nara", precio: 290, foto: "/aurora/botin.webp", alt: "Botín Nara de gamuza camel con elástico lateral" },
  { id: "a2", nombre: "Sandalia Lía", precio: 150, foto: "/aurora/sandalia.webp", alt: "Sandalia Lía negra de dos tiras" },
  { id: "a3", nombre: "Zapatilla Isla", precio: 220, foto: "/aurora/zapatilla.webp", alt: "Zapatilla Isla de cuero blanco" },
  { id: "a4", nombre: "Mocasín Vera", precio: 260, foto: "/aurora/mocasin.webp", alt: "Mocasín Vera de cuero chocolate" },
] as const;
