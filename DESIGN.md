# 🎨 DESIGN.md — Tiendly Design System & Brand Guidelines (V1)

Este documento es la guía oficial e inmutable del sistema de diseño para **Tiendly**. Contiene las reglas estéticas, la arquitectura de tokens, los componentes visuales y las pautas de micro-copy que deben respetarse en el diseño de prototipos y en la generación de código frontend.

---

## 1. Dirección de Marca & Identidad Visual

### Concepto Estético
La identidad visual de Tiendly combina **velocidad ultra limpia**, **lenguaje moderno** (inspirado en Luma, Shop e Hypelist) y **espacios creativos** donde los comerciantes sientan orgullo y gusto al dar vida a sus tiendas online.

### Paleta de Color Primaria
- **Color de Marca (Cobalto Eléctrico):** el primario **no es un relleno plano**: es un degradado de `#2563EB` (cobalto) a `#1B365D` (marino profundo), a 135°. `#1D4ED8` queda para hover y links. *(Recalibrado el 15-oct-2026 para diferenciarse del azul plano de Tiendanube y Mercado Pago, decisión 0017.)*
- **Gama de Soporte (Estilo Luma):**
  - `color.brand.glow-sky`: halo difuminado del cobalto (16 %) hacia celeste pastel `#EFF6FF`.
  - `color.brand.glow-warm`: halo cálido (durazno al 4 %) que da profundidad a tarjetas y estados de celebración.
  - Opacidad baja del cobalto (`rgba(37, 99, 235, 0.08)`) para selecciones suaves.
- **Superficie y Lienzo:** Fondo neutro de pantalla `#F8F9FA` o `#F6F5F3` con tarjetas blanco puro `#FFFFFF`.
- **Texto:** `#1A1A1A` (Primario) / `#6B7280` (Secundario / Muted).

---

## 2. Pautas de Lenguaje & Micro-copy

### Lenguaje Neutral
- Se adopta globalmente el término **"cliente"** para referirse a la persona que compra en la tienda.
- Evitar lenguaje marcado por género o redacciones impersonales rígidas.

### Regla del Punto Final
- **TODOS** los textos de ayuda (*helper text*), descripciones de campos, mensajes de validación y explicaciones secundarias deben **finalizar obligatoriamente con un punto (`.`)**.
- Los títulos, placeholders y botones directos no llevan punto final.

### Estructura de Productos
- **Principio Unificado:** 1 modelo = 1 producto con variantes de colorway y talla.

---

## 3. Tipografía & Jerarquía

- **Titulares (Headings):** **Outfit SemiBold (600)** en Display y H1–H3, con `tracking-tight`; Medium (500) para subtítulos de apoyo. Nada de Black (900): se ve pesado y "de juguete". *Cambiado el 16-oct-2026 (decisión 0020 · Sleek & Crisp).*
- **Cuerpo / Interfaz (Body & UI):** Sans-Serif neutra (ej. Inter / SF Pro) en pesos Regular y Medium, enfocada en máxima legibilidad en dispositivos móviles.

---

## 4. Arquitectura de Componentes

### Tarjetas (Cards)
- Fondo blanco puro (`#FFFFFF`) sobre superficie neutra.
- Esquinas precisas: `border-radius: 12px` (`radii.card`). *Bajado de 16 px el 16-oct-2026 (decisión 0020).*
- Sombras sutiles y difuminadas (`0px 4px 20px rgba(0, 0, 0, 0.04)`).

### Botones
- Esquinas de **`8px`** en botones y campos (`radii.button`, que también usan los inputs). *Bajado de 10 px el 16-oct-2026 (decisión 0020); antes, de 12 a 10 px (0018).* Nunca pill en botones.
- **Proporciones finas:** botón de **40 px** de alto (relleno 16 a los lados, texto 14) y **36 px** en la variante chica; campo de **40 px** con texto de 16 (para que iOS no haga zoom al enfocar). La zona táctil sigue siendo de 44–48 px con un `::after` invisible.
- Transición suave al tacto (`150ms ease-out`) con micro-reducción de escala (`scale: 0.98`, en Tailwind `active:scale-[0.98]`) al presionar.

### Selección (`chip.selected`) — decisión 0019
- **Regla de oro:** el cobalto con degradado es **exclusivo del botón de acción primario (CTA)**.
- Chips, fichas y controles seleccionados (tallas, colores, categorías, filtros, radios, tarjetas de opción, interruptores): **fondo negro carbón `#1A1A1A` con texto blanco** (estilo Shop / GOAT). Tokens `selection/bg`, `selection/fg`, `selection/border`.
- Tarjetas de opción seleccionadas: fondo blanco (`selection/subtle`) y borde negro carbón. Sin tinte azul.
- Barras de progreso, pasos, línea de tiempo y destellos: `indicator/fill` (negro carbón). Ítem de menú activo: `bg/sunken` + `text/primary`. Casillas marcadas: `selection/*`.
- **Excepción:** los links y el botón Fantasma siguen en cobalto (`accent/text`, `#1D4ED8`), para que se reconozcan como links.
- **Excepciones (0020):**
  - La tarjeta protagonista del panel ("Hoy") usa `gradient/hero` (cobalto `#2563EB` → azul medianoche `#1B365D`, 135°) con texto blanco, filo interior de 1 px al 15 % y radio de tarjeta. Hay una sola por vista. Dentro, los bloques secundarios son vidrio: blanco al 10 %, borde blanco al 10 % y `backdrop-blur-sm` (aún sin token: proponer `effect/blur` en Figma).
  - En el gráfico semanal, la barra de hoy va en cobalto (`accent/base`); el resto de los días, en `chart/bar`. Las barras de progreso y los pasos siguen en `indicator/fill`.
