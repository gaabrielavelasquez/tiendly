# 0020 · Sleek & Crisp

- **Fecha:** 16-oct-2026
- **Estado:** aceptada (Gabi). Los radios y las alturas los reemplaza [0024](0024-calibrado.md); la tarjeta protagonista y la barra de hoy siguen vigentes.
- **Commit:** `de52ef7` (PR #2).

## Contexto

El panel se veía "chubby": titulares en Black (900), radios de 16 px en tarjetas y de 10 px en botones, controles altos. Se sentía de juguete al lado de referencias como Bizee o Stripe.

## Decisión

- Titulares (Display y H1–H3) en **Outfit SemiBold (600)**, con `tracking-tight`. Nada de Black.
- Proporciones finas: botón de 40 px (chico de 36), campo de 40 px con texto de 16 (sin zoom en iOS) y chip de 28 px. La zona táctil sigue en 44–48 px con un `::after` invisible.
- Radios bajan: tarjeta de 16 a 12 px y botón de 10 a 8 px (hoy: 8 y 6, por 0024).
- **Excepciones a 0019:**
  - La tarjeta protagonista del panel ("Hoy") usa `gradient/hero` (cobalto `#2563EB` → azul medianoche `#1B365D`, 135°) con texto blanco. Una sola por vista.
  - En el gráfico semanal, la barra de hoy va en cobalto (`accent/base`).
- **Ratificado por Gabi (16-oct-2026):** la tarjeta "Hoy" en cobalto y la barra de hoy en cobalto quedan aprobadas. DESIGN.md §4 lo escribe como regla, no como excepción.

## Consecuencias

- Tokens: `font.display-style` y `font.hero-style` a 600; `gradient.hero` nuevo.
- Utilidades: `bg-hero` y `bg-bar-today`.
- El cobalto con degradado ya no es exclusivo del CTA: lo comparte con una tarjeta protagonista por pantalla.
