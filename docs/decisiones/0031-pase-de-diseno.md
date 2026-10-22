# 0031 · De-layering: menos cajas, montos serenos y un protagonista por pantalla

- **Fecha:** 22-oct-2026
- **Estado:** aceptada (Gabi aprobó Inicio el 22-oct-2026). Vigente. Las demás pantallas la siguen desde el inicio.
- **Ajusta:** 0017 (dónde van los halos), 0020 (tarjeta protagonista y titulares), 0021 (montos, gráfico y vidrio), 0024 (lienzo, borde de tarjeta, "nunca pill" y encabezados) y el congelamiento estético de `CLAUDE.md` §6, levantado solo para este pase.

## Contexto

Con el Core Loop terminado (PR #12), el panel funcionaba pero se sentía denso y "de plantilla": lienzo gris, bordes marcados, títulos pesados, una tarjeta por cosa, badges rellenos en todos lados y un halo azul difuminado. Referencias de Gabi: Bizee, Dokani y un dashboard SaaS de analítica, y después el nuevo Admin de Shopify (sept. 2026, "de-layering": menos contenedores, la estructura de la página hace el trabajo, UI neutra, color solo para lo que pide atención) y el Dashboard de Stripe (tipografía de montos serena). Se toman principios, no se copian pantallas. No se copia: gráficos en cada tarjeta, violeta, analítica densa.

El pase se probó solo en Inicio, en 6 rondas con capturas antes/después a 390 y 1440 px.

## Las 6 rondas: antes y después

| Ronda | Antes | Después |
|---|---|---|
| 1 · Aire y protagonista | Lienzo `#F4F4F3`, bordes `#E5E7EB`, títulos SemiBold, "Para atender" en una tarjeta con filas, badges rellenos, gráfico de 24–32 px sobre riel. | Lienzo `#F8F8F6`, `border/card` casi invisible, saludo grande y liviano con halo de fondo, tarjetas de acción, encabezados con acción silenciosa, estados como ícono + texto, barras de 12–14 px. Arreglos de la vitrina (pie, cabecera y barra de filtros). |
| 2 · Orden y botones | Hoy y Esta semana lado a lado; "Compartir" como píldora; tarjetas separadas también en móvil. | Orden de 0012 (Hoy y Para atender lado a lado, Esta semana a todo el ancho); en móvil, una sola tarjeta con filas; primario y secundario con la misma forma; títulos de sección en H3; barras de 8–10 px. |
| 3 · Pulido | Gráfico vacío a todo el ancho; tarjetas de tareas con aire vacío al pie; la tienda repetida en móvil. | Resumen a la izquierda y gráfico al lado; texto un paso más grande; solo la fecha en móvil; filas ≥ 44 px; el espaciador de la barra inferior suma la zona segura de iPhone. |
| 4 · De-layering | Emoji, halos de fondo, íconos en círculos, chevrons en botones redondos, montos en SemiBold, títulos dentro de las tarjetas. | Saludo en dos tonos; títulos fuera; un contenedor con divisores; íconos finos grises; Hoy con degradado corto y profundidad en capas (Polaris); montos al estilo Stripe; títulos de sección a 550. Se probó una variante con grano. |
| 5 · Últimos toques | Badge "Vence"; barras con degradado y riel; gráfico apretado a la derecha; delta en verde completo. | Plazo como texto de color; barras sólidas sin riel; gráfico usa el ancho; saludo en dos líneas; solo "+12 %" en verde; Hoy queda lisa (sin grano). |
| 6 · Halo con intención | Gris claro de barras por debajo de 3:1; sin halo. | Barras de 16 px en desktop en gris medio (`#878D97`, 3.3:1); halo cálido solo detrás de Hoy; plazo sin ícono propio. |

Capturas finales en el PR del pase.

## Decisión: las reglas

1. **Saludo:** título en dos tonos, mismo tamaño (H1, Outfit Medium), en dos líneas: nombre en `text/primary` y contexto en `text/secondary` ("Tienes 3 cosas para hoy.", "Todo al día por hoy."). Sin emoji. Fecha chica debajo; en móvil no se repite la tienda.
2. **De-layering:** los títulos de sección van fuera de los contenedores; cada lista vive en UN contenedor con divisores finos (`elevation/container`); la jerarquía la dan el espacio y la tipografía, no las cajas.
3. **Íconos:** finos (trazo 1.5), gris neutro, sin contenedores circulares. El color, solo para lo que pide atención.
4. **Urgencia y plazos:** como texto de color, sin píldora ("Vence hoy, 8:10 p. m."). Píldoras y badges, solo para estados donde hacen falta.
5. **Filas de acción:** toda la fila es el link (mín. 44 px), chevron simple, sin botones circulares.
6. **Dinero:** Regular o Medium, cifras tabulares, "S/" más chico y atenuado, decimales atenuados; SemiBold solo en totales. Etiqueta chica arriba de cada monto. **Deltas:** solo la cifra en `feedback/success` o `feedback/error`.
7. **Tarjeta protagonista:** como máximo una por pantalla, cobalto con degradado corto (`accent/base` → `accent/pressed`) y profundidad en capas (`elevation/layered`: sombras cortas apiladas + anillo de 1 px + filo superior interior blanco), adaptada de `@shopify/polaris-tokens` 9.4.2. Sin sombra de color difuminada, sin vidrio, sin grano.
8. **Halos (actualiza 0017):** solo detrás de la protagonista, asomando por sus bordes, o en momentos de logro (primera venta, pedido confirmado, estado vacío "todo al día"). Nunca como fondo de página. Solo degradados CSS, sin `filter: blur`; respetan "reducir movimiento".
9. **Gráficos:** barras sólidas con punta redonda (8 px móvil · 16 px desktop), pasados en gris medio (`chart/bar-muted`, 3.3:1), actual en cobalto, sin riel para los períodos que no llegan.
10. **Tipografía y aire:** títulos de sección en Outfit variable a 550 (H3); lienzo `#F8F8F6`; 40 · 48 px entre secciones. Encabezados con acción silenciosa (`quiet`) a la derecha y una sola acción fuerte por pantalla.

Tokens nuevos: `color/paper/50`, `color/neutral/450`, `color/shadow/7`, `color/shadow/12`, `color/highlight/25`, `border/card`, `chart/bar-muted`, `elevation/container`, `elevation/layered`, `font/title-style` (500) y `font/section-style` (550). Paquete nuevo: `@fontsource-variable/outfit` (pesos intermedios).

## Consecuencias

- `DESIGN.md` (§1, §3, §4 y §7) y `CLAUDE.md` §5 ya tienen estas reglas; lo que las contradecía se reescribió o se marcó como reemplazado.
- Los tokens, `Card` y el lienzo ya aplican en todo el panel. Los patrones (saludo en dos tonos, contenedor único, filas de acción, `Monto`, gráfico) por ahora están en Inicio; Pedidos, Productos y Mi tienda los adoptan cuando se rediseñen, empezando por `PanelHeader` (título en Outfit Medium) y los badges no urgentes (pasan a texto de color).
- La decisión 0017 vive fuera del repo ("IA on Product Design" → `tiendly/decisiones/`): hay que sumarle allá la nota de que 0031 la actualiza en los halos.
- Al integrar la rama hay que correr `npm install` (Outfit variable).
- **Ajustes posteriores (22-oct):** estado vacío de "Esta semana" (PR #14); "Hoy" sin ventas en versión serena, sin halo y con siguiente paso; saludo sin pendientes "Así va tu tienda hoy."; Inicio y el resto del panel usan la fecha y hora reales de Lima (`lib/reloj`).
