# Documentación de Tiendly

Índice de `docs/`. Las reglas de trabajo están en [`AGENTS.md`](../AGENTS.md), [`CLAUDE.md`](../CLAUDE.md) y [`frontend/DESIGN.md`](../frontend/DESIGN.md); este índice solo dice dónde está cada cosa.

## Para empezar

1. [`docs/traspaso.md`](traspaso.md): estado actual, pendientes y riesgos vigentes.
2. [`docs/decisiones/README.md`](decisiones/README.md): decisiones de producto y diseño, con su estado.
3. [`docs/plan-backend.md`](plan-backend.md): arquitectura y orden de la migración de backend.

## Mapa

| Ruta | Qué contiene |
|---|---|
| [`traspaso.md`](traspaso.md) | Estado actual y pendientes. Es lo primero que se lee. |
| [`plan-backend.md`](plan-backend.md) | Plan vigente de D1, API y migración de comercio. |
| [`backlog.md`](backlog.md) | Lo decidido pero todavía no construido. |
| [`decisiones/`](decisiones/README.md) | Una decisión por archivo (0013, 0020–0046). Manda la más reciente. |
| [`configuracion/`](configuracion/entornos.md) | Entornos local/QA/producción, Google OAuth y protecciones de GitHub. |
| [`backend/`](backend/separacion-api.md) | API separada, criterios heredados y cierre del traspaso de `la-bodega`. |
| [`verificacion/`](verificacion/backend-api/README.md) | Informes de aceptación con capturas y JSON. Evidencia, no estado. |
| [`capturas/`](capturas/) | Capturas de revisión de PRs anteriores. Evidencia histórica. |
| [`historia/`](historia/) | Documentos cerrados: plan del 29-oct, estado del Core Loop de octubre y guion de test con tiendas. **No describe el estado actual.** |

## Criterio de limpieza (15-nov-2026)

- Los briefs de implementación y las revisiones de Figma de octubre se borraron: su contenido vive en el código y en las decisiones.
- El plan del 29-oct, el estado del Core Loop de octubre y el guion de test con tiendas se movieron a `docs/historia/`, cada archivo con un aviso al inicio.
- `docs/traspaso.md` dejó de ser un log: ahora es el estado y se sobrescribe. El detalle por sesión va en la descripción del PR; el registro cronológico anterior quedó en el historial de git.
- Las capturas y los informes de verificación se conservan como evidencia de PR. No son fuente de verdad sobre el estado.
