# Tiendly · frontend

Panel de la tienda, vitrina y onboarding. Antes de tocar UI, lee `DESIGN.md` (manda) y [`CLAUDE.md`](../CLAUDE.md), en la raíz del repo. Los comandos `npm` se corren en esta carpeta.

## Arrancar

Para la app con backend Cloudflare, desde esta carpeta en un worktree aislado:

```sh
npm ci --prefix ..
npm run dev:cloudflare
```

Abre `http://localhost:3215/registro`. El comando prepara variables privadas y migraciones D1 locales; R2 también se emula. Para ingresar con Google se necesitan las credenciales del cliente de pruebas y su callback local. `npm run dev` conserva el servidor Next anterior, sin los bindings D1 de la migración.

## QA y producción

QA vigente: [preview.tiendly.workers.dev](https://preview.tiendly.workers.dev/muna), Worker `preview`, D1/R2 exclusivos de pruebas y Google configurado. El dominio anterior `tiendly-preview.tiendly.workers.dev` es histórico. Producción continúa en Vercel desde `main`.

CI valida los cambios; el despliegue alojado queda desactivado. Desde un commit limpio, `npm run release:qa` valida y publica usando el perfil Wrangler local `tiendly`. Si ya se completaron los checks Next/backend, usa `npm run deploy:cloudflare-preview`. Los PRs no publican el QA automáticamente. No ejecuta migraciones remotas. `npm run verify:qa` confirma salud y SHA del artefacto construido.

Procedimiento, credenciales, aislamiento y pendientes: [Desarrollo local, QA y producción](../docs/configuracion/entornos.md). Evidencia previa: [OAuth](../docs/verificacion/oauth-preview/README.md) y [D1/R2](../docs/verificacion/d1-r2-preview/README.md). El core loop de comercio todavía no está migrado.

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

## API separada (primer corte)

`npm run dev:api` arranca Next en 3220 y conecta por HTTP a la API local en 3221. Gabi no necesita credenciales de infraestructura en el frontend. Identidad, tiendas, catálogo y fotos tienen adaptador HTTP; el resto de comercio sigue pendiente. El modo anterior continúa disponible sin `TIENDLY_API_URL`. Consulta el [procedimiento y los límites](../docs/backend/separacion-api.md).
