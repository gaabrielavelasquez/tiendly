# 🎨 DESIGN.md — Tiendly Design System & Brand Guidelines (V1)

Este documento es la guía oficial e inmutable del sistema de diseño para **Tiendly**. Contiene las reglas estéticas, la arquitectura de tokens, los componentes visuales y las pautas de micro-copy que deben respetarse en el diseño de prototipos y en la generación de código frontend.

> **Fuente de verdad (decisión 0026, 16-oct-2026):** las reglas visuales viven en este documento, en `design/tokens.json` y en el código. Figma es la referencia de flujos y de estructura de pantallas; ante una diferencia visual, manda el repo. Historial de decisiones: `docs/decisiones/`.

---

## 1. Dirección de Marca & Identidad Visual

### Concepto Estético
La identidad visual de Tiendly combina **velocidad ultra limpia**, **lenguaje moderno** (inspirado en Luma, Shop e Hypelist) y **espacios creativos** donde los comerciantes sientan orgullo y gusto al dar vida a sus tiendas online.

### Paleta de Color Primaria
- **Color de Marca (Cobalto Eléctrico):** el primario **no es un relleno plano**: es un degradado de `#2563EB` (cobalto) a `#1B365D` (marino profundo), a 135°. `#1D4ED8` queda para hover y links. *(Recalibrado el 15-oct-2026 para diferenciarse del azul plano de Tiendanube y Mercado Pago, decisión 0017.)*
- **Gama de Soporte (Estilo Luma):**
  - `color.brand.glow-sky`: halo difuminado del cobalto (16 %) hacia celeste pastel `#EFF6FF`.
  - `color.brand.glow-warm`: halo cálido (durazno al 4 %).
  - **Dónde van los halos (decisión 0031, actualiza 0017):** solo detrás de la tarjeta protagonista, asomando por sus bordes, o en momentos de logro (primera venta, pedido confirmado, estado vacío "todo al día"). **Nunca como fondo de página.** Solo degradados CSS (`bg-halo-hoy`), sin `filter: blur`; si aparecen con movimiento, respetan "reducir movimiento".
  - Opacidad baja del cobalto (`rgba(37, 99, 235, 0.08)`, `accent/glow`) para halos y anillos de foco. Nunca para selección: va en negro carbón (§4).
- **Acento cálido "Spark" (`color.brand.spark`, `#EA580C`):** el contrapunto cálido al cobalto y al carbón, para que el panel no se sienta frío. Se usa con la **regla del 1 %** (ver §4). *Decisión 0022, 16-oct-2026.*
- **Superficie y Lienzo:** lienzo del panel `#F8F8F6` (`bg/page`, decisión 0031) con contenedores blanco puro `#FFFFFF`. Las vitrinas siguen en `#F4F4F3`.
- **Texto:** `#1A1A1A` (Primario) / `#6B7280` (Secundario / Muted).

---

## 2. Pautas de Lenguaje & Micro-copy

### Lenguaje Neutral
- Se adopta globalmente el término **"cliente"** para referirse a la persona que compra en la tienda.
- **Sin género (0032):** "la tienda" o "quien vende" para quien vende; nunca "vendedora" ni "emprendedora". Se reformula la frase en vez de usar "@", "x" o "e" ("Te damos la bienvenida", no "Bienvenida"). Los adjetivos concuerdan con un sustantivo neutro ("¡Tu tienda está lista!"), nunca con la persona.
- Evitar redacciones impersonales rígidas.
- **Multirubro (0032):** ningún rubro es el predeterminado. Ejemplos, placeholders y demos mezclan rubros (impresiones 3D, decoración, cosmética, ropa, accesorios…).

### Regla del Punto Final
- **TODOS** los textos de ayuda (*helper text*), descripciones de campos, mensajes de validación y explicaciones secundarias deben **finalizar obligatoriamente con un punto (`.`)**.
- Los títulos, placeholders y botones directos no llevan punto final.

