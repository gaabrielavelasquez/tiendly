# Desarrollo local, QA y producción

Topología acordada el 13-nov-2026. `dev` es la rama de integración; QA es el único entorno alojado de pruebas. No se crea un tercer Worker llamado `dev`.

| Entorno | App | Datos | Publicación |
|---|---|---|---|
| Desarrollo local | `http://localhost:3215`, vinext/Vite y workerd. | D1 `tiendly-local` y R2 `tiendly-local-images`, emulados en `frontend/.wrangler/state/`. | `npm run dev:cloudflare`. |
| QA / preview | `https://preview.tiendly.workers.dev`, Worker `preview`. | D1 `tiendly-preview`, R2 `tiendly-preview-images`. | Publicación local con Wrangler, perfil `tiendly`; CI valida el código. |
| Producción actual | `https://tiendly-web-sigma.vercel.app`, desde `main`. | Redis/Blob existentes. | Flujo existente de Vercel. |
| Producción Cloudflare, pendiente | Sin Worker ni dominio definitivo. | Recursos productivos separados todavía pendientes. | Requiere completar comercio, aceptación y aprobación específica del corte. |

## Arrancar desarrollo

Desde `frontend/` en un worktree duradero de `dev` o de un módulo:

```sh
npm ci --prefix ..
npm run dev:cloudflare
```

Requiere Node compatible con `package.json` y Python 3. El comando comprueba que 3215 esté libre, genera tokens/assets, crea `.dev.vars` privado si falta y arranca Vite con puerto estricto. Cuando aparece el binding D1 local, aplica las migraciones pendientes con `backend/scripts/migrate-local.py`. Repetirlo conserva el secreto y los datos locales. Ctrl+C cierra su propio Worker. No ejecuta migraciones remotas ni instala datos de ejemplo en D1.

