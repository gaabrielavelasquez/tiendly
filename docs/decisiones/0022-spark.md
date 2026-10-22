# 0022 · Spark: acento cálido con la regla del 1 %

- **Fecha:** 16-oct-2026
- **Estado:** aceptada (Gabi). Vigente.
- **Commit:** `2ceca4c`.

## Contexto

Con cobalto y negro carbón, el panel se sentía frío. Hacía falta un contrapunto cálido que no compitiera con el CTA ni con los estados de error y advertencia.

## Decisión

- Tokens `spark/base` (`#EA580C`), `spark/subtle` (`#FFF7ED`) y `spark/text` (`#C2410C`).
- **Regla del 1 %:** uno o dos toques por pantalla, solo en micro-UI de alto impacto: el punto de avisos sin leer (destello de 3 pulsos que respeta "reducir movimiento") y los badges "Nuevo" o "Pro".
- **Nunca** en botones, fondos, tarjetas, gráficos, links ni estados de error o advertencia.
- Se eligió `#EA580C` y no `#F59E0B` por contraste: 3.6:1 sobre blanco (mínimo 3:1 para elementos no textuales). Para texto, `spark/text` sobre `spark/subtle` (≈ 5:1), nunca blanco sobre spark.

## Consecuencias

- `Badge tone="spark"` y la animación `animate-spark`.
- El punto del carrito de la vitrina también es spark.
