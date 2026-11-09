# Integración con main, dev y PRs

Estado actualizado el 9-nov-2026, después de integrar [#53](https://github.com/gaabrielavelasquez/tiendly/pull/53) en `dev` con merge commit `01ab186`. Las reglas siguen en [CLAUDE.md §7](../CLAUDE.md); este documento registra su procedimiento y adopción.

## Estado actual

- `main` sigue en `e635050`, sin publicación de la migración Cloudflare. La rama predeterminada continúa siendo `main`.
- `dev` contiene infraestructura, identidad/tiendas, catálogo/R2 y onboarding/D1; desde #53 también contiene el dominio y la configuración Google del preview publicado.
- Preview activo: **https://preview.tiendly.workers.dev**, Worker `preview`, D1 `tiendly-preview` y bucket privado `tiendly-preview-images`. Google real está verificado. El Worker anterior `tiendly-preview` se conserva como referencia, sin Google; no es el origen vigente.
- La validación y el despliegue son pasos distintos: CI comprueba el código; **Cloudflare todavía se despliega manualmente**. Un merge en `dev` no publica el Worker ni ejecuta migraciones.
- Las protecciones de `main` y `dev` siguen pendientes de una cuenta administradora. Las reglas de revisión y merge commit ya son obligatorias por el workflow, aunque GitHub aún no las impone.
- La migración de comercio no está completa. Ventas/pedidos, checkout/reservas, cupones, guardados de configuración/Mi tienda y tareas siguen pendientes.

## Iniciar un módulo sin cambiar el checkout principal

`.devflow.json` fija `dev` como rama de integración. En Orca, la base predeterminada del proyecto se configuró como `origin/dev`; los worktrees externos se hicieron visibles. Estas preferencias de Orca son locales, no se configuran al clonar el repo.

Con el flujo dev-flow/Orca, después de cargar la skill `orca-cli` y resolver el ejecutable de la sesión:

```sh
git fetch origin
orca worktree create --name mi-modulo --branch feat/mi-modulo --base-branch origin/dev --json
```

La respuesta contiene la ruta y el ID exactos del worktree. Usa esa ruta para editar y ejecutar comandos. Orca guarda sus worktrees en su directorio persistente configurado; en este equipo es `/Users/diego/orca/workspaces/tiendly/`. No uses `/private/tmp` para checkouts de trabajo.

Sin Orca se puede usar un worktree duradero dentro del proyecto:

```sh
git fetch origin
git worktree add .worktrees/mi-modulo -b feat/mi-modulo origin/dev
cd .worktrees/mi-modulo/frontend
npm ci --prefix ..
```

El repo usa workspaces y lockfile en la raíz. Los comandos npm se ejecutan desde `frontend/`; `npm ci --prefix ..` instala el workspace completo. Usa un puerto propio, conserva el 3100 de Gabi y ejecuta los builds solo en el worktree aislado.

El PR del módulo apunta a `dev`. Para dependencias apiladas, publicación `dev` → `main`, hotfixes, validación y aprobación, consulta [CLAUDE.md §7](../CLAUDE.md). Al abrir el PR desde Orca, vincula su número al worktree y déjalo en revisión. No hagas merge de un PR nuevo por una aprobación dada para otro.

## Integración completada

| PR | Módulo | Integración |
|---|---|---|
| [#46](https://github.com/gaabrielavelasquez/tiendly/pull/46) | Workflow y CI. | En `dev`, merge commit `b8f6f38`. |
| [#45](https://github.com/gaabrielavelasquez/tiendly/pull/45) | Cierre documental de la-bodega. | En `dev`, merge commit `dfc5f9c`. |
| [#47](https://github.com/gaabrielavelasquez/tiendly/pull/47) | Infraestructura Cloudflare. | En `dev`, merge commit `08d896f`. |
| [#48](https://github.com/gaabrielavelasquez/tiendly/pull/48) | Identidad y tiendas. | Integrado en la pila funcional y alcanzable desde `dev` por #52. |
| [#49](https://github.com/gaabrielavelasquez/tiendly/pull/49) | Catálogo y R2. | Integrado en la pila funcional y alcanzable desde `dev` por #52. |
| [#50](https://github.com/gaabrielavelasquez/tiendly/pull/50) | Formularios/onboarding D1. | Integrado en catálogo y alcanzable desde `dev` por #52. |
| [#51](https://github.com/gaabrielavelasquez/tiendly/pull/51) | Primer puente de despliegue. | Cerrado, sustituido; su cambio se incorporó en #52. |
| [#52](https://github.com/gaabrielavelasquez/tiendly/pull/52) | Integración de la app y D1/R2 de preview. | En `dev`, merge commit `41bea81`. |
| [#53](https://github.com/gaabrielavelasquez/tiendly/pull/53) | Dominio vigente y Google separado. | En `dev`, merge commit `01ab186`; merge autorizado por Diego el 9-nov. |

La pila conserva su historial. Los informes del 8-nov describen el estado de cada aceptación cuando se ejecutó; sus pendientes históricos no sustituyen el estado actual de este documento.

## Worktrees y resguardo local

El 8-nov se recuperaron implementación y documentación en `.worktrees/cloudflare` y `.worktrees/cierre-bodega`. El 9-nov se trasladaron los otros dos checkouts temporales:

| Rama conservada | Ruta anterior | Ruta persistente, relativa al proyecto |
|---|---|---|
| `chore/cloudflare-first-preview` | `/private/tmp/tiendly-cloudflare-preview` | `.worktrees/cloudflare-preview-legacy` |
| `feat/cloudflare-preview-storage` | `/private/tmp/tiendly-cloudflare-storage` | `.worktrees/cloudflare-storage-legacy` |

Son archivos de trabajo histórico, no bases para módulos nuevos. Se movieron completos con `git worktree move`, sin borrar ramas ni archivos. HEAD y estado limpio se cotejaron antes y después. SHA-256 confirmó que se preservaron 1 784 y 1 856 archivos de configuración privada/runtime, respectivamente. No había procesos con su directorio de trabajo dentro de esas rutas.

Antes del traslado se guardaron un bundle de ambas ramas y manifiestos locales en `.backend-rescue/worktree-move-20261109/`. El resguardo anterior permanece en `.backend-rescue/20261108-gitflow/`. No publiques esas carpetas, variables, estado de Wrangler ni credenciales. `.worktrees/` y `.backend-rescue/` están ignoradas por Git y excluidas de Vercel.

El checkout principal continúa en `dev`, actualizado a `01ab186` sin cambiar de rama. La limpieza documental se trabaja por separado en `chore/gitflow-cleanup`, creada desde ese `origin/dev` mediante Orca. Los demás worktrees históricos se conservan; no se retiró ninguno.

## CI, aceptación y despliegue

[CI](../.github/workflows/ci.yml) instala desde lockfile, verifica tokens, build Next y tipos, y comprueba tipos/tests de backend, build vinext y manifiesto de preview. Next y vinext se compilan en secuencia porque comparten archivos generados. CI no recibe secretos de aplicación ni ejecuta migraciones remotas.

Evidencia por alcance:

- [Aceptación local D1](verificacion/d1-local/README.md): formularios, persistencia, imágenes, fallos recuperables y conflictos con sesiones sintéticas, Chromium/WebKit a 360/390/1440.
- [Aceptación remota D1/R2](verificacion/d1-r2-preview/README.md): seis recorridos de tienda/producto, 36 checkpoints, subida y lectura R2, conflictos y limpieza de fixtures en el Worker anterior. No comprueba Google.
- [Dominio y OAuth actuales](verificacion/oauth-preview/README.md): Google aceptado y sesión real en D1, tienda/producto persistidos, 18 comprobaciones públicas y prueba sintética de R2 en el origen vigente.
- [Auditoría del 9-nov](verificacion/gitflow-20261109.json): 48 cargas de página y seis recorridos de carrito, APIs protegidas, inicio OAuth y lectura D1 sin escrituras. No repite ingreso Google ni guardados autenticados; las páginas del panel sin sesión muestran la demo.

Tokens, builds Next/vinext, tipos, 14 tests de backend y tres pruebas del manifiesto pasaron en el head de #53. La combinación integrada no cambia su árbol de código. Persisten avisos documentados de vinext. El producto de la cuenta real aún no tenía foto en R2 en la última lectura; la evidencia sintética de almacenamiento no se presenta como subida desde esa cuenta.

Para desplegar de forma manual desde un worktree validado, ejecuta en `frontend/`:

```sh
npm run deploy:cloudflare-preview
```

El comando usa el perfil Wrangler `tiendly` y conserva los secretos ya cargados. No regenera secretos de sesión ni ejecuta migraciones. `migrate:cloudflare-preview` es una operación remota separada: no forma parte del paso normal de crear rama, abrir PR o hacer merge. La automatización de despliegues queda como módulo posterior, con credenciales y recursos exclusivos de preview.

## Protecciones pendientes

La cuenta utilizada tiene escritura, sin administración; no se cambiaron protecciones ni permisos. [Configuración exacta para una cuenta administradora](configuracion/github-protecciones.md).

## Pendiente antes de publicar la migración

Implementar ventas/pedidos, stock/reservas, checkout, cupones, comandos de configuración/Mi tienda y tareas. Después, completar la aceptación del core loop desplegado. Las tiendas D1 todavía reciben pedidos/inventario/cupones vacíos y las operaciones antiguas de escritura se rechazan; que una pantalla cargue no acredita esas acciones.

Pagos, SUNAT, bancos, envíos y comunicaciones siguen simulados. No se importaron datos de Redis/Blob. Producción, su dominio, recursos, migraciones y corte necesitan aprobación específica de Gabi; actualizar `dev` no los habilita.
