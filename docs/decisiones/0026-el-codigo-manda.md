# 0026 · El código es la fuente de verdad

- **Fecha:** 16-oct-2026
- **Estado:** aceptada (Gabi). Vigente.

## Contexto

Entre 0020 y 0025 el sistema visual cambió seis veces en un día, siempre en código. Figma quedó atrás: sus variables no tienen esos cambios y las decisiones solo vivían en mensajes de commit. Tener dos fuentes que dicen cosas distintas genera dudas en cada pantalla nueva.

## Decisión

- **Las reglas visuales viven en el repo:** `DESIGN.md`, `design/tokens.json` (de donde salen `tokens.css` y `tokens.ts`) y el código de los componentes. Ante una diferencia con Figma, manda el repo.
- **Figma sigue siendo la referencia de flujos y de estructura de pantallas:** qué pantallas hay, qué contienen y en qué orden.
- Cada decisión de diseño se escribe en `docs/decisiones/` (contexto, decisión y consecuencias), no solo en el commit.

## Consecuencias

- Las variables de Figma se actualizan desde `tokens.json` cuando haga falta, no al revés.
- Un Figma nuevo de una pantalla se usa por su estructura; colores, radios, sombras, tipografía y espacios se toman de los tokens existentes.
- `DESIGN.md` §7 deja de apuntar a un `tokens.json` fuera del repo.
