# Integración con main, dev y PRs

Adopción solicitada el 8-nov-2026. Las reglas están en [CLAUDE.md §7](../CLAUDE.md); este documento registra el procedimiento y la transición. La creación de `dev` no despliega Cloudflare ni modifica producción.

## Ramas y revisión

`main` → `dev` → `feat/*`, `fix/*` o `chore/*`. Cada módulo vuelve por PR a `dev`; una versión aceptada vuelve por PR de `dev` a `main`. Ambos destinos requieren aprobación de Gabi y merge commit. La rama predeterminada sigue siendo `main`.

Para iniciar trabajo, sin cambiar el checkout principal:

```sh
git fetch origin
git worktree add .worktrees/mi-modulo -b feat/mi-modulo origin/dev
cd .worktrees/mi-modulo/frontend
npm ci
```

Si la rama tiene workspace y lockfile en la raíz, sustituye la instalación por `npm ci --prefix ..`, ejecutado desde `frontend/`. Usa un puerto propio y no ejecutes builds en el checkout principal.

## Transición del backend

| Orden | Rama | Destino inicial | Estado al preparar la transición |
|---|---|---|---|
| 1 | `chore/gitflow` ([#46](https://github.com/gaabrielavelasquez/tiendly/pull/46)) | `dev` | Integrado en `dev` con merge commit `b8f6f38`. |
| 2 | `chore/cierre-la-bodega` ([#45](https://github.com/gaabrielavelasquez/tiendly/pull/45)) | `dev` | Integrado en `dev` con merge commit `dfc5f9c`. |
| 3 | `chore/cloudflare-foundation` ([#47](https://github.com/gaabrielavelasquez/tiendly/pull/47)) | `dev` | Experimento vinext y prueba D1; aceptación de runtime pendiente. |
| 4 | `feat/identity-stores` ([#48](https://github.com/gaabrielavelasquez/tiendly/pull/48)) | `chore/cloudflare-foundation` | Identidad/tiendas; Google real pendiente. |
| 5 | `feat/catalog` ([#49](https://github.com/gaabrielavelasquez/tiendly/pull/49)) | `feat/identity-stores` | Catálogo/R2; bucket y aceptación remotos pendientes. |
| 6 | `feat/onboarding-d1` ([#50](https://github.com/gaabrielavelasquez/tiendly/pull/50)) | `feat/catalog` | Integración recuperada de 32 archivos; aceptación E2E pendiente. |

Se preservan los commits y la pila existentes. Tras aprobar e integrar cada base, cambiar el destino del PR dependiente a `dev`, comprobar conflictos y volver a ejecutar CI. Los PRs funcionales permanecen como borradores mientras falte aceptación. La documentación del estado de módulos está en el PR #45 y en los traspasos de las ramas de implementación.

## Resguardo local

Los worktrees de implementación y documentación se movieron desde `/private/tmp` a `.worktrees/cloudflare` y `.worktrees/cierre-bodega`, dentro del proyecto. El checkout principal sigue en `main`; su modificación previa de `AGENTS.md` no pertenece a estos PRs.

Antes de guardar la integración se creó `.backend-rescue/20261108-gitflow/`: bundle de las referencias originales, diff binario y archivo de los 32 archivos modificados/nuevos con manifiesto SHA-256. El contenido se cotejó después del traslado. Ambas carpetas son locales e ignoradas por Git y por `.vercelignore`; no publicar variables, estado de Wrangler ni credenciales.

## CI y entornos

`.github/workflows/ci.yml` ejecuta instalación desde lockfile, tokens, build Next y tipos. Cuando existen, también verifica tipos/tests locales de backend y build Cloudflare. Next y vinext se ejecutan en secuencia; `typecheck` debe regenerar los tipos de Next si el build vinext los reemplazó. CI no recibe secretos de Cloudflare, Google, Redis o Vercel ni ejecuta migraciones remotas.

Los PRs #45/#46 ya están integrados en `dev`. Las ramas #47–#50 incorporan esa base mediante merge commits y ejecutan CI. En infraestructura el paquete backend todavía es un scaffold sin scripts: CI usa `--if-present`; desde identidad, los scripts de tipos/tests sí existen y se ejecutan. No se integraron PRs funcionales a `dev`.

La primera ejecución de [CI del PR #46](https://github.com/gaabrielavelasquez/tiendly/actions/runs/42525671412) pasó en GitHub: instalación, tokens, build Next y tipos. Los pasos condicionales de backend/Cloudflare no ejercitaron esos módulos, porque esa rama todavía no los contiene. En la pila local completa sí pasan los 12 tests de backend, tipos, tokens y ambos builds; la evidencia está en `docs/verificacion/gitflow-20261108.json` de #50.

La aceptación local posterior de #50 cubre Chrome/WebKit en 360/390/1440, formularios/persistencia, imágenes R2 decodificadas y errores recuperables. Usa sesiones sintéticas; Google real y aceptación desplegada continúan pendientes. Ver el informe `docs/verificacion/d1-local/README.md` en la rama de #50.

El preview Cloudflare de la app, su base D1 y su bucket R2 siguen pendientes de aprovisionamiento y aceptación. `dev` todavía no tiene despliegue conectado. No configurar variables de producción para resolver esa falta.

## Configuración que requiere administración

La cuenta usada tiene permiso de escritura y no de administración. Queda pendiente que Gabi configure protección para `main` y `dev`: exigir PR, aprobación y el check `CI / Tokens, build y pruebas`, impedir force-push y borrado, y mantener habilitados merge commits. No exigir historial lineal: impediría ese método. No se cambiaron permisos ni ajustes del repo.

## Antes de publicar la migración

Completar Google real, R2 remoto, onboarding/producto/vitrina persistidos, ventas/reservas/cupones, comandos de configuración, tareas y aceptación local/preview. Pagos, bancos, SUNAT, envíos y comunicaciones siguen simulados. La migración usa D1 relacional desde el inicio; no supone importar Redis/Blob. El corte, DNS, recursos y datos de producción requieren aprobación específica de Gabi.