React dev usa `console.createTask`, cuyo stub de workerd lanza `ERR_METHOD_NOT_IMPLEMENTED`. El servidor local añade `disable_nodejs_console_module` para que React use su fallback; el build QA conserva sus flags. Referencias: [issue de workerd](https://github.com/cloudflare/workerd/issues/6408) y [flag oficial](https://developers.cloudflare.com/workers/configuration/compatibility-flags/#enable-nodejs-console-module).

El callback de Vite cambia exclusivamente el servidor de desarrollo a los nombres locales y `TIENDLY_ENTORNO=local`; el build sigue usando QA. `remoteBindings: false` desactiva los bindings remotos. La base local tiene un ID ficticio, distinto de QA. Los datos del emulador permanecen ignorados por Git dentro de cada worktree.

`.dev.vars` se crea con permiso 0600 y secreto de sesión aleatorio exclusivo de la máquina/worktree. No se imprime ni se regenera al reiniciar. El comando rechaza orígenes distintos de `http://localhost:3215`, secretos vacíos, una pareja Google incompleta y cambios del entorno local. No copiar variables de Vercel ni secretos productivos.

Para ingresar realmente, configurar en `.dev.vars` la pareja del cliente **Tiendly Preview** y autorizar `http://localhost:3215/api/auth/callback/google`. Ver [Google OAuth](google-oauth.md). Sin Google se puede revisar la demo; no se habilita ingreso alternativo. Una sesión sintética del harness no acredita OAuth real.

El servidor de Gabi en 3100 y los scripts Next existentes se conservan. Next no suministra los bindings del backend D1: para trabajar en la migración usar `dev:cloudflare`.

## Publicar QA con el perfil local

El perfil Wrangler `tiendly` ya tiene la sesión local de la cuenta Tiendly. No hace falta crear un API token para publicar desde esta máquina. Desde un **commit limpio**, en `frontend/`:

```sh
npm run release:qa
```

Este comando ejecuta tests, tipos y builds Next/vinext en secuencia; verifica el artefacto, publica con `npx --no-install wrangler deploy --profile tiendly --config .wrangler/preview/wrangler.json` y comprueba el QA publicado. Si ya se completaron los checks Next/backend, `npm run deploy:cloudflare-preview` repite el build/tipos Cloudflare y la publicación/verificación. Solo toca el Worker existente `preview` y conserva los secretos. No ejecuta migraciones remotas.

### Automatización alojada, opcional

El job `verify` de `.github/workflows/ci.yml` valida tokens, tests de entornos, builds Next/vinext, tipos, backend y manifiesto. Solo para `dev` guarda el artefacto compilado de ese SHA. GitHub no tiene acceso a la sesión local del perfil Wrangler. Por la preferencia de usar ese perfil, **el job `deploy-qa` queda desactivado**: requiere la variable `QA_AUTO_DEPLOY=true`, que no se configura en este módulo.

Si después se decide activar el despliegue desde GitHub, quien tenga administración debe crear el entorno `qa` limitado a `dev`, añadir `CLOUDFLARE_QA_API_TOKEN` con Workers Editor limitado al Worker `preview`, y solo entonces activar `QA_AUTO_DEPLOY`. El job depende de la validación, descarga ese mismo artefacto, confirma su commit y que `dev` no haya avanzado, publica y ejecuta el smoke de solo lectura. PRs y `main` no lo ejecutan. No se copia el perfil OAuth a GitHub ni se solicita un token para el flujo local elegido.

Los secretos Google y Better Auth se conservan en el Worker; no viajan a GitHub. El manifiesto permite solo la cuenta Tiendly, Worker `preview`, D1/R2 de QA y variables públicas conocidas. CI no ejecuta `migrate:cloudflare-preview`; un cambio de esquema necesita su paso remoto separado. Los despliegues QA se serializan y una ejecución antigua que ya no coincida con `dev` se rechaza.

Referencias: [Cloudflare: GitHub Actions](https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/), [roles por Worker y bindings](https://developers.cloudflare.com/workers/authorization/workers/), [datos locales](https://developers.cloudflare.com/workers/local-development/local-data/).

## Saber qué está publicado

`GET /_tiendly/health` devuelve estado, entorno, SHA y comprobaciones booleanas de configuración OAuth, migraciones D1 y acceso R2. Es de solo lectura, sin datos de tiendas ni valores secretos y con `no-store`/`noindex`. Un esquema atrasado, falta de secretos o binding inaccesible devuelve 503. No acredita Google completo ni el core loop de comercio.

`release.json` se genera junto al artefacto y registra SHA, estado limpio/sucio y migraciones esperadas. La publicación exige un commit limpio y el mismo HEAD que el artefacto; no se atribuye código sin commit a un SHA anterior. La publicación local informa URL/SHA; la automatización opcional también los registra en Actions. Desde el worktree que construyó el artefacto:

```sh
npm run verify:qa
```

El smoke exige ese SHA, health 200 y noindex, Registro/MUÑA 200, APIs de negocio 401 sin sesión, sesión pública null y rutas privadas 404. No crea tiendas, pedidos, sesiones o imágenes.

## Fallos y recuperación

- Credencial ausente o sin permisos: falla el job QA antes de publicar; el build/artefacto permanecen disponibles. Corregir el secreto del entorno y repetir el workflow desde `dev`.
- Health 503 después de publicar: revisar bindings, secretos y migraciones; el smoke falla y no ejecuta migraciones ni rollback automático.
- Necesidad de rollback: elegir la versión anterior conocida del Worker `preview`, con aprobación para esa operación y sin cambiar secretos. No asumir que volver código revierte un esquema.
- Producción: no recibe este artefacto, sus secretos ni los datos de QA. El corte Cloudflare sigue pendiente del módulo de comercio y su aceptación.

## Límites funcionales

Identidad, tiendas y catálogo/fotos están conectados a D1/R2. Ventas/pedidos, stock/reservas, checkout, cupones, guardados de configuración/Mi tienda y tareas siguen pendientes. Pagos, SUNAT, bancos, envíos y comunicaciones continúan simulados. No se importan datos desde Redis/Blob en este módulo.
