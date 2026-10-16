# 0024 · Calibrado

- **Fecha:** 16-oct-2026
- **Estado:** aceptada (Gabi). **Estándar vigente del panel.**
- **Commit:** `9c7f4c5`.

## Contexto

0023 (Editorial) se sentía plana y de planilla; 0020 todavía era algo redonda. Se buscó un punto medio estilo SaaS moderno (Stripe / Vercel): ni redondo de juguete ni bloque.

## Decisión

- Radios: tarjetas de **8 px** (`radius/card` → `radius/sm`); botones, campos, chips y badges de **6 px** (`radius/button`, `radius/chip`, `radius/base` → `radius/xs`).
- Tarjetas blancas con borde de 1 px `#E5E7EB` (`border/subtle`) y sombra nítida `elevation/card` (`0 1 2 + 0 2 8`, negro al 4 %). Sin halos.
- Se mantiene el lienzo cálido de 0023 (`#F4F4F3` y `#F0EFED`).
- Vuelve el CTA con degradado cobalto → marino, en tipo oración.
- Encabezados de sección y de columnas en Outfit SemiBold, tipo oración y `tracking-tight`. Las mayúsculas quedan para etiquetas chicas ("HOY").

## Consecuencias

- Solo cambia el modo Tiendly de los tokens; los temas de tienda no.
- `bg-cta` arma el degradado con `accent/base` → `accent/base-deep` en el propio elemento, así cada tema pinta su CTA.