### Estructura de Productos
- **Principio Unificado (0004, actualizado por 0032):** 1 producto con variantes. Cada variante es una combinación de hasta 3 opciones genéricas (color, talla, tono, tamaño, material, aroma u otra), con su stock. La tabla de tallas solo aparece cuando una opción es talla. Sin Talla, el producto puede tener medidas únicas en cm, sin selector (0037, ampliación solicitada el 24-oct).

---

## 3. Tipografía & Jerarquía

- **Titulares (Headings):** Outfit con `tracking-tight`. Nada de Black (900): se ve pesado y "de juguete". *Decisión 0031 (22-oct-2026); antes SemiBold en todo (0020).*
  - **Títulos de página y saludo:** Outfit Medium (500, `font/title-style`, utilidad `font-display-light`) en H1 (28 · 40 px).
  - **Títulos de sección:** Outfit variable a 550 (`font/section-style`, utilidad `font-titulo-seccion`) en H3 (20 · 24 px): el nivel intermedio entre el título de página y el cuerpo.
- **Saludo en dos tonos (0031):** mismo tamaño, dos líneas a propósito: "Hola, Cecilia." en `text/primary` y la frase de contexto ("Tienes 3 cosas para hoy."; sin pendientes, "Así va tu tienda hoy.", para no repetir el "Todo al día" de la lista) en `text/secondary`. Sin emoji. Debajo, la fecha en texto chico; en móvil no se repite la tienda (ya está en la barra superior).
- **Dinero (0031, estilo Stripe):** peso Regular o Medium; **SemiBold (`font-metric`) solo en totales**. Cifras tabulares siempre. "S/" un escalón más chico y atenuado; decimales atenuados. **Formato global (0041):** mostrar decimales solo si existen céntimos: `S/ 712`, `S/ 179.10`, `S/ 90.99`; nunca `.00`. Se usa el mismo formateador en Inicio, Pedidos, carrito, checkout y vitrina. Importes a precisión de dos decimales; no se redondea un precio a soles enteros para mostrarlo. Etiqueta chica en `text/secondary` arriba de cada monto ("Ventas", "Total de la semana"). Componente `Monto` en Inicio. *Reemplaza a 0021 en el peso de los montos.*
- **Variaciones (deltas):** solo la cifra va en color (`feedback/success` si sube, `feedback/error` si baja: "+12 %"); el resto de la frase, en `text/secondary`.
- **Cuerpo / Interfaz (Body & UI):** Sans-Serif neutra (ej. Inter / SF Pro) en pesos Regular y Medium, enfocada en máxima legibilidad en dispositivos móviles.

---

## 4. Arquitectura de Componentes

> **Vigente desde el 16-oct-2026 · Decisión 0024 · Calibrado (SaaS moderno, estilo Stripe / Vercel).** Reemplaza a 0023 · Editorial, que se sentía plana y "de planilla". Manda sobre lo que se contradiga más abajo:
> - **Radios:** tarjetas de 8 px (`radius/card` → `radius/sm`); botones, campos, chips y badges de 6 px (`radius/button`, `radius/chip`, `radius/base` → `radius/xs`). Ni redondo de juguete ni bloque.
> - **Profundidad:** sombra nítida de dos capas `elevation/card` (0 1 2 + 0 2 8, negro al 4 %), sin nubes. *El borde pasa a `border/card` casi invisible y los halos tienen reglas propias (0031).*
> - **Lienzo:** hundido `#F0EFED` (`bg/sunken`); `#666D7A` sigue en ≥ 4.5:1. *El lienzo del panel pasa a `#F8F8F6` (0031).*
> - **CTA:** vuelve el degradado cobalto → marino (`gradient/primary`), en tipo oración. El cobalto sigue la regla de §4 · Selección y cobalto.
> - **Encabezados:** tipo oración y `tracking-tight`; de columnas en Outfit SemiBold (`encabezado-columna`). Las mayúsculas quedan solo para etiquetas chicas de contexto. *Los de sección pasan a Outfit 550 en H3, fuera de los contenedores (0031).*
> - **Sin cambios:** spark (0022), selección en carbón (0019), métricas (0021).

