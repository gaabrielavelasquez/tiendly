# AGENTS.md — Reglas para cualquier agente (Codex, Claude Code y otros)

Este repo tiene **una sola fuente de reglas**. Antes de escribir o cambiar código, lee y sigue:

1. **[`CLAUDE.md`](CLAUDE.md):** principios, reglas de negocio y micro-copy, congelamiento estético y **Workflow**. Aunque se llame así, aplica a todos los agentes.
2. **[`DESIGN.md`](DESIGN.md):** sistema visual y tokens. Ante cualquier diferencia con otro documento, manda `DESIGN.md`.
3. **[`docs/decisiones/`](docs/decisiones/README.md):** decisiones de producto y diseño. Si una decisión contradice un documento más viejo, manda la decisión más reciente.

No dupliques esas reglas aquí: si algo cambia, se cambia en `CLAUDE.md` o `DESIGN.md` y este archivo sigue valiendo.

## Recordatorios que más se olvidan

- **El repo manda en lo visual; Figma, en flujos y estructura** (decisión 0026). Archivo `zHR0uS37OATafFq7U4NEwr`, página **Flujos** (`1:65`).
- **Congelamiento estético:** no cambies colores, radios, sombras, tipografías ni espacios. No edites a mano `src/styles/tokens.css` ni `tokens.ts` (salen de `design/tokens.json` con `npm run tokens`). Las pantallas nuevas reutilizan componentes y tokens existentes.
- **Copy:** tuteo, la palabra «cliente» (neutral) y punto final en ayudas, errores y descripciones.
- **Cuatro estados** en cada vista: carga, vacío, con datos y error.
- **Datos simulados:** pagos, SUNAT, bancos y envíos son mocks. No envíes mensajes, cobros ni confirmaciones reales, y no uses números de teléfono reales para pruebas.

## Workflow (resumen de `CLAUDE.md` §7)

1. Una rama por módulo, desde `main`. Un PR por rama.
2. Mobile-first: primero 390 px, después 1440 px.
3. Antes del PR: `npm run check:tokens` y `npm run build` sin errores.
4. Revisa las pantallas en el navegador a 390 y 1440 px y adjunta capturas al PR.
5. **Nunca hagas merge sin la aprobación de Gabi.** Para integrar ramas apiladas se usa *merge commit*, no squash. No hagas force-push.

## Trabajo en paralelo entre agentes

- **No cambies la rama del espacio de trabajo principal sin avisar:** Gabi lo usa con `npm run dev` en el puerto 3000. Para otra rama, usa un `git worktree` aparte.
- No corras `npm run build` en la carpeta del servidor de desarrollo (pisa `.next`): hazlo en el worktree.
- No incluyas archivos ajenos en los commits (por ejemplo, `.DS_Store`).
- Al terminar, deja en el PR qué quedó pendiente y qué se simuló, para que el próximo agente siga desde ahí.
