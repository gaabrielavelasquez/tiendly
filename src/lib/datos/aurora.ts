// Aurora Calzado: la tienda de demo pública (ficticia). Sus modelos y fotos los comparten la semilla de la
// tienda y la vista previa del registro, para que lo que se promete en el registro sea lo que se ve al abrir el link.

export const AURORA = {
  nombre: "Aurora Calzado",
  slug: "aurora",
  portada: { src: "/aurora/portada.webp", alt: "Botines camel, sandalias negras y un bolso de lino sobre un piso de piedra clara" },
  titulo: "Calzado para todos los días",
  bajada: "Botines, sandalias, zapatillas y mocasines. Pide por WhatsApp y coordinamos la entrega.",
} as const;

/** Fotos en WebP, 4:5 y 960 × 1200 (public/aurora). */
export const MODELOS_AURORA = [
  { id: "a1", nombre: "Botín Nara", precio: 290, foto: "/aurora/botin.webp", alt: "Botín Nara de gamuza camel con elástico lateral", categoria: "botas", color: "Camel", stock: [1, 2, 3, 2, 1, 0],
    descripcion: "Botín chelsea de gamuza con elástico a los lados y taco de 4 cm. Se pone y se saca sin cierres." },
  { id: "a2", nombre: "Sandalia Lía", precio: 150, foto: "/aurora/sandalia.webp", alt: "Sandalia Lía negra de dos tiras", categoria: "sandalias", color: "Negro", stock: [2, 3, 3, 2, 1, 1],
    descripcion: "Sandalia plana de dos tiras en cuero negro. Liviana, para el verano y para todo el día." },
  { id: "a3", nombre: "Zapatilla Isla", precio: 220, foto: "/aurora/zapatilla.webp", alt: "Zapatilla Isla de cuero blanco", categoria: "zapatillas", color: "Blanco", stock: [1, 2, 3, 3, 2, 1],
    descripcion: "Zapatilla de cuero blanco con suela de caucho. Va con jean, con vestido y con traje." },
  { id: "a4", nombre: "Mocasín Vera", precio: 260, foto: "/aurora/mocasin.webp", alt: "Mocasín Vera de cuero chocolate", categoria: "mocasines", color: "Choco", stock: [0, 1, 2, 2, 1, 0],
    descripcion: "Mocasín de cuero chocolate con antifaz y taco bajo. Clásico para la oficina." },
] as const;