> **Decisión 0031 · De-layering (22-oct-2026, vigente).** Aprobada por Gabi en Inicio después de 6 rondas; toda pantalla nueva o rediseñada la sigue desde el inicio. Manda sobre 0024 y lo de abajo donde se contradiga. Principios del nuevo Admin de Shopify (menos contenedores, la estructura de la página hace el trabajo, color solo para lo que pide atención) y de Stripe (montos serenos); no se copian.
> - **Aire:** 40 px entre secciones en móvil y 48 en desktop. Lienzo `#F8F8F6`.
> - **Menos cajas:** los títulos de sección van **fuera** de los contenedores (`EncabezadoSeccion`). Una lista vive en **un solo contenedor** con divisores finos (`divide-line-subtle`), en móvil y desktop: nada de una tarjeta por fila. La jerarquía la dan el espacio y la tipografía, no los bordes ni las sombras. Contenedor sereno: blanco, radio de tarjeta y `elevation/container` (`shadow-contenedor`: anillo interior de 1 px al 8 % + base de 1 px al 7 %), sin borde extra.
> - **Íconos:** finos (trazo 1.5), gris neutro (`icon/default`), **sin contenedores circulares**. El color queda solo para lo que pide atención.
> - **Urgencia y plazos:** como texto de color, sin píldora ("Vence hoy, a las 8:10 p. m." en `feedback/warning`). Píldoras y badges, solo para estados donde hacen falta (p. ej. el estado de un pedido en una lista, "Pro").
> - **Filas de acción:** toda la fila es el link, de al menos 44 px de alto; chevron simple, sin botones circulares. Orden de lectura: título → plazo → detalle.
> - **Encabezados de sección:** título a la izquierda y acciones silenciosas a la derecha (botón `quiet`: píldora neutra). Una sola acción fuerte por pantalla; en la cabecera, primario y secundario con la misma forma y alto (`radius/button`, 40 px).
> - **Tarjeta protagonista:** como máximo una por pantalla. Cobalto con **degradado corto** (`accent/base` → `accent/pressed`, `bg-hero-suave`; sin marino) y **profundidad en capas** (`elevation/layered`, `shadow-capas`: filo superior interior blanco al 25 %, anillo de 1 px al 8 % y tres sombras cortas apiladas, adaptadas de `@shopify/polaris-tokens`). Sin sombra de color difuminada, sin vidrio y sin grano. Su título también va fuera. **Sin datos** (ventas en 0): la misma tarjeta en versión serena (contenedor blanco, `shadow-contenedor`), sin halo, con una línea de siguiente paso y su acción ("Aún no hay ventas hoy. Comparte tu tienda para recibir la primera." + "Compartir por WhatsApp"); esa acción no se repite en otro lugar de la pantalla.
> - **Halos:** ver §1 (solo detrás de la protagonista o en momentos de logro; nunca de fondo).
> - **Gráficos:** barras **sólidas** y finas con punta redonda (8 px móvil · 16 px desktop); períodos pasados en gris medio (`chart/bar-muted`, `#878D97`, 3.3:1), el actual en cobalto (`accent/base`), y **sin riel** para los períodos que no llegan. Junto a los totales, el gráfico usa el ancho que queda. **Sin datos** (una semana sin ventas): quedan las etiquetas de los períodos y un texto corto en el lugar de las barras ("Aquí verás tus ventas de la semana."); nunca barras de mentira.
> - **Dinero, saludo y tipografía:** ver §3.
> - **Movimiento:** cifras que suben y barras que crecen al entrar (Motion Primitives), escalonadas; todo respeta "reducir movimiento". Sin animaciones perpetuas.
> - **No se copia:** gráficos en cada tarjeta, violeta, analítica densa.

