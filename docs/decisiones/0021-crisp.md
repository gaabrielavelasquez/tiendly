# 0021 · Crisp: métricas, sombra de tarjeta, gráfico y vidrio

- **Fecha:** 16-oct-2026
- **Estado:** aceptada (Gabi). La sombra la ajusta [0024](0024-calibrado.md); lo demás sigue vigente.
- **Commit:** `32a27b5`.

## Contexto

Después de 0020, las cifras grandes no tenían un estilo propio, la sombra de las tarjetas era una "nube" difusa y las barras del gráfico en píldora parecían bloques.

## Decisión

- Token `font/metric-style`: Outfit SemiBold (600), `tracking-tight` y números tabulares (utilidad `font-metric`) para montos y totales.
- Token `elevation/card`: sombra nítida de dos capas (hoy `0 1 2 + 0 2 8`, negro al 4 %, por 0024).
- Gráfico semanal: barras finas de 24 px en móvil y 32 px en desktop, con radio de tarjeta (no píldora), sobre un riel `bg/sunken`.
- Vidrio dentro de la tarjeta protagonista: blanco al 10 %, `ring-1` blanco al 20 % y `backdrop-blur-md`.

## Consecuencias

- `shadow-card` apunta a `elevation/card`; se quita `shadow-soft`.
- El blur no tiene token todavía: queda pendiente `effect/blur`.
