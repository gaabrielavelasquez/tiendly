# Tiendly · frontend

Panel de la tienda, vitrina y onboarding. Antes de tocar UI, lee `DESIGN.md` (manda) y `CLAUDE.md`.

## Arrancar

```bash
npm install
npm run dev          # genera los tokens y levanta http://localhost:3000
```

- `/kit`: UI Kit en vivo.
- `/panel`: panel de la tienda.
- `/demo`: vitrina con tema Editorial.
- `/registro`: onboarding.

## Tokens: una sola fuente

```
Figma (variables) → design/tokens.json (DTCG) → npm run tokens → src/styles/tokens.css (--tl-*) → globals.css (@theme) → clases de Tailwind
```

- **Nunca edites `src/styles/tokens.css` ni `tokens.ts`:** se generan solos.
- **Tailwind no trae colores, radios ni sombras propios:** se borraron con `--color-*: initial`. Solo existen las clases del sistema, como `bg-surface`, `text-fg-secondary`, `rounded-card` o `bg-cta`.
- **`npm run check:tokens`** falla si aparece un hex, un `rgb()` o un px escrito a mano. Corre solo antes de cada `build`.
- **Temas de vitrina:** `data-theme="neutral" | "editorial" | "suave" | "custom"` en el contenedor de la tienda. El panel usa el tema Tiendly (`:root`).

## Reglas rápidas (DESIGN.md)

| Elemento | Regla |
|---|---|
| CTA | Degradado cobalto → marino (`bg-cta`) **solo en el botón primario**. |
| Selección | Chips, radios y similares en negro carbón (`bg-selected`). Links en cobalto (`text-accent-text`). |
| Radios | Tarjetas `rounded-card` (16) · botones `rounded-button` (10) · chips y badges `rounded-chip` (pill; chip de 32 px de alto y zona táctil de 44 px). |
| Movimiento | `Pressable`: escala 0.98 y 150 ms ease-out. Respeta "reducir movimiento". |
| Copy | "Cliente" para quien compra y "la tienda" o "quien vende" para quien vende, sin género (0032). Textos de ayuda y descripciones terminan con punto; títulos y botones, no. Tuteo, sin voseo. |
| Estados | Toda vista tiene carga, vacío, con datos y error. |

## Estructura

```
design/tokens.json      tokens DTCG exportados de Figma
scripts/                build-tokens · check-hardcode
src/app/                rutas: (panel) · (tienda)/[tienda] · (onboarding) · kit
src/components/ui/      Button · Chip · Badge · Card · Skeleton · EmptyState
src/components/motion/  Pressable (Motion)
src/features/<módulo>/  components/ + hooks/ por módulo aprobado (ver features/README.md)
src/lib/                utilidades (cn)
```