### Tarjetas (Cards)
- Fondo blanco puro (`#FFFFFF`) sobre superficie neutra.
- Esquinas de **`8px`** (`radius/card` → `radius/sm`). *Decisión 0024; antes 12 px (0020) y 16 px.*
- Borde casi invisible `border/card` (1 px, `#F0EFED`, decisión 0031) y sombra de dos capas `elevation/card`: `0 1 2` + `0 2 8`, negro al 4 %. Nada de sombras "nube" difusas. *Antes borde `border/subtle` (0024).*
- **Contenedores de lista y de sección (0031):** `elevation/container` en vez de borde + sombra; ver §4 · 0031.

### Botones
- Esquinas de **`6px`** en botones y campos (`radius/button` → `radius/xs`). *Decisión 0024; antes 8 px (0020), 10 px (0018) y 12 px.* Nunca pill en botones, salvo la acción silenciosa de un encabezado de sección (`quiet`, 0031).
- **Proporciones finas:** botón de **40 px** de alto (relleno 16 a los lados, texto 14) y **36 px** en la variante chica; campo de **40 px** con texto de 16 (para que iOS no haga zoom al enfocar). La zona táctil sigue siendo de 44–48 px con un `::after` invisible.
- Transición suave al tacto (`150ms ease-out`) con micro-reducción de escala (`scale: 0.98`, en Tailwind `active:scale-[0.98]`) al presionar.

### Selección y cobalto (`chip.selected`) — decisiones 0019 y 0020, ratificadas el 16-oct-2026
- **Regla de oro:** el degradado cobalto se usa **solo en dos lugares**:
  1. el **botón de acción primario (CTA)**;
  2. la **tarjeta protagonista** de la pantalla, **como máximo una por pantalla**, con su degradado corto (`bg-hero-suave`, 0031). Hoy: la tarjeta "Hoy" de Inicio.
- Todo lo demás que indica selección o progreso va en negro carbón: `selection/*` e `indicator/*`.
- Chips, fichas y controles seleccionados (opciones de producto, colores, categorías, filtros, radios, tarjetas de opción, interruptores): **fondo negro carbón `#1A1A1A` con texto blanco** (estilo Shop / GOAT). Tokens `selection/bg`, `selection/fg`, `selection/border`.
- Tarjetas de opción seleccionadas: fondo blanco (`selection/subtle`) y borde negro carbón. Sin tinte azul.
- **Interruptores (0042):** al encender, el pomo incluye un Check visible además de `aria-checked`; el estado no depende solo del color. El riel conserva selección carbón y el ícono contrasta con el pomo.
- Barras de progreso, pasos, línea de tiempo y destellos: `indicator/fill` (negro carbón). Ítem de menú activo: `bg/sunken` + `text/primary`. Casillas marcadas: `selection/*`.
- **Excepción:** los links y el botón Fantasma siguen en cobalto (`accent/text`, `#1D4ED8`), para que se reconozcan como links.
- **Gráficos:** ver §4 · 0031 (barras sólidas de 8 · 16 px, sin riel). *Reemplaza a 0021: 24 · 32 px sobre riel `bg/sunken`.*
- **Vidrio sobre la tarjeta protagonista (0021):** retirado en 0031. Dentro de la protagonista, etiquetas chicas y un divisor al 15 %; sin bloques de vidrio.
- **Tarjeta protagonista:** degradado corto cobalto `#2563EB` → `#1E40AF` (`accent/pressed`), 135°, con texto blanco, radio de tarjeta y `elevation/layered`. Ver §4 · 0031. *Antes `gradient/hero` hasta el azul medianoche `#1B365D` (0020), que sigue en el token por si se necesita.*
- **Dato de hoy en gráficos:** la barra del período actual va en cobalto sólido (`accent/base`) y los pasados en `chart/bar-muted`. Es un dato resaltado, no selección ni progreso. Aprobada por Gabi.
- Las barras de progreso, los pasos y la línea de tiempo siguen en `indicator/fill`. El paso actual de "Tienda nueva" se resalta con `selection/subtle` + `selection/border` (0027).
- *Alternativa evaluada y no aplicada:* fondo `#EFF6FF` con borde de 1.5 px y texto `#1D4ED8`. Para cambiar de estilo se editan solo las variables `selection/*` del modo Tiendly.

