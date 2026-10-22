# 0031 · Pase de diseño: más aire, títulos livianos y un protagonista por pantalla

- **Fecha:** 22-oct-2026
- **Estado:** propuesta. Aplicada en Inicio y en dos arreglos de la vitrina; se extiende a Pedidos, Productos y Mi tienda con el ok de Gabi.
- **Ajusta:** 0021 (gráfico), 0024 (lienzo, borde de tarjeta, "nunca pill") y el congelamiento estético de `CLAUDE.md` §6, levantado solo para este pase.

## Contexto

Con el Core Loop terminado (PR #12), el panel funciona pero se siente denso: lienzo gris, bordes marcados, títulos pesados, badges rellenos en todos lados. Referencias de Gabi: Bizee, Dokani y un dashboard SaaS de analítica. De ellas se toma el aire, la jerarquía y el halo suave; no se copian gráficos en cada tarjeta, el violeta ni la analítica densa.

## Decisión

1. **Más aire.** Más espacio entre secciones (40 px móvil · 48 px desktop en Inicio) y dentro de las tarjetas protagonistas (40 px en desktop). Lienzo del panel más claro: `bg/page` → `#F8F8F6` (`color/paper/50`); las vitrinas siguen en `#F4F4F3`. Borde de tarjeta casi invisible: token nuevo `border/card` (`#F0EFED`); separa la sombra `elevation/card`.
2. **Tipografía.** Títulos de página más grandes y livianos: Outfit Medium (`font/title-style`, 500, utilidad `font-display-light`) un tamaño arriba (`text-display`: 40 px móvil · 56 px desktop). Nivel intermedio para los títulos de sección: Outfit Medium en H3 (20 · 24 px), para que el salto desde el saludo no sea brusco. El peso fuerte queda solo para las cifras clave (`font-metric`).
3. **Un protagonista por pantalla.** En Inicio, el saludo grande y liviano sobre un halo cálido de puro CSS (`bg-halo`: `glow/warm` + un toque de `glow/sky`, lados desvanecidos, sin WebGL). Saludo: "Hola, {nombre} 👋" si se conoce el nombre de la dueña (demo Heather: Cecilia; o el nombre de pila de Google); si no, "¡Hola! 👋" con el nombre de la tienda debajo. La tarjeta "Hoy" sigue en cobalto, con halo suave (`elevation/celebration`), cifra más grande y alto a la medida de su contenido. Orden de 0012: en desktop, Hoy a la izquierda y Para atender hoy a la derecha; Esta semana a todo el ancho debajo.
4. **Para atender hoy.** Cada pendiente lleva ícono, título, detalle corto y botón redondo con chevron. Móvil: una sola tarjeta con filas divididas. Desktop: fila de tarjetas de acción chicas. Toda la fila o tarjeta es el link (0027).
5. **Encabezados de sección** (`EncabezadoSeccion`): título a la izquierda y acciones silenciosas a la derecha (botón `quiet`, píldora neutra: la única excepción al "nunca pill"). Una sola acción fuerte por pantalla (en Inicio, "Nuevo producto"); a su lado, "Compartir por WhatsApp" va como secundario con la misma forma y alto (`radius/button`, 40 px).
6. **Estados.** Ícono chico + texto de color, sin relleno. Badges rellenos solo para lo urgente: vence hoy, agotado.
7. **Gráficos.** Barras más finas (8 px móvil · 10 px desktop, punta redonda) con más aire entre días; la barra de hoy sigue en cobalto sólido, sin sombra, y su inicial en `accent/text` sin relleno.
8. **Movimiento.** Cifras que suben (`AnimatedNumber`, Motion Primitives) y barras que crecen escalonadas al entrar; todo respeta "reducir movimiento". Sin animaciones perpetuas.

**Arreglos de la vitrina:** sin logo, el círculo del pie lleva las iniciales y el nombre completo va debajo; en la cabecera, los nombres largos bajan de tamaño y se cortan en dos líneas. Con una sola categoría no se muestra la barra de filtros (quedaba vacía).

**Criterio de revisión:** Design Taste (madebymustafa/design-taste) — sin glows neón, sombras suaves, sin tarjetas de más, sin animaciones perpetuas. Donde choca con el repo, manda el repo (Inter, Lucide, el 👋 del saludo).

**Ronda 2 (22-oct, feedback de Gabi):** orden de 0012 en desktop, Para atender en una sola tarjeta en móvil, Hoy a la medida de su contenido, botones de la cabecera con la misma forma, nivel tipográfico intermedio y barras más finas.

**Ronda 3 (22-oct, pulido final):** en desktop, "Esta semana" lleva el resumen a la izquierda y el gráfico acotado a la derecha (128 px de alto); tarjetas de tareas con texto un paso más grande e ícono arriba con el texto abajo (sin aire vacío al pie); en móvil el subtítulo del saludo es solo la fecha; filas y tarjetas enteras son el link (≥ 44 px); el espaciador de la barra inferior suma la zona segura de iPhone, verificado en un viewport real de 390 × 844.

**Ronda 4 · "des-plantillar" (22-oct, experimento solo en Inicio; DESIGN.md no cambia hasta la aprobación de Gabi):**
Principios del nuevo Admin de Shopify (menos contenedores, la estructura de la página hace el trabajo, UI neutra y color solo para lo que pide atención) y de Stripe (tipografía de montos serena). No se copian.
- **Saludo en dos tonos, mismo tamaño (H1, Outfit Medium):** "Hola, Cecilia." en `text/primary` + "Tienes 3 cosas para hoy." en `text/secondary` (cuenta las filas de Para atender; sin pendientes, "Todo al día por hoy."). Debajo, la fecha en texto chico; en móvil no se repite la tienda. Sin 👋 ni halos.
- **Menos cajas:** todos los títulos de sección van fuera de los contenedores (Hoy, Para atender hoy, Esta semana). "Para atender hoy" es UN contenedor con divisores finos, en móvil y desktop.
- **Íconos:** finos (trazo 1.5), gris neutro, sin contenedor. El color queda para lo que pide atención (el badge "Vence"). Chevron simple; toda la fila es el link (≥ 44 px). La comparación semanal también va neutra.
- **Hoy:** degradado corto `accent/base` → `accent/pressed` (`bg-hero-suave`, sin marino) y profundidad en capas (`elevation/layered` → `shadow-capas`): filo superior blanco al 25 %, anillo interior de 1 px al 8 % y tres sombras cortas apiladas (0 1 0 · 0 3 1 −1 · 0 4 6 −2). Sin halo. Variante B con grano sutil (`?hoy=grano`).
- **Contenedores:** `elevation/container` → `shadow-contenedor` (anillo interior de 1 px al 8 % + base de 1 px al 7 %), sin borde de tarjeta.
- **Valores adaptados de `@shopify/polaris-tokens` 9.4.2:** `shadow-100` (0 1 0, 7 %), `shadow-200` (0 3 1 −1, 7 %), `shadow-300` (0 4 6 −2, 20 % → 12 % aquí) y `shadow-border-inset` (1 px, 8 %). Primitivos nuevos: `color/shadow/7`, `color/shadow/12` y `color/highlight/25`.
- **Montos al estilo Stripe (`Monto`):** peso Medium; SemiBold solo en totales ("Total de la semana"); cifras tabulares en todo Inicio; "S/" más chico y atenuado; decimales atenuados; etiqueta chica en gris arriba de cada monto.
- **Pesos:** títulos de sección en Outfit variable a 550 (`font/section-style`, utilidad `font-titulo-seccion`; paquete `@fontsource-variable/outfit`).

## Consecuencias

- Los tokens (lienzo, `border/card`, `font/title-style`) y el componente `Card` ya aplican en todo el panel; los patrones (cabecera con halo, tarjetas de acción, encabezados con acción silenciosa, estados sin relleno) por ahora solo en Inicio.
- Al extender a Pedidos, Productos y Mi tienda: `PanelHeader` pasa a `font-display-light` + `text-display`, y los badges no urgentes pasan a ícono + texto.
- `DESIGN.md` §4 suma la sección "Pase de diseño (0031)", que manda sobre lo anterior donde se contradiga.
