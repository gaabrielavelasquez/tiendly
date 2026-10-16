// Contenido de la vitrina que el panel todavía no captura (hasta tener backend): colores de las
// muestras, una línea corta y la descripción de cada modelo.

/**
 * Color de cada muestra. Son DATOS del producto (los elige la tienda), no estilos del sistema:
 * por eso llevan hex y la marca hardcode-ok para el chequeo de tokens.
 */
export const HEX_COLOR: Record<string, string> = {
  Negro: "#1A1A1A", // hardcode-ok: dato del producto
  Arena: "#D8C3A5", // hardcode-ok: dato del producto
  Camel: "#B88A5A", // hardcode-ok: dato del producto
  Crudo: "#EFE8DC", // hardcode-ok: dato del producto
  Blanco: "#FFFFFF", // hardcode-ok: dato del producto
  Gris: "#9CA3AF", // hardcode-ok: dato del producto
  "Azul claro": "#9DB7D5", // hardcode-ok: dato del producto
  "Azul oscuro": "#2F4A6D", // hardcode-ok: dato del producto
  Dorado: "#C9A45C", // hardcode-ok: dato del producto
  Chocolate: "#5A3A29", // hardcode-ok: dato del producto
  Plata: "#C0C4C8", // hardcode-ok: dato del producto
  Oro: "#D4AF37", // hardcode-ok: dato del producto
  Índigo: "#3B4A7A", // hardcode-ok: dato del producto
  "Verde oliva": "#6B6B3A", // hardcode-ok: dato del producto
  Estampado: "#C98B9A", // hardcode-ok: dato del producto
};

export const DETALLE: Record<string, { corto: string; sobre: string }> = {
  p1: { corto: "Crepé fluido · Forro interior", sobre: "Un vestido midi de crepé que cae suelto y se mueve bien. Tiene forro interior y cierre invisible en la espalda. Va igual de bien con zapatillas que con tacos." },
  p2: { corto: "Cuero natural · Hecho a mano en Lima", sobre: "Botines de cuero natural con taco bajo y cierre lateral. Los hacemos a mano en el taller: el cuero se amolda al pie con el uso." },
  p3: { corto: "Lino y viscosa · Corte recto", sobre: "Un blazer de corte recto en lino y viscosa, sin hombreras. Liviano para el día a día y con forro solo en las mangas para que respire." },
  p4: { corto: "Algodón peinado · Corte amplio", sobre: "El polo de todos los días: algodón peinado de 220 g, cuello reforzado y corte amplio que no se deforma con el lavado." },
  p5: { corto: "Denim 100 % algodón · Tiro alto", sobre: "Jean de tiro alto y pierna recta que se afina al tobillo. Denim rígido 100 % algodón: al principio ajusta y con el uso queda a tu medida." },
  p6: { corto: "Cuero metalizado · Plantilla acolchada", sobre: "Sandalias de tiras cruzadas en cuero metalizado, con plantilla acolchada. Planas y cómodas para todo el día." },
  p7: { corto: "Cuero vacuno · Correa regulable", sobre: "Cartera mediana de cuero vacuno con correa regulable y bolsillo interior con cierre. Entra todo lo del día y un libro." },
  p8: { corto: "Plata 925 · Baño de oro opcional", sobre: "Aretes de argolla en plata 925, livianos para usarlos todo el día. La versión Oro tiene baño de oro de 18 k." },
  p9: { corto: "Denim rígido · Lavado oscuro", sobre: "Casaca de denim rígido en lavado índigo, con bolsillos de parche. Se usa abierta sobre un vestido o cerrada con jean." },
  p10: { corto: "Plisado permanente · Cintura elástica", sobre: "Falda midi con plisado permanente y cintura elástica. No se arruga en la maleta y se lava en casa." },
  p12: { corto: "Tejido transpirable · Suela liviana", sobre: "Zapatillas de tejido transpirable con suela liviana de caucho. Para caminar la ciudad todo el día." },
};

/** Tabla de tallas orientativa (calzado en cm de largo de pie; ropa en cm de contorno de busto). */
export const TALLAS_CM: Record<string, string> = {
  "35": "22.5 cm", "36": "23 cm", "37": "23.5 cm", "38": "24 cm", "39": "24.5 cm", "40": "25 cm",
  XS: "80–84 cm", S: "84–88 cm", M: "88–92 cm", L: "92–98 cm", XL: "98–104 cm",
};
