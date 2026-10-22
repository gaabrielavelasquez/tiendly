// Contenido de la vitrina que el panel todavía no captura (hasta tener backend): colores de las
// muestras, una línea corta y la descripción de cada modelo de Heather.

/**
 * Color de cada muestra. Son DATOS del producto (los elige la tienda), no estilos del sistema:
 * por eso llevan hex y la marca hardcode-ok para el chequeo de tokens.
 */
export const HEX_COLOR: Record<string, string> = {
  Negro: "#1A1A1A", // hardcode-ok: dato del producto
  Plata: "#C9CCCF", // hardcode-ok: dato del producto
  Burdeos: "#5E1A24", // hardcode-ok: dato del producto
  Vainilla: "#E9DFC9", // hardcode-ok: dato del producto
  Choco: "#5A4033", // hardcode-ok: dato del producto
  Camel: "#B88A5A", // hardcode-ok: dato del producto
  Blanco: "#FFFFFF", // hardcode-ok: dato del producto
};

export const DETALLE: Record<string, { corto: string; sobre: string }> = {
  p1: { corto: "Cuero natural · Hecho a mano en Lima", sobre: "Una ballerina de punta dividida en cuero natural, con moño al frente. La hacemos a mano en el taller y toma alrededor de dos semanas. El cuero se amolda al pie con el uso: al principio va ajustado y después queda hecho a tu medida." },
  p2: { corto: "Cuero vainilla · Hecho a mano en Lima", sobre: "La versión clara de la Chloé, en cuero vainilla con moño anudado. Ligera, flexible y lista para todo el día." },
  p3: { corto: "Taco de madera · 5 cm", sobre: "Un salón de punta redonda con taco de madera de 5 cm y moño de cuero. Alto justo para la oficina y cómodo para estar de pie todo el día." },
  p4: { corto: "Bota alta · Plataforma de 6 cm", sobre: "Bota alta de cuero con plataforma de 6 cm y cierre interior. Se ve robusta pero pesa poco: la suela es de caucho liviano." },
  p5: { corto: "Punta dividida · Taco de 6 cm", sobre: "La Amelie lleva la punta dividida de la casa sobre un taco cuadrado de 6 cm, con moño al frente. Estable para caminar la ciudad." },
  p6: { corto: "Botín de cuero · Taco cuadrado", sobre: "Botín de punta dividida en cuero liso, con taco cuadrado y cierre lateral. Va con todo, de jean a vestido." },
  p7: { corto: "Charol · Tira al tobillo", sobre: "Sandalia de charol con punta dividida y tira al tobillo con hebilla. Cómoda y con un brillo que no pasa de moda." },
  p8: { corto: "Plataforma de 10 cm · Cuero napa", sobre: "Mule de plataforma de 10 cm en cuero napa. Alta pero estable: el peso se reparte en toda la suela." },
};

/** Tabla de tallas orientativa: largo del pie en cm. */
export const TALLAS_CM: Record<string, string> = {
  "35": "22.5 cm", "36": "23 cm", "37": "23.5 cm", "38": "24 cm", "39": "24.5 cm", "40": "25 cm",
};

/** Portada de la vitrina: fotos de campaña (lifestyle) de la marca, titular y llamado a la acción. */
export const PORTADA = {
  temporada: "Otoño · Invierno 2026",
  titulo: "Nueva colección",
  bajada: "Calzado hecho a mano en Lima, en cuero natural y tallas del 35 al 40.",
  cta: "Explorar colección",
  /** Móvil: solo la primera. Desktop: las dos lado a lado (las fotos miden ~950 px: una sola a 1440 px se vería borrosa). */
  fotos: [
    { src: "/heather/danika-black-2.png", alt: "Modelo con las Botas Danika" },
    { src: "/heather/chloe-silver-2.png", alt: "Balerinas Chloé en plata, al caminar" },
  ],
};
