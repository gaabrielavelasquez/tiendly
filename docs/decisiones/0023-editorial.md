# 0023 · Editorial (reemplazada)

- **Fecha:** 16-oct-2026
- **Estado:** **reemplazada** por [0024 · Calibrado](0024-calibrado.md) el mismo día. Solo sigue vigente el lienzo cálido.
- **Commit:** `0d752ec`.

## Contexto

Se probó llevar el panel a un estilo editorial: esquinas casi rectas, tarjetas planas y un CTA negro, para alejarlo del look SaaS genérico.

## Decisión (en su momento)

- Radios de 0–2 px; tarjetas planas con borde de 1 px y sin sombra.
- Lienzo cálido: `bg/page` `#F4F4F3` y `bg/sunken` `#F0EFED` (`#666D7A` sigue en ≥ 4.5:1).
- CTA negro sólido en mayúsculas con tracking amplio; encabezados de sección y de columnas en mayúsculas.

## Consecuencias

- Se sintió plano y "de planilla"; 0024 lo revierte.
- Queda el lienzo cálido y la utilidad `rounded-theme`, que reemplazó a `rounded-sm` en 22 archivos.
