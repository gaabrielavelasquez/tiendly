# 0031 · Pase de diseño: más aire, títulos livianos y un protagonista por pantalla

- **Fecha:** 22-oct-2026
- **Estado:** propuesta. Aplicada en Inicio y en dos arreglos de la vitrina; se extiende a Pedidos, Productos y Mi tienda con el ok de Gabi.
- **Ajusta:** 0021 (gráfico), 0024 (lienzo, borde de tarjeta, "nunca pill") y el congelamiento estético de `CLAUDE.md` §6, levantado solo para este pase.

## Contexto

Con el Core Loop terminado (PR #12), el panel funciona pero se siente denso: lienzo gris, bordes marcados, títulos pesados, badges rellenos en todos lados. Referencias de Gabi: Bizee, Dokani y un dashboard SaaS de analítica. De ellas se toma el aire, la jerarquía y el halo suave; no se copian gráficos en cada tarjeta, el violeta ni la analítica densa.

## Decisión

1. **Más aire.** Más espacio entre secciones (40 px móvil · 48 px desktop en Inicio) y dentro de las tarjetas protagonistas (40 px en desktop). Lienzo del panel más claro: `bg/page` → `#F8F8F6` (`color/paper/50`); las vitrinas siguen en `#F4F4F3`. Borde de tarjeta casi invisible: token nuevo `border/card` (`#F0EFED`); separa la sombra `elevation/card`.
2. **Tipografía.** Títulos de página más grandes y livianos: Outfit Medium (`font/title-style`, 500, utilidad `font-display-light`) un tamaño arriba (`text-display`: 40 px móvil · 56 px desktop). El peso fuerte queda solo para las cifras clave (`font-metric`).
3. **Un protagonista por pantalla.** En Inicio, el saludo grande y liviano sobre un halo cálido de puro CSS (`bg-halo`: `glow/warm` + un toque de `glow/sky`, lados desvanecidos, sin WebGL). Saludo: "Hola, {nombre} 👋" si se conoce el nombre de la dueña (demo Heather: Cecilia; o el nombre de pila de Google); si no, "¡Hola! 👋" con el nombre de la tienda debajo. La tarjeta "Hoy" sigue en cobalto, con halo suave (`elevation/celebration`) y cifra más grande.
4. **Tarjetas de acción.** "Para atender hoy" pasa a ser una fila de tarjetas chicas (apiladas en móvil): ícono, título, detalle corto y botón redondo con chevron. Toda la tarjeta es el link (0027).
5. **Encabezados de sección** (`EncabezadoSeccion`): título a la izquierda y acciones silenciosas a la derecha (botón `quiet`, píldora neutra: la única excepción al "nunca pill"). Una sola acción fuerte por pantalla (en Inicio, "Nuevo producto"); compartir por WhatsApp pasa a ser silenciosa.
6. **Estados.** Ícono chico + texto de color, sin relleno. Badges rellenos solo para lo urgente: vence hoy, agotado.
7. **Gráficos.** Barras más finas (12 px móvil · 14 px desktop, punta redonda) con más aire entre días; la barra de hoy sigue en cobalto sólido, sin sombra, y su inicial en `accent/text` sin relleno.
8. **Movimiento.** Cifras que suben (`AnimatedNumber`, Motion Primitives) y barras que crecen escalonadas al entrar; todo respeta "reducir movimiento". Sin animaciones perpetuas.

**Arreglos de la vitrina:** sin logo, el círculo del pie lleva las iniciales y el nombre completo va debajo; en la cabecera, los nombres largos bajan de tamaño y se cortan en dos líneas. Con una sola categoría no se muestra la barra de filtros (quedaba vacía).

**Criterio de revisión:** Design Taste (madebymustafa/design-taste) — sin glows neón, sombras suaves, sin tarjetas de más, sin animaciones perpetuas. Donde choca con el repo, manda el repo (Inter, Lucide, el 👋 del saludo).

## Consecuencias

- Los tokens (lienzo, `border/card`, `font/title-style`) y el componente `Card` ya aplican en todo el panel; los patrones (cabecera con halo, tarjetas de acción, encabezados con acción silenciosa, estados sin relleno) por ahora solo en Inicio.
- Al extender a Pedidos, Productos y Mi tienda: `PanelHeader` pasa a `font-display-light` + `text-display`, y los badges no urgentes pasan a ícono + texto.
- `DESIGN.md` §4 suma la sección "Pase de diseño (0031)", que manda sobre lo anterior donde se contradiga.
