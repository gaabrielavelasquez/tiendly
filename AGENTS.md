# AGENTS.md — Reglas para cualquier agente (Codex, Claude Code y otros)

Este repo tiene **una sola fuente de reglas**. Antes de escribir o cambiar código, lee y sigue:

1. **[`CLAUDE.md`](CLAUDE.md):** principios, reglas de negocio y micro-copy, congelamiento estético y **Workflow**. Aunque se llame así, aplica a todos los agentes.
2. **[`DESIGN.md`](DESIGN.md):** sistema visual y tokens. Ante cualquier diferencia con otro documento, manda `DESIGN.md`.
3. **[`docs/decisiones/`](docs/decisiones/README.md):** decisiones de producto y diseño. Si una decisión contradice un documento más viejo, manda la decisión más reciente.

No dupliques esas reglas aquí: si algo cambia, se cambia en `CLAUDE.md` o `DESIGN.md` y este archivo sigue valiendo.

## Recordatorios que más se olvidan

- **El repo manda en lo visual; Figma, en flujos y estructura** (decisión 0026). Archivo `zHR0uS37OATafFq7U4NEwr`, página **Flujos** (`1:65`).
- **Congelamiento estético:** no cambies colores, radios, sombras, tipografías ni espacios. No edites a mano `src/styles/tokens.css` ni `tokens.ts` (salen de `design/tokens.json` con `npm run tokens`). Las pantallas nuevas reutilizan componentes y tokens existentes.
- **Copy:** tuteo, la palabra «cliente», punto final en ayudas, errores y descripciones. Sin género (0032): «la tienda» o «quien vende», nunca «vendedora» ni «emprendedora»; se reformula en vez de usar «@», «x» o «e». Multirubro: ejemplos de varias categorías.
- **Cuatro estados** en cada vista: carga, vacío, con datos y error.
- **De-layering (0031)**, en toda pantalla nueva o rediseñada (detalle en `CLAUDE.md` §5 y `DESIGN.md` §3–4):
  - títulos de sección fuera de los contenedores, y cada lista en UN contenedor con divisores;
  - íconos finos y grises, sin círculos;
  - urgencia como texto de color, sin píldora;
  - montos en Regular o Medium con cifras tabulares (SemiBold solo en totales);
  - degradado cobalto solo en el CTA y en una tarjeta protagonista por pantalla; la selección va en carbón (`selection/*`);
  - halos solo detrás de la protagonista o en momentos de logro.
- **Decisiones recientes** (índice en `docs/decisiones/README.md`):
  - 0032: multirubro, sin género y variantes como opciones genéricas.
  - 0033: registro.
  - 0034: ofertas con precio antes, fechas y sección con nombre propio; la etiqueta de descuento va en el color de selección del tema, nunca en rojo.
  - 0035: ficha en dos columnas desde 768 px.
  - 0036: el carrito es un drawer; /carrito sigue como página.
  - 0037 (en el PR #27): tabla de tallas por producto.
- **Datos simulados:** pagos, SUNAT, bancos y envíos son mocks. No envíes mensajes, cobros ni confirmaciones reales, y no uses números de teléfono reales para pruebas.

## Workflow (resumen de `CLAUDE.md` §7)

1. Una rama por módulo, desde `main`. Un PR por rama.
2. Mobile-first: primero 390 px, después 1440 px.
3. Antes del PR: `npm run check:tokens` y `npm run build` sin errores.
4. Revisa las pantallas en el navegador a 390 y 1440 px y adjunta capturas al PR.
5. Prueba con datos reales y largos (URLs de preview de Vercel, nombres y precios largos) y confirma que no hay scroll horizontal en 360 y 390 px antes de abrir el PR.
   - **Mide en el preview de Vercel, no en localhost.** `document.documentElement.scrollWidth` no puede pasar del ancho de la pantalla. El preview de una rama aparece al abrir el PR; espera a que el check de Vercel esté en verde.
   - Los previews están protegidos: para Playwright, usa el header `x-vercel-trusted-oidc-idp-token` con el token de `vercel env pull`, guardado en una carpeta temporal y borrado después. No lo subas al repo.
   - En los previews los datos viven en la memoria de cada instancia (no hay Redis). Lo que guarda el panel puede no verse en la tienda: los flujos que guardan se prueban con un solo proceso local (`next start`, con `TIENDLY_TIENDA_DEMO=muna` para usar MUÑA).
   - Revisa en Safari de iPhone (WebKit) además de Chrome. Los campos de menos de 16 px hacen zoom al tocarlos.
6. **Nunca hagas merge sin la aprobación de Gabi.** Para integrar ramas apiladas se usa *merge commit*, no squash. No hagas force-push.

## Trabajo en paralelo entre agentes

- **No cambies la rama del espacio de trabajo principal sin avisar:** Gabi lo usa con `npm run dev` en el puerto 3000. Para otra rama, usa un `git worktree` aparte.
- No corras `npm run build` en la carpeta del servidor de desarrollo (pisa `.next`): hazlo en el worktree.
- No incluyas archivos ajenos en los commits (por ejemplo, `.DS_Store`).
- Al terminar, deja en el PR qué quedó pendiente y qué se simuló, para que el próximo agente siga desde ahí. El estado general y las próximas tareas están en [`docs/traspaso.md`](docs/traspaso.md).
- **Datos de producción** (Upstash Redis, claves `production:tienda:<slug>`): no los borres ni los reinicies sin el ok de Gabi.