### Spark: acento cálido y regla del 1 % (decisión 0022)
- **Qué es:** `spark/base` (`#EA580C`, ámbar eléctrico), con `spark/subtle` (`#FFF7ED`) y `spark/text` (`#C2410C`) para badges.
- **Regla del 1 %:** como mucho uno o dos toques por pantalla, siempre en micro-UI de alto impacto:
  - punto de avisos sin leer (con un destello breve de 3 pulsos que respeta "reducir movimiento");
  - badges "Nuevo" o "Pro" (`Badge tone="spark"`: texto `spark/text` sobre `spark/subtle`).
- **Nunca:** botones, fondos, tarjetas, gráficos, links ni estados de error o advertencia (para eso están `feedback/*`). El CTA sigue siendo cobalto, y la selección, carbón.
- **Contraste:** se eligió `#EA580C` y no `#F59E0B` porque llega a 3.6:1 sobre blanco (mínimo 3:1 para elementos no textuales). Para texto, nunca blanco sobre spark (3.6:1, no llega a 4.5:1): se usa `spark/text` sobre `spark/subtle` (≈ 5:1).

### Chips & Badges
- Tamaño reducido (`12px`) con rellenos pastel o transparencias de opacidad baja.
- **Cuándo (0031):** solo para estados donde hacen falta. La urgencia y los plazos van como texto de color, sin píldora.
- **Compactos** en el panel, con esquinas de **6 px** (`radius/chip` → `radius/xs`, decisión 0024): chip de filtro de **28 px** de alto (relleno 12 a los lados, texto 14) y badge de **24 px** (relleno 4 × 8, texto 12). *Alturas de 0020; antes, chip de 32 px (0018).* En la vitrina, las categorías van en pill (es un control, no una tarjeta).
- **Área táctil:** el chip se ve de 28 px, pero en código su zona de toque llega a 44 px (padding invisible o `::after`), para no perder la regla de objetivos táctiles.
- **Descuento (0034):** "−22 %" en `Badge tone="selected"`: el color de selección del tema (carbón en Neutral y Editorial), **nunca rojo**. Va junto al precio normal tachado. "Programada" va en el badge neutro. En la tienda no se muestran fechas.

### Precios y acceso (0041)
- Precio y Precio antes aceptan hasta dos decimales, con teclado decimal; punto o coma al escribir. Los enteros siguen siendo el caso común: se conserva "Ej.: 89". Editar y guardar conserva los céntimos. Las ofertas en lote siguen redondeando a soles enteros por defecto.
- Acceso y onboarding comparten el registro de 0033: titular en dos tonos y URL en el formato real. Registro/ingreso conservan tres ejemplos y beneficios en texto plano; registro desktop lleva halo detrás de la vista protagonista. Código móvil queda enfocado sin vista ni beneficios, con el botón al pie. Datos muestra la tienda propia en vivo con muestras por rubro (0013), compacta bajo el botón en móvil, sin beneficios; link libre con Check y texto success, sin caja. Tienda creada reutiliza la vista de Datos con las mismas muestras por rubro y su nota, y la centra con halo visible que envuelve la tarjeta (`bg-halo-logro`, glow-sky/glow-warm) y entrada suave que respeta reducir movimiento; sin beneficios. Sin destellos, cajas grises ficticias, chips flotantes, checks en círculos ni halo de fondo.
- Tienda creada muestra el nombre, link y estado vacío reales de la tienda de quien se acaba de registrar. Otro conserva los chips y muestra "¿Qué vendes?" para el detalle.