- *Alternativa evaluada y no aplicada:* fondo `#EFF6FF` con borde de 1.5 px y texto `#1D4ED8`. Para cambiar de estilo se editan solo las variables `selection/*` del modo Tiendly.

### Chips & Badges
- Tamaño reducido (`12px`) con rellenos pastel o transparencias de opacidad baja.
- **Pills compactos** en el panel (`radii.chip: 999px`): chip de filtro de **28 px** de alto (relleno 12 a los lados, texto 14) y badge de **24 px** (relleno 4 × 8, texto 12). Los chips y badges siguen en pill; los botones, no. *Ajustado el 16-oct-2026 (decisión 0020); antes, chip de 32 px (0018).*
- **Área táctil:** el chip se ve de 28 px, pero en código su zona de toque llega a 44 px (padding invisible o `::after`), para no perder la regla de objetivos táctiles.

---

## 5. Temas de Personalización de la Tienda

### Plan Free (3 Temas Curados)
1. **Neutral:** Minimalista, directo y enfocado en el producto (estilo Uniqlo / GOAT).
2. **Editorial:** Refinado, tipo revista o catálogo D2C con tipografías de alto contraste (estilo Zara / SKIMS).
3. **Suave:** Cálido, cercano y acogedor con bordes redondeados y tonos crema (estilo Blank Street / Shop).

### Plan Pro (Monetización & Personalización Avanzada)
- **Banner de Alto Impacto:** Portada a pantalla completa con overlay dinámico (estilo Subway / Uniqlo).
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

- **Fuente de verdad de los tokens:** `tiendly/design-system/tokens.json` (formato DTCG real: `$value`, `$type`, alias `{grupo.token}`). El JSON de la sección 6 es un resumen y usa `value` sin `$`, que las herramientas DTCG no leen.
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
| `radii.chip` | `radius/chip` | pill en Tiendly (chip 28 px, badge 24 px de alto) |
| `radii.button` | `radius/button` | 8 en Tiendly (botones y campos) |
| `radii.card` | `radius/card` | 12 en Tiendly |
| `radii.pill` | `radius/full` | 9999 |
| Sombra de tarjeta | estilo `Sombra/Baja` (`elevation.low`) | 0 4 20 negro 4 % + halo cálido 0 12 40 |
| Celebración | estilo `Halo/Cálido` (`elevation.celebration`) | halo cálido + glow celeste |
| Tarjeta protagonista | `gradient/hero` | cobalto → azul medianoche, 135° (0020) |
| Tipografía de cuerpo | `font/body` | Inter |
| Tipografía de titulares | `font/display` + `font/display-style` / `font/hero-style` (modo Tiendly) | Outfit SemiBold (600) en Display y H1–H3 (0020) |
| Estado informativo | `feedback/info/*` | teal: `#0D9488` en rellenos e íconos, `#0F766E` en texto (0016) |
| Transición de botones | `motion.duration.fast`, `motion.easing.standard`, `motion.scale.pressed` | 150 ms · ease-out · 0.98 |

- **Contraste medido (modo Tiendly, fondo claro):** texto blanco sobre `#2563EB` 5.17:1 · sobre `#1D4ED8` 6.70:1 · `#1D4ED8` como link sobre blanco 6.70:1 · `#666D7A` sobre blanco 5.21:1, sobre `#F8F9FA` 4.94:1 y sobre `#F3F4F6` 4.73:1.
- **Temas de la tienda:** Neutral, Editorial y Suave mantienen su propio acento. El cobalto es de Tiendly (panel, onboarding, marca) y del crédito "Powered by Tiendly".

- **Pro (V1.1):** componentes base en Figma → Components → "Pro · V1.1": Sello de producto, Banner de portada y Mensaje de WhatsApp · vista previa. Las pantallas de configuración se diseñan después del lanzamiento del Core Loop.
- **Prioridad ante diferencias con CLAUDE.md:** manda este documento. Vigente desde el 16-oct (decisión 0020 · Sleek & Crisp): escala `0.98` al presionar; tarjetas de 12 px; botones y campos de 8 px y 40 px de alto; chips en pill de 28 px y badges de 24 px; titulares en Outfit SemiBold.
- **Banner Pro (V1.1):** el overlay `overlay/hero` se valida con fotos claras reales antes de lanzar, para que el texto blanco se lea.