### Tienda: ficha y carrito (0035 y 0036)
- **Ficha:** dos columnas desde 768 px (foto a la izquierda). En el celular, la foto ocupa como máximo el 60 % del alto visible (`svh`), para que el nombre y el precio se vean sin scroll.
- **Carrito como drawer:** panel de 420 px desde la derecha en tablet y desktop, con un velo suave sobre la tienda; pantalla completa en el celular. Pie fijo con el subtotal, "Finalizar compra" (CTA) y "Seguir comprando". Las líneas van en UN contenedor con divisores (0031).

---

## 5. Temas de Personalización de la Tienda

### Plan Free (3 Temas Curados)
1. **Neutral:** Minimalista, directo y enfocado en el producto (estilo Uniqlo / GOAT).
   - *Decisión 0025 (16-oct-2026):* titulares en **Outfit SemiBold** (antes Bricolage Grotesque Bold), fotos y tarjetas de 8 px, chips y botones de 6 px. Acento y selección en negro carbón. La UI se aparta: la foto manda.
   - Vitrina mobile-first: cabecera fija mínima (nombre al centro, carrito a la derecha con punto spark si hay productos), categorías en fila desplazable, grilla de 2 columnas (3 en tablet, 4 en desktop) con fotos 4:5 y filo de 1 px al 5 %. Sin botón "agregar" en la grilla: toda la tarjeta lleva al producto.
   - El crédito "Hecho con Tiendly" va atenuado en el pie, como en el Figma de la vitrina (el token `color-tiendly` queda disponible si se quiere en cobalto).
2. **Editorial:** Refinado, tipo revista o catálogo D2C con tipografías de alto contraste (estilo Zara / SKIMS).
   - *Referencia en Figma (16-oct-2026), la usa Heather:* logo en serif a la izquierda y categorías al centro; títulos en Instrument Serif; fotos sobre blanco con borde de 1 px y esquinas a 0; color con muestras redondas y las demás opciones (p. ej. talla) en botones cuadrados (agotadas deshabilitadas); CTA negro "Agregar al carrito" + "Consultar por WhatsApp"; envío, pago y cambios; "Sobre el modelo" y "También te puede gustar"; pie con logo en círculo.
   - El CTA de cada tema sale de su acento (`bg-cta` arma el degradado con `accent/base` → `accent/base-deep` en el elemento): negro en Editorial y Neutral, cobalto en el panel.
3. **Suave:** Cálido, cercano y acogedor con bordes redondeados y tonos crema (estilo Blank Street / Shop).

### Plan Pro (Monetización & Personalización Avanzada)
- **Banner de Alto Impacto:** Portada a pantalla completa con overlay dinámico (estilo Subway / Uniqlo). Componente `PortadaPro`; las tiendas Free usan la portada de Figma: solo foto y, debajo, titular y bajada (0027).
- **Remover Marca de Agua:** Opción para ocultar el sello "Powered by Tiendly".
- **Color HEX Infinito:** Selector libre de color de acento y tipografías exclusivas curadas.
- **Badges de Stock Personalizables:** Stickers sobre productos (ej. *"Últimas 2 unidades"*, *"Edición Limitada"*).
- **Mensajes Dinámicos de WhatsApp:** Configuración de textos automáticos prellenados al iniciar compra.
- **Notificaciones de Stock Bajo:** Alertas automáticas para el comerciante vía WhatsApp.
- **Dominio Propio:** Configuración de URL personalizada (`tunegocio.pe`).

---

## 6. Catálogo de Tokens Semánticos (DTCG)

```json
{
  "color": {
    "brand": {
      "primary": { "value": "#2563EB" },
      "primary-deep": { "value": "#1B365D" },
      "primary-dark": { "value": "#1D4ED8" },
      "soft-glow": { "value": "rgba(37, 99, 235, 0.08)" },
      "glow-sky": { "value": "#2563EB29 → #EFF6FF" },
      "glow-warm": { "value": "rgba(251, 146, 60, 0.04)" },
      "ice-accent": { "value": "#EFF6FF" }
    },
    "surface": {
      "background": { "value": "#F8F9FA" },
      "card": { "value": "#FFFFFF" },
      "muted": { "value": "#F3F4F6" }
    },
    "text": {
      "primary": { "value": "#1A1A1A" },
      "secondary": { "value": "#6B7280" },
      "on-brand": { "value": "#FFFFFF" }
    }
  },
  "spacing": {
    "xs": { "value": "4px" },
    "sm": { "value": "8px" },
    "md": { "value": "16px" },
    "lg": { "value": "24px" },
    "xl": { "value": "32px" }
  },
  "radii": {
    "chip": { "value": "999px" },
    "button": { "value": "8px" },
    "card": { "value": "12px" },
    "pill": { "value": "999px" }
  }
}
```
---

## 7. Implementación en Figma y tokens (anexo, 15-oct-2026)

> Anexo agregado al aplicar esta guía. No cambia las reglas de arriba: dice dónde vive cada una.

- **Fuente de verdad de los tokens:** `design/tokens.json` en este repo (decisión 0026; `npm run tokens` genera `tokens.css` y `tokens.ts`) (formato DTCG real: `$value`, `$type`, alias `{grupo.token}`). El JSON de la sección 6 es un resumen y usa `value` sin `$`, que las herramientas DTCG no leen.
- **Mapeo de la sección 6 a las variables de Figma:**

| DESIGN.md | Variable en Figma | Valor |
|---|---|---|
| `color.brand.primary` | `accent/base` (modo Tiendly) | `#2563EB` |
| `color.brand.primary-deep` | `accent/base-deep` (fin del degradado primario) | `#1B365D` |
| `color.brand.primary-dark` | `accent/hover` y `accent/text` | `#1D4ED8` |
| `color.brand.glow-sky` | `glow/sky/from` → `glow/sky/to` | cobalto 16 % → `#EFF6FF` |
| `color.brand.glow-warm` | `glow/warm` (en `Sombra/Baja` y `Halo/Cálido`) | durazno 4 % |
| — (presionado) | `accent/pressed` | `#1E40AF` |
| `color.brand.soft-glow` | `accent/glow` | cobalto al 8 % |
| `color.brand.ice-accent` | `accent/subtle` | `#EFF6FF` |
| `color.surface.background` | `bg/page` | `#F8F9FA` |
| `color.surface.card` | `bg/surface` | `#FFFFFF` |
| `color.surface.muted` | `bg/sunken` | `#F3F4F6` |
| Esqueleto de carga | `bg/skeleton` | `#E5E7EB` (se distingue sobre blanco) |
| `color.text.primary` | `text/primary` | `#1A1A1A` |
| `color.text.secondary` | `text/secondary` | `#666D7A` (ajustado de `#6B7280` por contraste, 0016) |
| `color.text.on-brand` | `accent/contrast` | `#FFFFFF` |
| `chip.selected` | `selection/bg` · `selection/fg` · `selection/border` · `selection/subtle` | `#1A1A1A` · `#FFFFFF` · `#1A1A1A` · `#FFFFFF` |
| `spacing.xs … xl` | `space/1, 2, 4, 6, 8` | 4 · 8 · 16 · 24 · 32 |
| `radii.chip` | `radius/chip` | 6 px en Tiendly (chip 28 px, badge 24 px de alto) |
| `radii.button` | `radius/button` | 6 en Tiendly (botones y campos) |
| `radii.card` | `radius/card` | 8 en Tiendly |
| `radii.pill` | `radius/full` | 9999 |
| Sombra de tarjeta | `elevation.card` (0024) | 0 1 2 + 0 2 8, negro 4 % |
| Sombra suave de vidrio y avisos | estilo `Sombra/Baja` (`elevation.low`) | 0 4 20 negro 4 % + halo cálido 0 12 40 |
| Cifras grandes | `font/metric-style` (0021) | Outfit SemiBold (600), tracking-tight, tabulares: solo totales desde 0031 |
| Títulos de página y sección (0031) | `font/title-style` · `font/section-style` | Outfit 500 · Outfit variable 550 |
| `color.brand.spark` | `spark/base` · `spark/subtle` · `spark/text` (0022) | `#EA580C` · `#FFF7ED` · `#C2410C` |
| Celebración | estilo `Halo/Cálido` (`elevation.celebration`) | halo cálido + glow celeste: solo momentos de logro (0031) |
| Halo de la protagonista (0031) | utilidad `bg-halo-hoy` | `glow/warm` en capas + toque de `glow/sky`, solo detrás de la tarjeta |
| Tarjeta protagonista | utilidad `bg-hero-suave` + `elevation/layered` (0031) | cobalto → `accent/pressed`, 135°; filo blanco 25 %, anillo 1 px 8 %, tres sombras cortas |
| Contenedor sereno (0031) | `elevation/container` | anillo interior 1 px al 8 % + base 0 1 0 al 7 % |
| Borde de tarjeta (0031) | `border/card` | `#F0EFED` |
| Barras pasadas (0031) | `chart/bar-muted` → `color/neutral/450` | `#878D97` (3.3:1) |
| Calibrado (0024) | `bg/sunken` · `border/subtle` · `radius/sm` · `radius/xs` | `#F0EFED` · `#E5E7EB` · 8 px · 6 px |
| Lienzo del panel (0031) | `bg/page` → `color/paper/50` | `#F8F8F6` (vitrinas: `#F4F4F3`) |
| Tipografía de cuerpo | `font/body` | Inter |
| Tipografía de titulares | `font/display` + `font/display-style` / `font/hero-style` (modo Tiendly) | Outfit SemiBold (600) para el resto de titulares; páginas y secciones según 0031 |
| Estado informativo | `feedback/info/*` | teal: `#0D9488` en rellenos e íconos, `#0F766E` en texto (0016) |
| Transición de botones | `motion.duration.fast`, `motion.easing.standard`, `motion.scale.pressed` | 150 ms · ease-out · 0.98 |

- **Contraste medido (modo Tiendly, fondo claro):** texto blanco sobre `#2563EB` 5.17:1 · sobre `#1D4ED8` 6.70:1 · `#1D4ED8` como link sobre blanco 6.70:1 · `#666D7A` sobre blanco 5.21:1, sobre `#F8F9FA` 4.94:1 y sobre `#F3F4F6` 4.73:1.
- **Temas de la tienda:** Neutral, Editorial y Suave mantienen su propio acento. El cobalto es de Tiendly (panel, onboarding, marca) y del crédito "Powered by Tiendly".

- **Pro (V1.1):** componentes base en Figma → Components → "Pro · V1.1": Sello de producto, Banner de portada y Mensaje de WhatsApp · vista previa. Las pantallas de configuración se diseñan después del lanzamiento del Core Loop.
- **Prioridad ante diferencias con CLAUDE.md:** manda este documento. Vigente desde el 22-oct (decisiones 0024 y 0031): tarjetas de 8 px con borde casi invisible y sombra nítida; listas en un solo contenedor con divisores; títulos de sección fuera; botones, campos, chips y badges de 6 px; degradado cobalto solo en el CTA y en una tarjeta protagonista por pantalla (corto y con profundidad en capas); lienzo `#F8F8F6`; títulos de página en Outfit Medium y de sección a 550; escala `0.98` al presionar.
- **Congelamiento estético:** se levantó solo para el pase 0031, ya cerrado. Cualquier cambio visual nuevo necesita la aprobación de Gabi (ver CLAUDE.md).
- **Banner Pro (V1.1):** el overlay `overlay/hero` se valida con fotos claras reales antes de lanzar, para que el texto blanco se lea.
